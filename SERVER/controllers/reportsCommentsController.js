const pool = require('../config/db');

const getCommentReport = async (req, res, next) => {
  try {
    // Query to fetch report history with post content and sender
    const query = `
    SELECT 
      cr.id AS report_id,
      cr.comment_id,
      cr.reported_by,
      cr.reported_at,
      cr.status,
      cr.reason,
      pc.commenter,
      pc.content AS comment_content,
      pc.post_id
    FROM post_comments_reports cr
    JOIN posts_comments pc ON cr.comment_id = pc.id
    WHERE cr.status = 'Reported'
    ORDER BY cr.reported_at DESC;
  `;
  
    // Execute the query
    const { rows } = await pool.query(query);
  
    if (rows.length === 0) {
      return res.status(200).json([]); 
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching comments reports', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Get hidden posts
const getHiddenComments = async (req, res, next) => {
  try {

    const checkQuery = `
      SELECT 
        cr.*, 
        c.content, 
        c.commenter, 
        c.date, 
        c.is_deleted,
        c.post_id
      FROM post_comments_reports cr
      JOIN posts_comments c ON cr.comment_id = c.id
      WHERE cr.status = 'Inappropriate';
    `;

    const { rows } = await pool.query(checkQuery);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving hidden comments:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ok a reported comment
const reportCommentOk = async (req, res) => {
  const { commentId } = req.params;

  try {
    console.log("Hit controller report Comment Ok")
    // Update the status in post_reports
    const result = await pool.query(
      `UPDATE post_comments_reports
       SET status = $1
       WHERE comment_id = $2
       RETURNING id;`,
      ['Ok', commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No report found for this comment ID' });
    }

    const reportId = result.rows[0].id;

    res.status(200).json({ message: 'Report status updated', reportId });
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Server error updating report' });
  }
};

// Add report history 
const addCommentReportHistory = async (req, res) => {
  const { commentId, changedBy, newStatus, note } = req.body;

  try {
    console.log("Hit controller addCommentReportHistory")
    // Get report ID from post_id
    const report = await pool.query(
      `SELECT id FROM post_comments_reports WHERE comment_id = $1`,
      [commentId]
    );

    if (report.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found for this comment' });
    }

    const reportId = report.rows[0].id;

    console.log ("addCommentHistory reportId", reportId)

    // Insert into history table
    await pool.query(
      `INSERT INTO post_comment_report_history (report_id, changed_by, changed_at, new_status, note)
       VALUES ($1, $2, NOW(), $3, $4);`,
      [reportId, changedBy, newStatus, note]
    );

    res.status(201).json({ message: 'Report history logged' });
  } catch (err) {
    console.error('Error inserting report history:', err);
    res.status(500).json({ error: 'Server error inserting report history' });
  }
};

//Check if a comment has been reported
const hasReported = async (req, res, next) => {
  try {
    const { comment_id, user_id } = req.query;

    if (!comment_id || !user_id) {
      return res.status(400).json({ error: 'comment_id and user_id are required as query parameters.' });
    }

    const checkQuery = `
      SELECT 1 FROM post_comments_reports
      WHERE comment_id = $1 AND reported_by = $2 AND status = 'Reported'
      LIMIT 1;
    `;
    const values = [comment_id, user_id];
    const { rows } = await pool.query(checkQuery, values);

    const hasReported = rows.length > 0;

    console.log("hasReported", hasReported)

    return res.status(200).json({ hasReported });
  } catch (error) {
    console.error('Error checking if comment has been reported:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Report a comment
const reportComment = async (req, res, next) => {
  try {
    // console.log("reportPost in reportsController");

    const { comment_id, reported_by, reason } = req.body;

    if (!comment_id || !reported_by) {
      return res.status(400).json({ error: 'comment_id and reported_by are required.' });
    }

    // Begin transaction
    await pool.query('BEGIN');

    // Check if the comment_id already exists in post_comments_reports
    const existingPostQuery = `
      SELECT * FROM post_comments_reports WHERE comment_id = $1;
    `;
    const { rows: existingPostRows } = await pool.query(existingPostQuery, [comment_id]);
    
    if (existingPostRows.length > 0 && existingPostRows[0].status === 'Inappropriate') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot report a comment marked as Inappropriate.' });
    }

    let report;
    const status = 'Reported'; 
    const reportedAt = new Date(); 

    if (existingPostRows.length > 0) {
      // Post exists, update the record
      const updateReportQuery = `
        UPDATE post_comments_reports
        SET status = $1, reported_by = $2, reported_at = $3, reason = $4
        WHERE comment_id = $5
        RETURNING *;
      `;
      const updateReportValues = [status, reported_by, reportedAt, reason || null, comment_id];
      const { rows: updatedRows } = await pool.query(updateReportQuery, updateReportValues);
      report = updatedRows[0];
    } else {
      // Post doesn't exist, insert a new record
      const insertReportQuery = `
        INSERT INTO post_comments_reports (comment_id, reported_by, reason, status, reported_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const insertReportValues = [comment_id, reported_by, reason || null, status, reportedAt];
      const { rows: insertedRows } = await pool.query(insertReportQuery, insertReportValues);
      report = insertedRows[0];
    }

    // Insert into post_report_history
    const historyQuery = `
      INSERT INTO post_comment_report_history (report_id, changed_by, new_status, note)
      VALUES ($1, $2, $3, $4)
    `;
    const historyValues = [report.id, reported_by, status, reason || null];
    await pool.query(historyQuery, historyValues);

    // Commit transaction
    await pool.query('COMMIT');

    return res.status(201).json({ message: 'Comment reported successfully', report });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error reporting a comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
getCommentReport,
getHiddenComments,
reportCommentOk,
addCommentReportHistory,
hasReported,
reportComment
};

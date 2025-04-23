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

module.exports = {
getCommentReport,
getHiddenComments,
reportCommentOk,
addCommentReportHistory
};

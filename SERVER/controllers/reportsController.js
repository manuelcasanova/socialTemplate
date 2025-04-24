const pool = require('../config/db');

//Check if a post has been reported
const hasReported = async (req, res, next) => {
  try {
    const { post_id, user_id } = req.query;

    if (!post_id || !user_id) {
      return res.status(400).json({ error: 'post_id and user_id are required as query parameters.' });
    }

    const checkQuery = `
      SELECT 1 FROM post_reports
      WHERE post_id = $1 AND reported_by = $2 AND status = 'Reported'
      LIMIT 1;
    `;
    const values = [post_id, user_id];
    const { rows } = await pool.query(checkQuery, values);

    const hasReported = rows.length > 0;

    return res.status(200).json({ hasReported });
  } catch (error) {
    console.error('Error checking if post has been reported:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Check if a post has been hidden by a moderator
const hasHidden = async (req, res, next) => {
  try {
    const { post_id, user_id } = req.query;

    if (!post_id || !user_id) {
      return res.status(400).json({ error: 'post_id and user_id are required as query parameters.' });
    }

    const checkQuery = `
      SELECT 1 FROM post_reports
      WHERE post_id = $1 AND reported_by = $2 AND status = 'Inappropriate'
      LIMIT 1;
    `;
    const values = [post_id, user_id];
    const { rows } = await pool.query(checkQuery, values);

    const hasHidden = rows.length > 0;

    return res.status(200).json({ hasHidden });
  } catch (error) {
    console.error('Error checking if post has been flagged as inappropriate:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Get hidden posts
const getHiddenPosts = async (req, res, next) => {
  try {

    const checkQuery = `
      SELECT 
        pr.*, 
        p.content, 
        p.sender, 
        p.date, 
        p.visibility, 
        p.is_deleted
      FROM post_reports pr
      JOIN posts p ON pr.post_id = p.id
      WHERE pr.status = 'Inappropriate';
    `;

    const { rows } = await pool.query(checkQuery);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving hidden posts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Report a post
const reportPost = async (req, res, next) => {
  try {
    // console.log("reportPost in reportsController");

    const { post_id, reported_by, reason } = req.body;

    if (!post_id || !reported_by) {
      return res.status(400).json({ error: 'post_id and reported_by are required.' });
    }

    // Begin transaction
    await pool.query('BEGIN');

    // Check if the post_id already exists in post_reports
    const existingPostQuery = `
      SELECT * FROM post_reports WHERE post_id = $1;
    `;
    const { rows: existingPostRows } = await pool.query(existingPostQuery, [post_id]);
    
    if (existingPostRows.length > 0 && existingPostRows[0].status === 'Inappropriate') {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot report a post marked as Inappropriate.' });
    }

    let report;
    const status = 'Reported'; 
    const reportedAt = new Date(); 

    if (existingPostRows.length > 0) {
      // Post exists, update the record
      const updateReportQuery = `
        UPDATE post_reports
        SET status = $1, reported_by = $2, reported_at = $3, reason = $4
        WHERE post_id = $5
        RETURNING *;
      `;
      const updateReportValues = [status, reported_by, reportedAt, reason || null, post_id];
      const { rows: updatedRows } = await pool.query(updateReportQuery, updateReportValues);
      report = updatedRows[0];
    } else {
      // Post doesn't exist, insert a new record
      const insertReportQuery = `
        INSERT INTO post_reports (post_id, reported_by, reason, status, reported_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const insertReportValues = [post_id, reported_by, reason || null, status, reportedAt];
      const { rows: insertedRows } = await pool.query(insertReportQuery, insertReportValues);
      report = insertedRows[0];
    }

    // Insert into post_report_history
    const historyQuery = `
      INSERT INTO post_report_history (report_id, changed_by, new_status, note)
      VALUES ($1, $2, $3, $4)
    `;
    const historyValues = [report.id, reported_by, status, reason || null];
    await pool.query(historyQuery, historyValues);

    // Commit transaction
    await pool.query('COMMIT');

    return res.status(201).json({ message: 'Post reported successfully', report });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error reporting a post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting post report history
const getPostReportHistory = async (req, res, next) => {
  try {
    // console.log("hit getPostReportHistory")


    // Query to fetch report history for the specified post_id
    const query = `
      SELECT * FROM post_report_history
      ORDER BY changed_at DESC;
    `;

    // Execute the query
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching post report history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPostReport = async (req, res, next) => {
  try {
    // Query to fetch report history with post content and sender
    const query = `
      SELECT 
        pr.id AS report_id,
        pr.post_id,
        pr.reported_by,
        pr.reported_at,
        pr.status,
        pr.reason,
        p.sender,
        p.content
      FROM post_reports pr
      JOIN posts p ON pr.post_id = p.id
      WHERE pr.status = 'Reported'
      ORDER BY pr.reported_at DESC;
    `;

    // Execute the query
    const { rows } = await pool.query(query);
  
    if (rows.length === 0) {
      return res.status(200).json([]); 
    }


    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching post report history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ok a reported post
const reportPostOk = async (req, res) => {
  const { postId } = req.params;

  try {
    // Update the status in post_reports
    const result = await pool.query(
      `UPDATE post_reports
       SET status = $1
       WHERE post_id = $2
       RETURNING id;`,
      ['Ok', postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No report found for this post ID' });
    }

    const reportId = result.rows[0].id;

    res.status(200).json({ message: 'Report status updated', reportId });
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Server error updating report' });
  }
};

// Add report history 
const addReportHistory = async (req, res) => {
  const { postId, changedBy, newStatus, note } = req.body;

  try {
    // Get report ID from post_id
    const report = await pool.query(
      `SELECT id FROM post_reports WHERE post_id = $1`,
      [postId]
    );

    if (report.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found for this post' });
    }

    const reportId = report.rows[0].id;

console.log ("addReportHistory reportId", reportId)

    // Insert into history table
    await pool.query(
      `INSERT INTO post_report_history (report_id, changed_by, changed_at, new_status, note)
       VALUES ($1, $2, NOW(), $3, $4);`,
      [reportId, changedBy, newStatus, note]
    );

    res.status(201).json({ message: 'Report history logged' });
  } catch (err) {
    console.error('Error inserting report history:', err);
    res.status(500).json({ error: 'Server error inserting report history' });
  }
};

// Mark the post as inappropriate
const reportPostInappropriate = async (req, res) => {
  const { postId } = req.params;

  try {
    // Update the status in post_reports
    const result = await pool.query(
      `UPDATE post_reports
       SET status = $1
       WHERE post_id = $2
       RETURNING id;`,
      ['Inappropriate', postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No report found for this post ID' });
    }

    const reportId = result.rows[0].id;
    res.status(200).json({ message: 'Report status updated to Inappropriate', reportId });
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Server error updating report' });
  }
};


module.exports = {
  reportPost,
  hasReported,
  hasHidden,
  getHiddenPosts,
  getPostReportHistory,
  getPostReport,
  addReportHistory,
  reportPostOk,
  reportPostInappropriate
};

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
    
    let report;
    const status = 'Reported';  // You can change this based on your requirements
    const reportedAt = new Date();  // Current timestamp for reporting

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

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No report history found.' });
    }

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
      ORDER BY pr.reported_at DESC;
    `;

    // Execute the query
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No report history found.' });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching post report history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  reportPost,
  hasReported,
  getPostReportHistory,
  getPostReport
};

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

module.exports = {
getCommentReport,
getHiddenComments
};

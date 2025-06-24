


const pool = require('../config/db');

// Helper to convert local date+time string with fixed offset to ISO UTC string
function localDateTimeToUTCISO(localDate, localTime, offsetMinutes) {
  if (!localDate) {
    throw new Error("localDate is required");
  }

  let timeStr = '00:00:00';

  if (localTime) {
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(localTime)) {
      timeStr = localTime.length === 5 ? `${localTime}:00` : localTime;
    } else {
      throw new Error(`Invalid time format: ${localTime}`);
    }
  }

  const [year, month, day] = localDate.split('-').map(Number);
  const [hour, minute, second] = timeStr.split(':').map(Number);

  if (
    !year || !month || !day ||
    isNaN(year) || isNaN(month) || isNaN(day) ||
    hour === undefined || minute === undefined || second === undefined ||
    isNaN(hour) || isNaN(minute) || isNaN(second)
  ) {
    throw new Error(`Invalid date/time parts: ${localDate} ${timeStr}`);
  }

  const dateUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  dateUtc.setMinutes(dateUtc.getMinutes() - offsetMinutes);

  return dateUtc.toISOString();
}

const getLoginHistory = async (req, res) => {
  try {
    const {
      user_id,
      username,
      email,
      from_date,
      to_date,
      from_time,
      to_time,
    } = req.query;

    const localOffsetMinutes = -7 * 60; // Fixed offset

    let query = `
      SELECT
        lh.user_id,
        COALESCE(u.username, '') AS username,
        COALESCE(u.email, '') AS email,
        lh.login_time
      FROM login_history lh
      LEFT JOIN users u ON lh.user_id = u.user_id
      WHERE 1=1
    `;

    const queryParams = [];

    if (user_id) {
      if (isNaN(user_id)) {
        return res.status(400).json({ error: 'Invalid user_id format' });
      }
      query += ` AND lh.user_id = $${queryParams.length + 1}`;
      queryParams.push(user_id);
    }

    if (username) {
      query += ` AND u.username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${username}%`);
    }

    if (email) {
      query += ` AND u.email ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${email}%`);
    }

    // Handle date + time filtering (converted to UTC)
    if (from_date) {
      try {
        const fromTime = from_time || '00:00:00';
        const fromUTC = localDateTimeToUTCISO(from_date, fromTime, localOffsetMinutes);
        query += ` AND lh.login_time >= $${queryParams.length + 1}`;
        queryParams.push(fromUTC);
        // console.log(`From filter local: ${from_date} ${fromTime} offset ${localOffsetMinutes}min → UTC ${fromUTC}`);
      } catch (err) {
        return res.status(400).json({ error: `Invalid from_date or from_time: ${err.message}` });
      }
    }

    if (to_date) {
      try {
        const toTime = to_time || '23:59:59';
        const toUTC = localDateTimeToUTCISO(to_date, toTime, localOffsetMinutes);
        query += ` AND lh.login_time <= $${queryParams.length + 1}`;
        queryParams.push(toUTC);
        // console.log(`To filter local: ${to_date} ${toTime} offset ${localOffsetMinutes}min → UTC ${toUTC}`);
      } catch (err) {
        return res.status(400).json({ error: `Invalid to_date or to_time: ${err.message}` });
      }
    }

    // Handle time-only filtering when no date provided
    if (!from_date && from_time) {
      if (!/^\d{2}:\d{2}(:\d{2})?$/.test(from_time)) {
        return res.status(400).json({ error: 'Invalid from_time format' });
      }
      const fromTimeFixed = from_time.length === 5 ? `${from_time}:00` : from_time;
      query += ` AND lh.login_time::time >= $${queryParams.length + 1}::time`;
      queryParams.push(fromTimeFixed);
      // console.log(`From time-only filter: ${fromTimeFixed}`);
    }

    if (!to_date && to_time) {
      if (!/^\d{2}:\d{2}(:\d{2})?$/.test(to_time)) {
        return res.status(400).json({ error: 'Invalid to_time format' });
      }
      const toTimeFixed = to_time.length === 5 ? `${to_time}:00` : to_time;
      query += ` AND lh.login_time::time <= $${queryParams.length + 1}::time`;
      queryParams.push(toTimeFixed);
      // console.log(`To time-only filter: ${toTimeFixed}`);
    }

    query += ` ORDER BY lh.login_time DESC`;

    // console.log('Final SQL:', query);
    // console.log('Query params:', queryParams);

    const result = await pool.query(query, queryParams);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching login history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getLoginHistory };

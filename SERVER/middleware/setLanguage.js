const pool = require('../config/db'); 

const setLanguage = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      // console.log('No user ID, skipping language change');
      return next();
    }

    const result = await pool.query(
      'SELECT preferred_language FROM users WHERE id = $1',
      [userId]
    );

    const lang = result.rows[0]?.preferred_language;
    // console.log('User preferred language:', lang);

    if (lang && req.i18n) {
      req.language = lang;
      req.i18n.changeLanguage(lang);
      console.log('Changed i18n language to:', req.i18n.language);
    } else {
      console.log('req.i18n not available or language missing');
    }
  } catch (err) {
    console.error('Error setting language:', err);
  }

  next();
};

module.exports = setLanguage;
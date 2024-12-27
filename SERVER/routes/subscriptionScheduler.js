const cron = require('node-cron');
const pool= require('../config/db'); 

const scheduleSubscriptionUpdates = () => {
  cron.schedule('0 0 * * *', async () => { // Runs daily at midnight

    try {
      const result = await pool.query(`
        UPDATE subscriptions
        SET is_active = false
        WHERE renewal_due_date < NOW() AND is_active = true;
      `);
      console.log(`${result.rowCount} subscriptions updated`);
    } catch (error) {
      console.error('Error updating subscriptions:', error);
    }
  });
};

module.exports = scheduleSubscriptionUpdates;

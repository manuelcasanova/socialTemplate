const cron = require('node-cron');
const pool = require('../config/db');

const scheduleSubscriptionUpdates = () => {
  cron.schedule('0 0 * * *', async () => { // Runs daily at midnight

    try {
      const updateSubscriptions = await pool.query(`
        UPDATE subscriptions
        SET is_active = false
        WHERE renewal_due_date < NOW() AND is_active = true;
      `);

      // Remove the 'User_subscribed' role (role_id = 2) from the user_roles table for users with expired subscriptions
      const removeUserSubscribedRole = await pool.query(`
         DELETE FROM user_roles
         WHERE role_id = 2
         AND user_id IN (
         SELECT user_id
         FROM subscriptions
         WHERE is_active = false AND renewal_due_date < NOW()
        );
      `);
      console.log(`${updateSubscriptions.rowCount} subscriptions updated at ${Date.now()}`);
      console.log(`${removeUserSubscribedRole.rowCount} roles removed at ${Date.now()}`);
    } catch (error) {
      console.error('Error updating subscriptions:', error);
    }
  });
};

module.exports = scheduleSubscriptionUpdates;

-- Insert roles with hierarchical structure
INSERT INTO roles (role_name) VALUES 
  ('User_not_subscribed'),    
  ('User_subscribed'),           
  ('Moderator'),                 
  ('Admin'),                     
  ('SuperAdmin');               


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture, location) VALUES 
  ('Manuel_super', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Super Admin City'),
  ('Laura_a', 'admin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Admin City'),
  ('Vanessa_m', 'moderator@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user_pic.jpg', 'Moderator Town'),
    ('Aurora_s', 'user_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City'),
  ('Manolo_not_s', 'user_not_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City')
;

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) VALUES
  (1, 1, 1),
  (1, 5, 1),
 
  (2, 1, 1), 
  (2, 4, 2), 

  (3, 1, 1),
  (3, 3, 1), 

  (4, 1, 1),  
  (4, 2, 1), 

  (5, 1, 1);  

INSERT INTO subscriptions (user_id, start_date, renewal_due_date, is_active, created_by_user_id) 
VALUES 
(4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year 7 days', true, 4);

-- For testing expired subscription:

-- INSERT INTO subscriptions (user_id, start_date, renewal_due_date, is_active, created_by_user_id) 
-- VALUES 
-- (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 seconds', true, 4);





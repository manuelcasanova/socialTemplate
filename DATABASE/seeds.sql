-- Insert roles with hierarchical structure
INSERT INTO roles (role_name) VALUES 
  ('User_not_subscribed'),    
  ('User_subscribed'),           
  ('Moderator'),                 
  ('Admin'),                     
  ('SuperAdmin');               


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture, location) VALUES 
  ('SuperAdmin', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Super Admin City'),
  ('Admin', 'admin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Admin City'),
  ('Moderator', 'moderator@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user_pic.jpg', 'Moderator Town'),
    ('Subscribed', 'user_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City'),
  ('NotSubscribed', 'user_not_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City')
;

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) VALUES
  (1, 1, NULL),
  (1, 5, 1),
 
  (2, 1, NULL), 
  (2, 4, 2), 

  (3, 1, NULL),
  (3, 3, NULL), 

  (4, 1, NULL),  
  (4, 2, NULL), 

  (5, 1, NULL);  



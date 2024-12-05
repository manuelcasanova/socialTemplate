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

INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1),  -- SuperAdmin
  (1, 2),  -- Admin
  (1, 3),  -- Moderator
  (1, 4),  -- User_subscribed
  (1, 5),  -- User_not_subscribed

  (2, 3),  
  (2, 4), 
  (2, 5),

  (3, 2), 
  (3, 3),

  (4, 2),  

  (5, 1);  


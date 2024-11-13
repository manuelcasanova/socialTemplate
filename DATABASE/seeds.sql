-- Insert roles with hierarchical structure
INSERT INTO roles (role_name, parent_role_id) VALUES 
  ('User', NULL),  -- User has no parent
  ('Moderator', 1),  -- Moderator inherits from User
  ('Admin', 2),  -- Admin inherits from Moderator
  ('SuperAdmin', 3);  -- SuperAdmin inherits from Admin


INSERT INTO users (username, email, password, is_verified, role_id, is_selected, is_active, is_subscribed, profile_picture, location, last_login) VALUES 
  ('Name Super Admin User', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, 4, true, true, true, 'admin_pic.jpg', 'Super Admin City', CURRENT_TIMESTAMP),
  ('Name Admin User', 'admin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, 3, true, true, true, 'admin_pic.jpg', 'Admin City', CURRENT_TIMESTAMP),
  ('Name Moderator', 'moderator@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, 2, false, true, false, 'user_pic.jpg', 'Moderator Town', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('Name User - Not subscribed', 'user_not_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, 1, false, true, false, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('Name User - Subscribed', 'user_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, 1, false, true, true, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Insert user roles (assigning multiple roles to users based on hierarchy)
INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 4),  -- SuperAdmin gets all roles (User, Moderator, Admin, SuperAdmin)
  (1, 3),  -- Admin gets Admin and User (inherited from SuperAdmin)
  (1, 2),  -- Admin also gets Moderator
  (1, 1),  -- Admin also gets User
  (2, 3),  -- Admin gets Admin and User
  (2, 2),  -- Admin also gets Moderator
  (3, 2),  -- Moderator gets Moderator and User
  (3, 1),  -- Moderator also gets User
  (4, 1);  -- User only gets User



INSERT INTO login_history (user_id, login_time) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '5 days');

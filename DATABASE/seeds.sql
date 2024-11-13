-- Insert roles with hierarchical structure
INSERT INTO roles (role_name, parent_role_id) VALUES 
  ('User_not_subscribed', NULL),    -- No parent role
  ('User_subscribed', 1),           -- Inherits from User_not_subscribed
  ('Moderator', 2),                 -- Inherits from User_subscribed
  ('Admin', 3),                     -- Inherits from Moderator
  ('SuperAdmin', 4);                -- Inherits from Admin


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture, location, last_login) VALUES 
  ('Name Super Admin User', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Super Admin City', CURRENT_TIMESTAMP),
  ('Name Admin User', 'admin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Admin City', CURRENT_TIMESTAMP),
  ('Name Moderator', 'moderator@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user_pic.jpg', 'Moderator Town', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('Name User - Subscribed', 'user_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('Name User - Not subscribed', 'user_not_subscribed@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days')
;

-- Insert user roles
INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 5),  -- User 1: SuperAdmin (inherits all roles)
  (1, 4),  -- User 1: Admin (inherits Admin and SuperAdmin roles)
  (1, 3),  -- User 1: Moderator (inherits Moderator, Admin, and SuperAdmin roles)
  (1, 2),  -- User 1: User_subscribed (inherits User_subscribed, Moderator, Admin, and SuperAdmin roles)
  (1, 1),  -- User 1: User_not_subscribed (inherits User_not_subscribed, User_subscribed, Moderator, Admin, and SuperAdmin roles)

  (2, 4),  -- User 2: Admin (inherits Admin and User_subscribed roles)
  (2, 3),  -- User 2: Moderator (inherits Moderator, Admin, and User_subscribed roles)
  (2, 2),  -- User 2: User_subscribed (inherits User_subscribed, Moderator, and Admin roles)
  (2, 1),  -- User 2: User_not_subscribed (inherits User_not_subscribed, User_subscribed, Moderator, and Admin roles)

  (3, 3),  -- User 3: Moderator (inherits Moderator and User_subscribed roles)
  (3, 2),  -- User 3: User_subscribed (inherits User_subscribed and Moderator roles)
  (3, 1),  -- User 3: User_not_subscribed (inherits User_not_subscribed and User_subscribed roles)

  (4, 1),  -- User 4: User_not_subscribed (inherits only User_not_subscribed)
  (4, 2),

  (5, 1);




INSERT INTO login_history (user_id, login_time) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '5 days');

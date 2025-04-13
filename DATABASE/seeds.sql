-- Insert roles with hierarchical structure
INSERT INTO roles (role_name) VALUES 
  ('User_not_subscribed'),    
  ('User_subscribed'),           
  ('Moderator'),                 
  ('Admin'),                     
  ('SuperAdmin');               


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture) VALUES 
  ('Superadministrator', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
  ,
  -- ;
  ('Manuel', 'manucasanova@hotmail.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
  ;
--     ('Laura', 'laura@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
-- ;

-- INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture, location) VALUES
--   ('Superadministrator', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Super Admin City'),
--   ('Admin', 'admin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg', 'Admin City'),
--   ('Moderator', 'moderator@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'moderator_pic.jpg', 'Moderator Town'),
--   ('User1', 'user1@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user1_pic.jpg', 'User City'),
--   ('User2', 'user2@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user2_pic.jpg', 'Userville'),
--   ('User3', 'user3@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, false, true, 'user3_pic.jpg', 'Userplace');
  
-- INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest) VALUES
  -- Manuel follows Superadministrator (accepted status)
  --  (2, 1, 'accepted', CURRENT_TIMESTAMP, false);
  
  -- Superadministrator follows Manuel (accepted status)
  -- (1, 2, 'accepted', CURRENT_TIMESTAMP, false);

  -- Manuel requests to follow Superadministrator (pending status)
  -- (2, 1, 'pending', CURRENT_TIMESTAMP, true);

  -- Superadministrator requests to follow Manuel (pending status)
  -- (1, 2, 'pending', CURRENT_TIMESTAMP, true);

  -- Manuel follows Superadministrator (pending status) again, simulating a new request
  --  (2, 1, 'pending', CURRENT_TIMESTAMP, true);

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (1, 5, 1)
  -- ,
  -- (2, 5, 2)
  -- ,
  -- (3, 1, 1)
  ;  
-- Assuming current timestamp is April 13, 2025, 1:20 PM UTC
-- User 1 posts
INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '5 seconds', 'public', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '5 minutes', 'followers', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'private', false),
  (1, 'This is a post from User 1, about 30 hours ago.', CURRENT_TIMESTAMP - INTERVAL '30 hours', 'public', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '7 days', 'followers', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month', 'private', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months', 'followers', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years', 'public', false);

-- User 2 posts
INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '10 seconds', 'private', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '10 minutes', 'public', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'followers', false),
  (2, 'This is a post from User 2, about 30 hours ago.', CURRENT_TIMESTAMP - INTERVAL '30 hours', 'private', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '7 days', 'followers', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month', 'private', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months', 'public', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years', 'followers', false);

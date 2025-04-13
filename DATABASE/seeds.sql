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
  
INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest) VALUES
  -- Manuel follows Superadministrator (accepted status)
   (2, 1, 'accepted', CURRENT_TIMESTAMP, false),
  
  -- Superadministrator follows Manuel (accepted status)
  (1, 2, 'accepted', CURRENT_TIMESTAMP, false);

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
-- User 1 Posts
INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '5 seconds', 'public', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '5 minutes', 'followers', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'private', false),
  (1, 'This is a post from User 1, about 30 hours ago.', CURRENT_TIMESTAMP - INTERVAL '30 hours', 'public', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '7 days', 'followers', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month', 'private', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months', 'followers', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years', 'public', false),
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '6 seconds', 'private', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '6 minutes', 'followers', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '4 hours', 'public', false),
  (1, 'This is a post from User 1, about 31 hours ago.', CURRENT_TIMESTAMP - INTERVAL '31 hours', 'followers', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '8 days', 'private', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 1 day', 'followers', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 1 day', 'public', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 1 day', 'followers', false),
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '7 seconds', 'followers', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '7 minutes', 'private', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'followers', false),
  (1, 'This is a post from User 1, about 32 hours ago.', CURRENT_TIMESTAMP - INTERVAL '32 hours', 'public', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '9 days', 'private', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 2 days', 'followers', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 2 days', 'private', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 2 days', 'public', false),
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '8 seconds', 'private', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '8 minutes', 'followers', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'public', false),
  (1, 'This is a post from User 1, about 33 hours ago.', CURRENT_TIMESTAMP - INTERVAL '33 hours', 'private', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '10 days', 'followers', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 3 days', 'private', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 3 days', 'followers', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 3 days', 'private', false),
  (1, 'This is a post from User 1, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '9 seconds', 'followers', false),
  (1, 'This is a post from User 1, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '9 minutes', 'public', false),
  (1, 'This is a post from User 1, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '7 hours', 'private', false),
  (1, 'This is a post from User 1, about 34 hours ago.', CURRENT_TIMESTAMP - INTERVAL '34 hours', 'followers', false),
  (1, 'This is a post from User 1, a week ago.', CURRENT_TIMESTAMP - INTERVAL '11 days', 'public', false),
  (1, 'This is a post from User 1, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 4 days', 'followers', false),
  (1, 'This is a post from User 1, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 4 days', 'private', false),
  (1, 'This is a post from User 1, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 4 days', 'followers', false);

-- User 2 Posts
INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '10 seconds', 'private', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '10 minutes', 'public', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'followers', false),
  (2, 'This is a post from User 2, about 30 hours ago.', CURRENT_TIMESTAMP - INTERVAL '30 hours', 'private', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '7 days', 'followers', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month', 'private', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months', 'public', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years', 'followers', false),
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '15 seconds', 'public', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '15 minutes', 'followers', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'private', false),
  (2, 'This is a post from User 2, about 31 hours ago.', CURRENT_TIMESTAMP - INTERVAL '31 hours', 'public', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '8 days', 'followers', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 1 day', 'private', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 1 day', 'followers', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 1 day', 'public', false),
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '20 seconds', 'followers', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '20 minutes', 'private', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '7 hours', 'followers', false),
  (2, 'This is a post from User 2, about 32 hours ago.', CURRENT_TIMESTAMP - INTERVAL '32 hours', 'public', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '9 days', 'private', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 2 days', 'followers', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 2 days', 'private', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 2 days', 'followers', false),
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '25 seconds', 'private', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '25 minutes', 'followers', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '8 hours', 'private', false),
  (2, 'This is a post from User 2, about 33 hours ago.', CURRENT_TIMESTAMP - INTERVAL '33 hours', 'followers', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '10 days', 'public', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 3 days', 'followers', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 3 days', 'private', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 3 days', 'public', false),
  (2, 'This is a post from User 2, a few seconds ago.', CURRENT_TIMESTAMP - INTERVAL '30 seconds', 'followers', false),
  (2, 'This is a post from User 2, a few minutes ago.', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'private', false),
  (2, 'This is a post from User 2, a few hours ago.', CURRENT_TIMESTAMP - INTERVAL '9 hours', 'public', false),
  (2, 'This is a post from User 2, about 34 hours ago.', CURRENT_TIMESTAMP - INTERVAL '34 hours', 'followers', false),
  (2, 'This is a post from User 2, a week ago.', CURRENT_TIMESTAMP - INTERVAL '11 days', 'private', false),
  (2, 'This is a post from User 2, a month ago.', CURRENT_TIMESTAMP - INTERVAL '1 month 4 days', 'followers', false),
  (2, 'This is a post from User 2, 11 months ago.', CURRENT_TIMESTAMP - INTERVAL '11 months 4 days', 'public', false),
  (2, 'This is a post from User 2, 2 years ago.', CURRENT_TIMESTAMP - INTERVAL '2 years 4 days', 'private', false);

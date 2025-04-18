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
  ('Manuel', 'manucasanova@hotmail.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
  ,
    ('Laura', 'laura@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
    ,
    ('James', 'james@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Emma', 'emma@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Michael', 'michael@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Sophia', 'sophia@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Daniel', 'daniel@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Olivia', 'olivia@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('William', 'william@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Ava', 'ava@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Benjamin', 'benjamin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
('Isabella', 'isabella@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg');

  
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

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id)
VALUES
(1, 1, 1),
(2, 1, 2),
(1, 5, 1),
(3, 1, 1),
(4, 1, 1),
(5, 1, 1),
(6, 1, 1),
(7, 1, 1),
(8, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1),
(13, 1, 1);

/*
INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu malesuada nisi. Morbi et magna sem. Donec est augue, sodales.', CURRENT_TIMESTAMP - INTERVAL '25 hours', 'public', false),
  (2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu malesuada nisi. Morbi et magna sem. Donec est augue, sodales.', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'public', false);
  ;
  
  
-- Reactions for post ID 1
INSERT INTO posts_reactions (post_id, user_id, reaction_type, date)
VALUES
(1, 1, 'like', '2025-04-01 08:00:00+00'),
(1, 2, 'dislike', '2025-04-02 09:15:00+00');

-- Reactions for post ID 2
INSERT INTO posts_reactions (post_id, user_id, reaction_type, date)
VALUES
(2, 1, 'laugh', '2025-04-03 10:30:00+00'),
(2, 2, 'cry', '2025-04-04 11:45:00+00'),
(2, 3, 'dislike', '2025-04-05 13:00:00+00');


-- Comments for post ID 1
INSERT INTO posts_comments (post_id, commenter, content, date)
VALUES
(1, 2, 'Really liked your point here!', '2025-04-01 08:00:00+00'),
(1, 2, 'This gave me something to think about.', '2025-04-02 09:15:00+00');

-- Comments for post ID 2
INSERT INTO posts_comments (post_id, commenter, content, date)
VALUES
(2, 1, 'I don’t quite see it the same way, but interesting read.', '2025-04-03 10:30:00+00'),
(2, 1, 'Thanks for sharing this perspective!', '2025-04-04 11:45:00+00');

INSERT INTO posts_comments_reactions (comment_id, user_id, reaction_type, date)
VALUES 
(1, 1, 'like', '2025-04-01 08:00:00+00'),
(1, 2, 'dislike', '2025-04-02 09:15:00+00'),
(1, 3, 'laugh', '2025-04-03 10:30:00+00'),
(1, 4, 'smile', '2025-04-04 11:45:00+00'),
(1, 5, 'cry', '2025-04-05 12:00:00+00'),
(1, 6, 'like', '2025-04-06 13:30:00+00'),
(1, 7, 'laugh', '2025-04-07 14:15:00+00'),
(1, 8, 'smile', '2025-04-08 15:00:00+00'),
(1, 9, 'cry', '2025-04-09 16:30:00+00'),
(1, 10, 'dislike', '2025-04-10 17:45:00+00'),
(1, 11, 'like', '2025-04-11 18:00:00+00'),
(1, 12, 'laugh', '2025-04-12 19:15:00+00'),
(1, 13, 'smile', '2025-04-13 20:30:00+00'),

(2, 1, 'dislike', '2025-04-14 08:45:00+00'),
(2, 2, 'cry', '2025-04-15 09:00:00+00'),
(2, 3, 'smile', '2025-04-16 10:30:00+00'),
(2, 4, 'laugh', '2025-04-17 11:45:00+00'),
(2, 5, 'like', '2025-04-18 12:30:00+00'),
(2, 6, 'dislike', '2025-04-19 14:00:00+00'),
(2, 7, 'smile', '2025-04-20 15:15:00+00'),
(2, 8, 'like', '2025-04-21 16:00:00+00'),
(2, 9, 'laugh', '2025-04-22 17:30:00+00'),
(2, 10, 'cry', '2025-04-23 18:45:00+00'),
(2, 11, 'smile', '2025-04-24 19:00:00+00'),
(2, 12, 'like', '2025-04-25 20:15:00+00'),
(2, 13, 'dislike', '2025-04-26 21:30:00+00'),

(3, 1, 'smile', '2025-04-27 08:00:00+00'),
(3, 2, 'laugh', '2025-04-28 09:30:00+00'),
(3, 3, 'like', '2025-04-29 10:45:00+00'),
(3, 4, 'cry', '2025-04-30 12:00:00+00'),
(3, 5, 'dislike', '2025-05-01 13:15:00+00'),
(3, 6, 'smile', '2025-05-02 14:30:00+00'),
(3, 7, 'like', '2025-05-03 15:45:00+00'),
(3, 8, 'laugh', '2025-05-04 16:00:00+00'),
(3, 9, 'smile', '2025-05-05 17:15:00+00'),
(3, 10, 'dislike', '2025-05-06 18:30:00+00'),
(3, 11, 'cry', '2025-05-07 19:45:00+00'),
(3, 12, 'like', '2025-05-08 20:00:00+00'),
(3, 13, 'laugh', '2025-05-09 21:15:00+00'),

(4, 1, 'cry', '2025-05-10 08:30:00+00'),
(4, 2, 'like', '2025-05-11 09:00:00+00'),
(4, 3, 'dislike', '2025-05-12 10:15:00+00'),
(4, 4, 'smile', '2025-05-13 11:30:00+00'),
(4, 5, 'laugh', '2025-05-14 12:45:00+00'),
(4, 6, 'like', '2025-05-15 14:00:00+00'),
(4, 7, 'smile', '2025-05-16 15:15:00+00'),
(4, 8, 'cry', '2025-05-17 16:30:00+00'),
(4, 9, 'dislike', '2025-05-18 17:45:00+00'),
(4, 10, 'laugh', '2025-05-19 19:00:00+00'),
(4, 11, 'like', '2025-05-20 20:15:00+00'),
(4, 12, 'smile', '2025-05-21 21:30:00+00'),
(4, 13, 'cry', '2025-05-22 22:00:00+00');
*/
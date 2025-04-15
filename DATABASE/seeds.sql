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

INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu malesuada nisi. Morbi et magna sem. Donec est augue, sodales.', CURRENT_TIMESTAMP - INTERVAL '25 hours', 'public', false),
  (2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu malesuada nisi. Morbi et magna sem. Donec est augue, sodales.', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'public', false);
  ;

  -- Reactions for post ID 1
INSERT INTO posts_reactions (message_id, user_id, reaction_type)
VALUES
(1, 1, 'like'),
(1, 2, 'dislike');

-- Reactions for post ID 2
INSERT INTO posts_reactions (message_id, user_id, reaction_type)
VALUES
(2, 1, 'laugh'),
(2, 2, 'cry');

-- Comments for post ID 1
INSERT INTO posts_comments (message_id, commenter, content)
VALUES
(1, 2, 'Really liked your point here!'),
(1, 2, 'This gave me something to think about.');

-- Comments for post ID 2
INSERT INTO posts_comments (message_id, commenter, content)
VALUES
(2, 1, 'I don’t quite see it the same way, but interesting read.'),
(2, 1, 'Thanks for sharing this perspective!');

-- Insert roles with hierarchical structure
INSERT INTO roles (role_name) VALUES 
  ('User_not_subscribed'),    
  ('User_subscribed'),           
  ('Moderator'),                 
  ('Admin'),                     
  ('SuperAdmin');               


INSERT INTO users (username, email, password, is_verified, is_selected, is_active, profile_picture) VALUES 
  ('Superadministrator', 'superadmin@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
  ('Manuel', 'manucasanova@hotmail.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg'),
    ('Laura', 'laura@example.com', '$2b$10$EKTRqOF2yxxWcpXC5gtzheoB0Jgr59odbVjgTxTlu196sDXYmU7lq', true, true, true, 'admin_pic.jpg')
;

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
  (1, 5, 1),
  (2, 5, 2),
  (3, 1, 1)
  ;  


-- For testing expired subscription:

-- INSERT INTO subscriptions (user_id, start_date, renewal_due_date, is_active, created_by_user_id) 
-- VALUES 
-- (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 seconds', true, 4);



-- Message 1: User 1 sends a message to User 2
INSERT INTO user_messages (sender, receiver, content, date, status) 
VALUES 
(1, 2, 'Hey, how are you?', '2025-03-15 12:00:00+00', 'sent');

-- Message 2: User 2 sends a message to User 1
INSERT INTO user_messages (sender, receiver, content, date, status) 
VALUES 
(2, 1, 'I am good, how about you?', '2025-03-16 14:00:00+00', 'sent');

-- Message 3: User 1 sends a follow-up message to User 2
INSERT INTO user_messages (sender, receiver, content, date, status) 
VALUES 
(1, 2, 'Glad to hear that! What have you been up to?', '2025-03-20 10:30:00+00', 'sent');

-- Message 4: User 2 sends another message to User 1
INSERT INTO user_messages (sender, receiver, content, date, status) 
VALUES 
(2, 1, 'Just working on some projects. How about you?', '2025-03-22 16:00:00+00', 'sent');

-- -- Test Message: User 1 sends a message to User 2 around April 30, 2025 for testing purposes
-- INSERT INTO user_messages (sender, receiver, content, date, status) 
-- VALUES 
-- (1, 2, 'This is a test message for March 2025.', '2025-03-30 09:00:00+00', 'sent');

-- INSERT INTO user_messages (sender, receiver, content, date, status) 
-- VALUES 
-- (3, 2, 'This is a test message for May 2025.', '2025-04-30 09:00:00+00', 'sent');

-- INSERT INTO user_messages (sender, receiver, content, date, status) 
-- VALUES 
-- (3, 2, 'This is a test message for June 2025.', '2025-06-30 09:00:00+00', 'sent');
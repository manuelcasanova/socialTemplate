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

INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (1, '1', CURRENT_TIMESTAMP - INTERVAL '3 years 8 days', 'public', false),
  (2, '2', CURRENT_TIMESTAMP - INTERVAL '3 years 7 days', 'public', false),
  (1, '3', CURRENT_TIMESTAMP - INTERVAL '3 years 6 days', 'public', false),
  (2, '4', CURRENT_TIMESTAMP - INTERVAL '3 years 5 days', 'public', false),
  (1, '5', CURRENT_TIMESTAMP - INTERVAL '3 years 4 days', 'public', false),
  (2, '6', CURRENT_TIMESTAMP - INTERVAL '3 years 3 days', 'public', false),
  (1, '7', CURRENT_TIMESTAMP - INTERVAL '3 years 2 days', 'public', false),
  (2, '8', CURRENT_TIMESTAMP - INTERVAL '3 years 1 day', 'public', false),
  (1, '9', CURRENT_TIMESTAMP - INTERVAL '3 years', 'public', false),
  (2, '10', CURRENT_TIMESTAMP - INTERVAL '2 years', 'public', false),
  (1, '11', CURRENT_TIMESTAMP - INTERVAL '13 months 8 days', 'public', false),
  (2, '12', CURRENT_TIMESTAMP - INTERVAL '13 months 7 days', 'public', false),
  (1, '13', CURRENT_TIMESTAMP - INTERVAL '13 months 6 days', 'public', false),
  (2, '14', CURRENT_TIMESTAMP - INTERVAL '13 months 5 days', 'public', false),
  (1, '15', CURRENT_TIMESTAMP - INTERVAL '13 months 4 days', 'public', false),
  (2, '16', CURRENT_TIMESTAMP - INTERVAL '13 months 3 days', 'public', false),
  (1, '17', CURRENT_TIMESTAMP - INTERVAL '13 months 2 day', 'public', false),
  (2, '18', CURRENT_TIMESTAMP - INTERVAL '13 months 1 day', 'public', false),
  (1, '19', CURRENT_TIMESTAMP - INTERVAL '12 months', 'public', false),
  (2, '20', CURRENT_TIMESTAMP - INTERVAL '11 months', 'public', false),
  (1, '21', CURRENT_TIMESTAMP - INTERVAL '1 month 8 days', 'public', false),
  (2, '22', CURRENT_TIMESTAMP - INTERVAL '1 month 7 days', 'public', false),
  (1, '23', CURRENT_TIMESTAMP - INTERVAL '1 month 6 days', 'public', false),
  (2, '24', CURRENT_TIMESTAMP - INTERVAL '1 month 5 days', 'public', false),
  (1, '25', CURRENT_TIMESTAMP - INTERVAL '1 month 4 days', 'public', false),
  (2, '26', CURRENT_TIMESTAMP - INTERVAL '1 month 3 days', 'public', false),
  (1, '27', CURRENT_TIMESTAMP - INTERVAL '1 month 2 day', 'public', false),
  (2, '28', CURRENT_TIMESTAMP - INTERVAL '1 month 1 day', 'public', false),
  (1, '29', CURRENT_TIMESTAMP - INTERVAL '2 month', 'public', false),
  (2, '30', CURRENT_TIMESTAMP - INTERVAL '1 month', 'public', false),
  (1, '31', CURRENT_TIMESTAMP - INTERVAL '15 days', 'public', false),
  (2, '32', CURRENT_TIMESTAMP - INTERVAL '14 days', 'public', false),
  (1, '33', CURRENT_TIMESTAMP - INTERVAL '13 days', 'public', false),
  (2, '34', CURRENT_TIMESTAMP - INTERVAL '12 days', 'public', false),
  (1, '35', CURRENT_TIMESTAMP - INTERVAL '11 days', 'public', false),
  (2, '36', CURRENT_TIMESTAMP - INTERVAL '10 days', 'public', false),
  (1, '37', CURRENT_TIMESTAMP - INTERVAL '8 days', 'public', false),
  (2, '38', CURRENT_TIMESTAMP - INTERVAL '9 days', 'public', false),
  (1, '39', CURRENT_TIMESTAMP - INTERVAL '8 days', 'public', false),
  (2, '40', CURRENT_TIMESTAMP - INTERVAL '7 days', 'public', false),
  (1, '41', CURRENT_TIMESTAMP - INTERVAL '44 hours', 'public', false),
  (2, '42', CURRENT_TIMESTAMP - INTERVAL '43 hours', 'public', false),
  (1, '43', CURRENT_TIMESTAMP - INTERVAL '42 hours', 'public', false),
  (2, '44', CURRENT_TIMESTAMP - INTERVAL '41 hours', 'public', false),
  (1, '45', CURRENT_TIMESTAMP - INTERVAL '40 hours', 'public', false),
  (2, '46', CURRENT_TIMESTAMP - INTERVAL '39 hours', 'public', false),
  (1, '47', CURRENT_TIMESTAMP - INTERVAL '38 hours', 'public', false),
  (2, '48', CURRENT_TIMESTAMP - INTERVAL '35 hours', 'public', false),
  (1, '49', CURRENT_TIMESTAMP - INTERVAL '33 hours', 'public', false),
  (2, '50', CURRENT_TIMESTAMP - INTERVAL '31 hours', 'public', false),
  (1, '51', CURRENT_TIMESTAMP - INTERVAL '14 hours', 'public', false),
  (2, '52', CURRENT_TIMESTAMP - INTERVAL '13 hours', 'public', false),
  (1, '53', CURRENT_TIMESTAMP - INTERVAL '12 hours', 'public', false),
  (2, '54', CURRENT_TIMESTAMP - INTERVAL '11 hours', 'public', false),
  (1, '55', CURRENT_TIMESTAMP - INTERVAL '10 hours', 'public', false),
  (2, '56', CURRENT_TIMESTAMP - INTERVAL '9 hours', 'public', false),
  (1, '57', CURRENT_TIMESTAMP - INTERVAL '8 hours', 'public', false),
  (2, '58', CURRENT_TIMESTAMP - INTERVAL '7 hours', 'public', false),
  (1, '59', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'public', false),
  (2, '60', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'public', false),
  (1, '61', CURRENT_TIMESTAMP - INTERVAL '32 minutes', 'public', false),
  (2, '62', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'public', false),
  (1, '63', CURRENT_TIMESTAMP - INTERVAL '26 minutes', 'public', false),
  (2, '64', CURRENT_TIMESTAMP - INTERVAL '25 minutes', 'public', false),
  (1, '65', CURRENT_TIMESTAMP - INTERVAL '21 minutes', 'public', false),
  (2, '66', CURRENT_TIMESTAMP - INTERVAL '20 minutes', 'public', false),
  (1, '67', CURRENT_TIMESTAMP - INTERVAL '17 minutes', 'public', false),
  (2, '68', CURRENT_TIMESTAMP - INTERVAL '15 minutes', 'public', false),
  (1, '69', CURRENT_TIMESTAMP - INTERVAL '11 minutes', 'public', false),
  (2, '70', CURRENT_TIMESTAMP - INTERVAL '10 minutes', 'public', false),
  (1, '71', CURRENT_TIMESTAMP - INTERVAL '31 seconds', 'public', false),
  (2, '72', CURRENT_TIMESTAMP - INTERVAL '30 seconds', 'public', false),
  (1, '73', CURRENT_TIMESTAMP - INTERVAL '26 seconds', 'public', false),
  (2, '74', CURRENT_TIMESTAMP - INTERVAL '25 seconds', 'public', false),
  (1, '75', CURRENT_TIMESTAMP - INTERVAL '21 seconds', 'public', false),
  (2, '76', CURRENT_TIMESTAMP - INTERVAL '20 seconds', 'public', false),
  (1, '77', CURRENT_TIMESTAMP - INTERVAL '16 seconds', 'public', false),
  (2, '78', CURRENT_TIMESTAMP - INTERVAL '15 seconds', 'public', false),
  (1, '79', CURRENT_TIMESTAMP - INTERVAL '11 seconds', 'public', false),
  (2, '80', CURRENT_TIMESTAMP - INTERVAL '10 seconds', 'public', false);

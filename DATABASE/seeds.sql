

INSERT INTO users (username, email, password, is_verified, is_active) VALUES 

 ('Manuel Casanova', 'manuelcasanovafernandez@gmail.com', 'google_auth_token', true, true)
 ,
   ('Administrator', 'admin@socialtemplate.manucasanova.com', '$2b$10$QKnW747LmWgpESSPtJLAGe1ASCXJlEIOthMceP8g7eZzTxU7r32SS', true, true)
 ,
  -- ('Manuel Casanova Hotmail', 'manucasanova@hotmail.com', '$2b$10$Nw6PNvixTqtDhtZWaqmsGOHEi3R/mgo1bxiLdR08KQMr7WLclSNJe', true, true)
  --   ,
  ('Manuel Casanova Yahoo', 'manuelcasanovafernandez@yahoo.es', '$2b$10$Nw6PNvixTqtDhtZWaqmsGOHEi3R/mgo1bxiLdR08KQMr7WLclSNJe', true, true)
    ,
  ('Manuel Casanova Spanish', 'info@casanovaspanish.com', '$2b$10$Nw6PNvixTqtDhtZWaqmsGOHEi3R/mgo1bxiLdR08KQMr7WLclSNJe', true, true)
  ;
  
 /*

-- Insert 50 rows for user_id = 1
INSERT INTO login_history (user_id, login_time)
SELECT 1, NOW() - INTERVAL '1 day' * (RANDOM() * 100) 
FROM generate_series(1, 50);

-- Insert 50 rows for user_id = 2
INSERT INTO login_history (user_id, login_time)
SELECT 2, NOW() - INTERVAL '1 day' * (RANDOM() * 100) 
FROM generate_series(1, 50);

*/

-- Insert roles with hierarchical structure
INSERT INTO roles (role_name, created_by) VALUES 
  ('SuperAdmin', 1),
  ('Admin', 1),
  ('Moderator', 1),
  ('User_subscribed', 1),
  ('User_registered', 1);


  
-- INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest) VALUES
  -- Manuel follows Superadministrator (accepted status)
  --  (2, 1, 'accepted', CURRENT_TIMESTAMP, false),
  
  -- Superadministrator follows Manuel (accepted status)
  -- (1, 2, 'accepted', CURRENT_TIMESTAMP, false);

  -- Manuel requests to follow Superadministrator (pending status)
  -- (2, 1, 'pending', CURRENT_TIMESTAMP, true);

  -- Superadministrator requests to follow Manuel (pending status)
  -- (1, 2, 'pending', CURRENT_TIMESTAMP, true);

  -- Manuel follows Superadministrator (pending status) again, simulating a new request
  --  (2, 1, 'pending', CURRENT_TIMESTAMP, true);

INSERT INTO user_roles (user_id, role_id, assigned_by_user_id)
VALUES

(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(1, 4, 1),
(1, 5, 1),

(2, 2, 1),
(2, 3, 1),
(2, 5, 1)

,

(3, 1, 1),
(3, 5, 3),

(4, 1, 3),
(4, 5, 4)

;

INSERT INTO global_provider_settings (
  show_posts_feature,
  allow_user_post,
  allow_admin_post,
  allow_post_interactions,
  allow_comments,
  allow_post_reactions,
  allow_comment_reactions,
  allow_delete_posts,
  allow_flag_posts,
  allow_delete_comments,
  allow_flag_comments,
  show_messages_feature,
  allow_send_messages,
  allow_delete_messages,
  show_social_feature,
  allow_follow,
  allow_mute,
  allow_manage_roles,
  allow_delete_users,
  show_profile_feature,
  allow_edit_username,
  allow_edit_email,
  allow_edit_password,
  allow_delete_my_user,
  allow_modify_profile_picture,
  show_subscriber_feature,
  show_manage_roles_feature,
  allow_admin_create_custom_role,
  allow_admin_edit_custom_role,
  allow_admin_delete_custom_role,
  show_superadmin_in_users_admin,
  show_superadmin_in_social

) VALUES (
  true, true, true, true, true, true, true, true, true, true, true,
  true, true, true, true, true, true, true, true, true, true, false,
  true, true, true, true, true, true, true, true, true, true
);

INSERT INTO admin_settings (
  show_posts_feature,
  allow_user_post,
  allow_admin_post,
  allow_post_interactions,
  allow_comments,
  allow_post_reactions,
  allow_comment_reactions,
  allow_delete_posts,
  allow_flag_posts,
  allow_delete_comments,
  allow_flag_comments,
  show_messages_feature,
  allow_send_messages,
  allow_delete_messages,
  show_social_feature,
  allow_follow,
  allow_mute,
  show_profile_feature,
  allow_edit_username,
  allow_edit_email,
  allow_edit_password,
  allow_delete_my_user,
  allow_modify_profile_picture

) VALUES (
  true, true, true, true, true, true, true, true, true, true, true,
  true, true, true, true, true, true, true, true, false, true, true,
  true
);


INSERT INTO posts (sender, content, date, visibility, is_deleted)
VALUES
  (2, 'Hi! Welcome to the app. Play with this post. Flag it as inappropriate, log in as an administrator or a moderator and approve it or hide it!', CURRENT_TIMESTAMP - INTERVAL '25 hours', 'public', false),

  (2, 'You can write your own posts, privately, for followers only or open to the public!', CURRENT_TIMESTAMP - INTERVAL '24 hours', 'public', false),

  (2, 'Try commenting one of the posts, flag the comment as inappropriate and manage it as a moderator.', CURRENT_TIMESTAMP - INTERVAL '23 hours', 'public', false),

  (2, 'React to a post or comment, thumbs up, smile, laugh…', CURRENT_TIMESTAMP - INTERVAL '22 hours', 'public', false),

  (2, 'Login as an administrator and play with all the features. Modify your own user’s roles, for example.', CURRENT_TIMESTAMP - INTERVAL '21 hours', 'public', false),

  (2, 'Follow a user, send private messages, mute a user so they cannot interact with you (you won’t be able to see their posts or comments either).', CURRENT_TIMESTAMP - INTERVAL '20 hours', 'public', false);

  

-- INSERT INTO posts_comments (post_id, commenter, content, date)
-- VALUES
-- (1, 1, 'Comment 1 to post 1', '2025-04-03 10:30:00+00'),  
-- (1, 1, 'Comment 2 to post 1', '2025-04-04 10:30:00+00')
-- ;

-- INSERT INTO post_comments_reports (comment_id, reported_by, reported_at, status,reason ) 
-- VALUES 
-- ( 1, 2, NOW(), 'Reported', 'This comment contains offensive language and violates community guidelines.'),
-- ( 2, 2, NOW(), 'Inappropriate', 'This comment contains offensive language and violates community guidelines.');

-- INSERT INTO post_comment_report_history 
-- (report_id, changed_by, changed_at, new_status, note)
-- VALUES(1, 1, NOW(), 'Inappropriate', 'This comment contains offensive language and violates community guidelines.');

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


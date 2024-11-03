INSERT INTO roles (role_name) VALUES 
('User'),
('Moderator'),
('Admin'),
('SuperAdmin');

INSERT INTO users (username, email, password, is_verified, role_id, is_selected, is_active, is_subscribed, profile_picture, location, last_login) VALUES 
('Name Super Admin User', 'superadmin@example.com', 'hashed_password_123', true, 4, true, true, true, 'admin_pic.jpg', 'Super Admin City', CURRENT_TIMESTAMP),
('Name Admin User', 'admin@example.com', 'hashed_password_123', true, 3, true, true, true, 'admin_pic.jpg', 'Admin City', CURRENT_TIMESTAMP),
('Name Moderator', 'moderator@example.com', 'hashed_password_456', true, 2, false, true, false, 'user_pic.jpg', 'Moderator Town', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Name User - Not subscribed', 'user_not_subscribed@example.com', 'hashed_password_789', true, 1, false, true, false, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('Name User - Subscribed', 'user_subscribed@example.com', 'hashed_password_789', true, 1, false, true, true, 'mod_pic.jpg', 'User City', CURRENT_TIMESTAMP - INTERVAL '2 days');
;


INSERT INTO login_history (user_id, login_time) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, CURRENT_TIMESTAMP - INTERVAL '5 days');

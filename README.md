*** INTRODUCTION ***

Here’s a template for a full-stack web development project that provides a solid foundation for any application.

It features user login and logout functionality, a database connection for user management, social features for user interaction and messaging, role-based access controls for different subpages, and a basic layout complete with a navigation bar.

It is built using a PostgreSQL database, with ExpressJS and Node.js powering the backend, and ReactJS handling the frontend.

*** FEATURES ***

  *** Roles and Role Administration ***

There are five distinct roles in the system:

SuperAdmin: The highest-level role, with access to all administrative functionalities.
Admin: A role with significant permissions, but limited in terms of managing SuperAdmin roles.
Moderator: A role typically used for managing content or user interactions, but with fewer privileges than Admins.
Subscribed: A role for users who are subscribed (e.g., via a paid option).
NotSubscribed: A role for registered users who have not subscribed.
SuperAdmin permissions:

SuperAdmins can grant or revoke any role, including Admin, Moderator, Subscribed, and NotSubscribed.
SuperAdmins cannot revoke their own SuperAdmin role.
A SuperAdmin can only revoke the SuperAdmin role if they were the one who assigned it; they cannot revoke it if another SuperAdmin granted the role.
Admin permissions:

Admins can assign and revoke roles for Moderator, Subscribed, and NotSubscribed users.
Admins cannot assign or revoke the SuperAdmin or Admin roles. Only SuperAdmins can manage Admin roles.

  *** Protected routes ***

The system includes protected routes, and roles are not hierarchical. This means that:

A user with the Admin role does not automatically have access to routes assigned to lower roles like Moderator or Subscribed.
For access to protected routes associated with these roles, the user must have the specific role assigned to them in addition to their Admin privileges.

  *** Profile Management ***

Users have the ability to manage their profiles, including:

Modifying their username, email, and password.
Uploading or updating their profile picture.
Deleting their account entirely.

*** ENVIRONMENTAL VARIABLES ***

  *** Backend ***

  #PORT
PORT=

#BACKEND URL
REMOTE_CLIENT_APP = http://...

#ALLOWED ORIGINS, FOR CORS
ALLOWED_ORIGINS=http://...

#POSTGRESQL
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=

# JWT Secrets 
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# RESET PASSWORD
RESET_EMAIL_PASSWORD=
RESET_EMAIL_CLIENT=
RESET_EMAIL_PORT=
RESET_EMAIL = 

  *** Frontend ***

# BACKEND URL

REACT_APP_BACKEND_URL=http://...
REACT_APP_FRONTEND_URL=http://...
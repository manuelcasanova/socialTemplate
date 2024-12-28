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

Whenever a role is assigned or revoked, a log is created detailing who performed the modification, to whom it was applied, the type of modification (assignment or revocation), and the timestamp. This log is accessible to superadmins in the admin section of the app. Typically, only admins and superadmins can modify roles, with one exception: when a user subscribes to the app. After the payment is processed, the "User_subscribed" role is automatically added on behalf of the user, and this is recorded in the log accordingly.

  *** Protected routes ***

The system includes protected routes, and roles are not hierarchical. This means that:

A user with the Admin role does not automatically have access to routes assigned to lower roles like Moderator or Subscribed.
For access to protected routes associated with these roles, the user must have the specific role assigned to them in addition to their Admin privileges.

  *** Subscriptions ***

Users may subscribe to gain access to specific routes. The "User_subscribed" role is assigned to all subscribed users and serves to bypass the RequireAuth middleware. However, additional safeguards are in place. A user may retain the "User_subscribed" role even if their subscription has expired or become inactive. In such cases, access to these routes is denied through mechanisms outside of RequireAuth.

Administrators also have the authority to revoke a user's subscription status. While revoking an active subscription—especially one a user has paid for—may seem unfair, this capability is necessary to address situations such as policy violations or fraudulent activity. To ensure accountability, all role changes, including subscription revocations, are logged as previously described.

  *** Profile Management ***

Users have the ability to manage their profiles, including:

Modifying their username, email, and password.
Uploading or updating their profile picture.
Deleting their account entirely.

  *** Deleting an account ***

Users can delete their accounts, but the process involves a soft deletion. When an account is deleted, its status is set to inactive, and the email is modified to inactive-TIMESTAMP-email@email.com. If the user attempts to sign up again with the same email address, they will see a prompt offering two options:

Restore the Previous Account: This will reactivate their old account (including its original ID and all associated records).
Create a New Account: This will create a completely new account with a fresh ID and no connection to the previous records.
Currently, admins and superadmins cannot delete user accounts. However, they can revoke the "User_subscribed" role, which limits the user’s access to public pages only.

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
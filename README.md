*** INTRODUCTION ***

This full-stack web development project provides a versatile template for building applications with a broad range of functionalities. 

It features user login and logout functionality, a database connection for user management, social features for user interaction and messaging, role-based access controls, and a robust profile management system. Additionally, it includes features like post creation, moderation, and subscriptions for premium access, allowing admins to easily toggle functionalities and control the app's complexity based on the needs of the community. The app's flexible structure is designed to accommodate both basic and advanced configurations, making it suitable for simple community platforms or more complex social networks.

Built using a PostgreSQL database, ExpressJS and Node.js on the backend, and ReactJS for the frontend, this template supports a variety of use cases, from simple user interactions to more intricate social networking systems. With role-based access, content moderation tools, and detailed user activity logs, it provides a solid foundation for secure and scalable application development.

*** FEATURES ***

  *** Roles and Role Administration ***

There are five distinct roles in the system:

SuperAdmin: The highest-level role, with access to all administrative functionalities.
Admin: A role with significant permissions, but limited in terms of managing SuperAdmin roles.
Moderator: A role typically used for managing content or user interactions, but with fewer privileges than Admins.
User_subscribed: A role for users who are subscribed (e.g., via a paid option).
User_registered: A role for registered users who have not subscribed.

SuperAdmin permissions:

SuperAdmins can grant or revoke any role, including Admin, Moderator, User_subscribed, and User_registered.
SuperAdmins cannot revoke their own SuperAdmin role.
A SuperAdmin can only revoke the SuperAdmin role if they were the one who assigned it. They cannot revoke it if another SuperAdmin granted the role. The only exception is the SuperAdmin with userId 1, ensuring that there is always someone with the authority to make this change.

Admin permissions:

Admins can assign and revoke roles for Moderator, User_subscribed, and User_registered users.
Admins cannot assign or revoke the SuperAdmin or Admin roles. Only SuperAdmins can manage Admin roles.

  *** Role Logs ***

Whenever a role is assigned or revoked, a log is created detailing who performed the modification, to whom it was applied, the type of modification (assignment or revocation), and the timestamp. This log is accessible to SuperAdmins in the admin section of the app. Typically, only Admins and SuperAdmins can modify roles, with one exception: when a user subscribes to the app. After the payment is processed, the "User_subscribed" role is automatically added on behalf of the user, and this is recorded in the log accordingly.

If a user who originally granted specific roles loses their permissions—either through revocation by a higher-tier admin or account deletion—the authority to manage the roles they assigned transfers to the higher-tier admin. This ensures that role-based control remains uninterrupted and properly delegated within the system.

 *** Other Logs ***

SuperAdmins have the ability to view the login history for all users. They can filter the history based on user ID, username, email, date, and time.

*** Protected routes ***

The system includes protected routes and a partially hierarchical role structure. 

Specifically:

Super Admins are automatically granted the roles of Admin, Moderator, and Subscribed, but they do not automatically receive access to any custom roles. 

To access custom routes associated with these roles, the user must be explicitly assigned each role individually, even if they already have higher-level privileges.

*** Registration ***

Users can register by providing a unique username, email, and password. Upon successful registration, the account is created with an "inactive" status, and a verification email is sent to the provided address to activate the account. This helps prevent unauthorized registrations.

Passwords are encrypted before being stored, and the app developers do not have access to the plain text password.

If the user doesn't receive the email, accidentally deletes it, or the activation window expires, they can request a new verification email from the sign-in page.

Additionally, users can sign up using their Google account, providing a convenient and secure alternative registration method.

*** Password Recovery ***

If the user forgets their password, they can easily recover it by requesting a password reset email.

*** Subscriptions ***

Users may subscribe to gain access to specific routes. The "User_subscribed" role is assigned to all subscribed users and serves to bypass the RequireAuth middleware. However, additional safeguards are in place. A user may temporarily (see "Scheduled Subscription Updates" on this README.md file for details) retain the "User_subscribed" role even if their subscription has expired or become inactive. In such cases, access to these routes is denied through mechanisms outside of RequireAuth.

Administrators also have the authority to revoke a user's subscription status. While revoking an active subscription—especially one a user has paid for—may seem unfair, this capability is necessary to address situations such as policy violations or fraudulent activity. To ensure accountability, all role changes, including subscription revocations, are logged as previously described.

*** Profile Management ***

Users have the ability to manage their profiles, including:

Modifying their username, email, and password.
Uploading or updating their profile picture.
Deleting their account entirely.

*** Profile Management - SuperAdmin Privacy Settings *** 

SuperAdmins have control over the visibility of their profile and activity within the app. They can:

Choose whether their profile appears in the Social All Users section (i.e., whether they can be found and followed by other users).

Control whether their profile is visible to Admins in the Admin Users section.

Decide whether their login history is visible.

  *** Deleting an account - Soft Deletion (User) ***

Users can delete their accounts, but the process involves a soft deletion. When an account is deleted, its status is set to inactive, the email is modified to inactive-TIMESTAMP-email@email.com and the username is modified to inactive-TIMESTAMP-username. If the user attempts to sign up again with the same email address, they will see a prompt offering two options:

Restore the Previous Account: This will reactivate their old account (including its original ID and all associated records).

Create a New Account: This will create a completely new account with a fresh ID and no connection to the previous records.

*** Deleting an account – "Hard" Deletion (Anonymized, Not Fully Removed) by Administrator ***

Administrators, including SuperAdmins, may need to perform a hard deletion of an account, either upon request from the user or as part of compliance with privacy laws. In certain jurisdictions, laws may require the app to offer users the ability to delete their accounts.

While we comply with these privacy regulations, we may still need to retain logs for record-keeping and auditing purposes. To ensure compliance, these logs will be anonymized, with personal information such as names and emails replaced with non-identifiable data.

*** Scheduled Subscription Updates ***

To manage user subscriptions, the system automatically checks the status of subscriptions once every 24 hours. If a user's subscription has expired (based on their renewal date), their subscription is marked as inactive. Additionally, the "User_subscribed" role is removed from users whose subscriptions are no longer active. This ensures that only active subscribers retain access to certain features.

*** Social Features ***

The app provides a range of social connection features to enhance user interaction and engagement. Users can view a list of all registered users, making it easy to discover new people to connect with. The system allows users to follow others, with a dedicated list displaying the users they are currently following, as well as a list of users who follow them back. Additionally, users can manage incoming follow requests through a list of pending requests, ensuring they have control over who they connect with. For those who prefer a quieter experience, users can mute specific individuals, and the app provides a list of all muted users.

*** Messaging Features ***

The app supports private messaging, allowing users to send direct messages to one another. To initiate a conversation, you must first be approved as a followee. Once a conversation is started, it remains accessible even if the other user unfollows or mutes you (or vice-versa). However, both you and the other user have the option to hide or unhide conversations with muted individuals, giving you control over the visibility of these interactions.

*** Posts Feature ***

The app includes a social posting feature similar to a Facebook wall, where users can create posts to share with others. These posts can be reacted to (e.g., likes) and commented on by other users. Comments themselves can also receive reactions. To maintain a respectful environment, both posts and comments can be reported as inappropriate. Moderators have the ability to review reported content and determine whether it violates community guidelines. Importantly, moderators do not delete posts or comments — instead, a warning message is displayed to inform viewers that the content has been flagged, allowing them to proceed with discretion. Users retain full control over their content and may delete their own posts or comments at any time. All moderation actions are logged, including who reviewed the report, what decision was made, and when. Admins can access this moderation history, including a list of reported content and its status.

*** Translations ***

The app supports internationalization (i18n) to provide a multilingual experience for users. It automatically detects the user's preferred language from the browser settings and adjusts the interface accordingly. In addition, users can manually select and modify their preferred language from the profile section, independent of their browser's default language. Currently, the app offers translations in English, Spanish, and French, with English used as the fallback language when no match is found. This localization functionality ensures a more accessible and personalized user experience across different regions and language preferences.

*** App Settings ***

The app includes an App Settings section designed exclusively for Admins and SuperAdmins, giving them centralized control over various features of the platform. This allows for quick and flexible customization of the app’s functionality without altering the codebase. Admins and SuperAdmins can toggle entire features on or off — such as private messaging, posting, profile editing, social connections, or the subscriber section — depending on the desired complexity of the app. This is especially useful for tailoring the app to different use cases, whether it be a lightweight community or a fully featured social platform. Additionally, this system is ideal for managing premium features: Admins and SuperAdmins can easily unlock access to specific features for paying subscribers.

Beyond global toggles, App Settings offers fine-grained control over individual permissions. For instance, the Posts feature can be active while restricting posting to Admins only, disabling comments or reactions, or allowing users to report content but not delete it. Below is a breakdown of the configurable options:

POSTS

Disable Posts

Admins Can Post (Available for Super Admins only)

Users Can Post

Enable Post Interactions

Reactions on Posts

Report Posts

Delete Posts

Comments on Posts

Reactions on Comments

Report Comments

Delete Comments

DIRECT MESSAGING

Disable Messaging

Users Can Message

Users Can Delete Messages

SOCIAL CONNECTIONS

Disable Social Features

Enable Users Following

Enable Muting

ADMINISTRATORS

Admins Can Manage Roles (Available for Super Admins only)

Admins Can Delete Users (Available for Super Admins only)

PROFILE

Disable Edit Profile

Users Can Edit Their Username

Users Can Edit Their Email

Users Can Edit Their Password

Users Can Change Their Profile Image

Users Can Delete Their Account

SUBSCRIBER

Disable Subscriber Feature

CUSTOM ROLES

Enable custom roles (Available for Super Admins only)

Admins can create a custom role (Available for Super Admins only)

Admins can edit a custom roles (Available for Super Admins only)

Admins can delete a custom role (Available for Super Admins only)

SUPER ADMIN VISIBILITY

Show Super Admins in Users Admin Section (Available for Super Admins only)

Show Super Admins in Social (Available for Super Admins only)

Show Super Admins in Login History (Available for Super Admins only)

These settings give SuperAdmins powerful tools to shape the user experience and enforce the app's policies or subscription structure as needed.


*** ENVIRONMENTAL VARIABLES ***

  *** Backend ***

#BACKEND URL
REMOTE_CLIENT_APP =

BASE_URL=

#ALLOWED ORIGINS, FOR CORS
ALLOWED_ORIGINS=

NODE_ENV=development

#PORT
PORT=3500

#POSTGRESQL
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=

# JWT Secrets 
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
VERIFICATION_TOKEN_SECRET = 

# RESET PASSWORD
RESET_EMAIL_PASSWORD=
RESET_EMAIL_CLIENT=
RESET_EMAIL_PORT=
RESET_EMAIL = 

  *** Frontend ***

# BACKEND URL

REACT_APP_BACKEND_URL=https://...

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

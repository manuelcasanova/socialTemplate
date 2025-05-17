import { useState } from 'react';

//Hooks
import useAuth from '../../../hooks/useAuth';

//Context
import { useGlobalAdminSettings } from '../../../context/AdminSettingsProvider';
import { useGlobal } from '../../../context/GlobalProvider';

//Styling
import '../../../css/AdminSetup.css'

//Components
import Error from '../Error'
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner'

export default function SuperAdminSetup({ isNavOpen }) {

  const { adminSettings, error, isLoading } = useGlobalAdminSettings();
  const { postFeatures } = useGlobal();
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');

  const [showInfoMessage, setShowInfoMessage] = useState(false)
  const [showAccessRestrictionNote, setShowAccessRestrictionNote] = useState({
    allowEditUsername: false,
    allowEditEmail: false,
    allowDeleteMyUser: false,
    showPostsFeature: false,
    allowUserPost: false,
    allowPostInteractions: false,
    allowPostReactions: false,
    allowFlagPosts: false,
    allowDeletePosts: false,
    allowComments: false,
    allowCommentReactions: false,
    allowFlagComments: false,
    allowDeleteComments: false,
    showMessagesFeature: false,
    allowSendMessages: false,
    allowDeleteMessages: false,
    showSocialFeature: false,
    allowFollow: false,
    allowMute: false,
    showProfileFeature: false,
    allowEditPassword: false,
  });

  const handleShowAccessRestrictionNote = (field) => {
    setShowAccessRestrictionNote(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  const accessRestrictionNote = (
    <div
      className="admin-setup-note"
      style={{ color: 'gray', fontSize: '0.85em', marginLeft: '1em' }}
    >
      Access to this feature is restricted to upgraded subscriptions or authorized higher-level admins.
    </div>
  );

  const handleShowInfoMessage = () => {
    setShowInfoMessage(prev => !prev)
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  return (
    <div className={`admin-setup-container ${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <h2 className='admin-setup-title'>App Settings</h2>
      <h4 className='admin-setup-subtitle'>POSTS</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (postFeatures.showPostsFeature === false) {
                handleShowAccessRestrictionNote('showPostsFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowPostsFeature"
              className="toggle-checkbox"
              checked={postFeatures.showPostsFeature === false ? false : adminSettings.showPostsFeature}
              onChange={postFeatures.showPostsFeature === false ? undefined : adminSettings.toggleShowPostsFeature}
              disabled={postFeatures.showPostsFeature === false}
            />
            <label htmlFor="ShowPostsFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showPostsFeature ?
          <div className='admin-setup-line-text'>Disable Posts</div>
          :
          <div className='admin-setup-line-text'>Enable Posts</div>
        }
        {showAccessRestrictionNote.showPostsFeature && postFeatures.showPostsFeature === false && accessRestrictionNote}

      </div>

      {adminSettings.showPostsFeature &&
        <>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowUserPost === false) {
                    handleShowAccessRestrictionNote('allowUserPost');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowUserPost"
                  className="toggle-checkbox"
                  checked={postFeatures.allowUserPost === false ? false : adminSettings.allowUserPost}
                  onChange={postFeatures.allowUserPost === false ? undefined : adminSettings.toggleAllowUserPost}
                  disabled={postFeatures.allowUserPost === false}
                />
                <label htmlFor="AllowUserPost" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Post</div>
            {showAccessRestrictionNote.allowUserPost && postFeatures.allowUserPost === false && accessRestrictionNote}
          </div>

        </>}

      {adminSettings.showPostsFeature &&
        <div className='admin-setup-line'>
          <div className="toggle-container">
            <div className="toggle-wrapper"
              onClick={() => {
                if (postFeatures.allowPostInteractions === false) {
                  handleShowAccessRestrictionNote('allowPostInteractions');
                }
              }}
            >
              <input
                type="checkbox"
                id="AllowPostInteractions"
                className="toggle-checkbox"
                checked={postFeatures.allowPostInteractions === false ? false : adminSettings.allowPostInteractions}
                onChange={postFeatures.allowPostInteractions === false ? undefined : adminSettings.toggleAllowPostInteractions}
                disabled={postFeatures.allowPostInteractions === false}
              />
              <label htmlFor="AllowPostInteractions" className="toggle-label">
                <span className="toggle-circle"></span>
              </label>
            </div>
          </div>
          <div className='admin-setup-line-text'>Enable Post Interactions</div>
          {showAccessRestrictionNote.allowPostInteractions && postFeatures.allowPostInteractions === false && accessRestrictionNote}
        </div>
      }

      {adminSettings.allowPostInteractions &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowPostReactions === false) {
                    handleShowAccessRestrictionNote('allowPostReactions');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowPostReactions"
                  className="toggle-checkbox"
                  checked={postFeatures.allowPostReactions === false ? false : adminSettings.allowPostReactions}
                  onChange={postFeatures.allowPostReactions === false ? undefined : adminSettings.toggleAllowPostReactions}
                  disabled={postFeatures.allowPostReactions === false}
                />
                <label htmlFor="AllowPostReactions" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Reactions on Posts</div>
            {showAccessRestrictionNote.allowPostReactions && postFeatures.allowPostReactions === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowFlagPosts === false) {
                    handleShowAccessRestrictionNote('allowFlagPosts');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowFlagPosts"
                  className="toggle-checkbox"
                  checked={postFeatures.allowFlagPosts === false ? false : adminSettings.allowFlagPosts}
                  onChange={postFeatures.allowFlagPosts === false ? undefined : adminSettings.toggleAllowFlagPosts}
                  disabled={postFeatures.allowFlagPosts === false}
                />
                <label htmlFor="AllowFlagPosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Report Posts</div>
            {showAccessRestrictionNote.allowFlagPosts && postFeatures.allowFlagPosts === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowDeletePosts === false) {
                    handleShowAccessRestrictionNote('allowDeletePosts');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowDeletePosts"
                  className="toggle-checkbox"
                  checked={postFeatures.allowDeletePosts === false ? false : adminSettings.allowDeletePosts}
                  onChange={postFeatures.allowDeletePosts === false ? undefined : adminSettings.toggleAllowDeletePosts}
                  disabled={postFeatures.allowDeletePosts === false}
                />
                <label htmlFor="AllowDeletePosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Delete Posts</div>
            {showAccessRestrictionNote.allowDeletePosts && postFeatures.allowDeletePosts === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowComments === false) {
                    handleShowAccessRestrictionNote('allowComments');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowComments"
                  className="toggle-checkbox"
                  checked={postFeatures.allowComments === false ? false : adminSettings.allowComments}
                  onChange={postFeatures.allowComments === false ? undefined : adminSettings.toggleAllowComments}
                  disabled={postFeatures.allowComments === false}
                />
                <label htmlFor="AllowComments" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Comments on Posts</div>
            {showAccessRestrictionNote.allowComments && postFeatures.allowComments === false && accessRestrictionNote}
          </div>

          {(adminSettings.allowComments || isSuperAdmin) &&
            <>
              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (postFeatures.allowCommentReactions === false) {
                        handleShowAccessRestrictionNote('allowCommentReactions');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowCommentsReactions"
                      className="toggle-checkbox"
                      checked={postFeatures.allowCommentReactions === false ? false : adminSettings.allowCommentReactions}
                      onChange={postFeatures.allowCommentReactions === false ? undefined : adminSettings.toggleAllowCommentReactions}
                      disabled={postFeatures.allowCommentReactions === false}
                    />
                    <label htmlFor="AllowCommentsReactions" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Reactions on Comments</div>
                {showAccessRestrictionNote.allowCommentReactions && postFeatures.allowCommentReactions === false && accessRestrictionNote}
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (postFeatures.allowFlagComments === false) {
                        handleShowAccessRestrictionNote('allowFlagComments');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowFlagComments"
                      className="toggle-checkbox"
                      checked={postFeatures.allowFlagComments === false ? false : adminSettings.allowFlagComments}
                      onChange={postFeatures.allowFlagComments === false ? undefined : adminSettings.toggleAllowFlagComments}
                      disabled={postFeatures.allowFlagComments === false}
                    />
                    <label htmlFor="AllowFlagComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Report Comments</div>
                {showAccessRestrictionNote.allowFlagComments && postFeatures.allowFlagComments === false && accessRestrictionNote}
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (postFeatures.allowDeleteComments === false) {
                        handleShowAccessRestrictionNote('allowDeleteComments');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowDeleteComments"
                      className="toggle-checkbox"

                      checked={
                        postFeatures.allowDeleteComments === false
                          ? false // Force false when disallowed
                          : adminSettings.allowDeleteComments
                      }
                      onChange={
                        postFeatures.allowDeleteComments === false
                          ? undefined // Prevent changes
                          : adminSettings.toggleAllowDeleteComments
                      }
                      disabled={postFeatures.allowDeleteComments === false}

                    />
                    <label htmlFor="AllowDeleteComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Delete Comments</div>

                {showAccessRestrictionNote.allowDeleteComments && postFeatures.allowDeleteComments === false && accessRestrictionNote}

              </div>

            </>
          }

        </>
      }

      <h4 className='admin-setup-subtitle'>DIRECT MESSAGING</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (postFeatures.showMessagesFeature === false) {
                handleShowAccessRestrictionNote('showMessagesFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowMessagessFeature"
              className="toggle-checkbox"
              checked={postFeatures.showMessagesFeature === false ? false : adminSettings.showMessagesFeature}
              onChange={postFeatures.showMessagesFeature === false ? undefined : adminSettings.toggleShowMessagesFeature}
              disabled={postFeatures.showMessagesFeature === false}
            />
            <label htmlFor="ShowMessagessFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showMessagesFeature ?
          <div className='admin-setup-line-text'>Disable Messaging</div>
          :
          <div className='admin-setup-line-text'>Enable Messaging</div>
        }
        {showAccessRestrictionNote.showMessagesFeature && postFeatures.showMessagesFeature === false && accessRestrictionNote}
      </div>

      {adminSettings.showMessagesFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowSendMessages === false) {
                    handleShowAccessRestrictionNote('allowSendMessages');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowSendMessages"
                  className="toggle-checkbox"
                  checked={postFeatures.allowSendMessages === false ? false : adminSettings.allowSendMessages}
                  onChange={postFeatures.allowSendMessages === false ? undefined : adminSettings.toggleAllowSendMessages}
                  disabled={postFeatures.allowSendMessages === false}
                />
                <label htmlFor="AllowSendMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Send Messages</div>
            {showAccessRestrictionNote.allowSendMessages && postFeatures.allowSendMessages === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowDeleteMessages === false) {
                    handleShowAccessRestrictionNote('allowDeleteMessages');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowDeleteMessages"
                  className="toggle-checkbox"
                  checked={postFeatures.allowDeleteMessages === false ? false : adminSettings.allowDeleteMessages}
                  onChange={postFeatures.allowDeleteMessages === false ? undefined : adminSettings.toggleAllowDeleteMessages}
                  disabled={postFeatures.allowDeleteMessages === false}
                />
                <label htmlFor="AllowDeleteMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Delete Messages</div>
            {showAccessRestrictionNote.allowDeleteMessages && postFeatures.allowDeleteMessages === false && accessRestrictionNote}
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>SOCIAL CONNECTIONS</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (postFeatures.showSocialFeature === false) {
                handleShowAccessRestrictionNote('showSocialFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowSocialFeature"
              className="toggle-checkbox"
              checked={postFeatures.showSocialFeature === false ? false : adminSettings.showSocialFeature}
              onChange={postFeatures.showSocialFeature === false ? undefined : adminSettings.toggleShowSocialFeature}
              disabled={postFeatures.showSocialFeature === false}
            />
            <label htmlFor="ShowSocialFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showSocialFeature ?
          <div className='admin-setup-line-text'>Disable Social Features</div>
          :
          <div className='admin-setup-line-text'>Enable Social Features</div>
        }
            {showAccessRestrictionNote.showSocialFeature && postFeatures.showSocialFeature === false && accessRestrictionNote}
      </div>

      {adminSettings.showSocialFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowFollow === false) {
                    handleShowAccessRestrictionNote('allowFollow');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowFollow"
                  className="toggle-checkbox"
                  checked={postFeatures.allowFollow === false ? false : adminSettings.allowFollow}
                  onChange={postFeatures.allowFollow === false ? undefined : adminSettings.toggleAllowFollow}
                  disabled={postFeatures.allowFollow === false}
                />
                <label htmlFor="AllowFollow" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Enable Users Following</div>
            {showAccessRestrictionNote.allowFollow && postFeatures.allowFollow === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowMute === false) {
                    handleShowAccessRestrictionNote('allowMute');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowMute"
                  className="toggle-checkbox"
                  checked={postFeatures.allowMute === false ? false : adminSettings.allowMute}
                  onChange={postFeatures.allowMute === false ? undefined : adminSettings.toggleAllowMute}
                  disabled={postFeatures.allowMute === false}
                />
                <label htmlFor="AllowMute" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Enable Muting</div>
            {showAccessRestrictionNote.allowMute && postFeatures.allowMute === false && accessRestrictionNote}
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>PROFILE</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (postFeatures.showProfileFeature === false) {
                handleShowAccessRestrictionNote('showProfileFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowEditProfileFeature"
              className="toggle-checkbox"
              checked={postFeatures.showProfileFeature === false ? false : adminSettings.showProfileFeature}
              onChange={postFeatures.showProfileFeature === false ? undefined : adminSettings.toggleShowProfileFeature}
              disabled={postFeatures.showProfileFeature === false}
            />
            <label htmlFor="ShowEditProfileFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showProfileFeature ?
          <div className='admin-setup-line-text'>Disable Edit Profile</div>
          :
          <div className='admin-setup-line-text'>Enable Edit Profile</div>
        }
            {showAccessRestrictionNote.showProfileFeature && postFeatures.showProfileFeature === false && accessRestrictionNote}

      </div>

      {adminSettings.showProfileFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowEditUsername === false) {
                    handleShowAccessRestrictionNote('allowEditUsername');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditUsername"
                  className="toggle-checkbox"
                  checked={postFeatures.allowEditUsername === false ? false : adminSettings.allowEditUsername}
                  onChange={postFeatures.allowEditUsername === false ? undefined : adminSettings.toggleAllowEditUsername}
                  disabled={postFeatures.allowEditUsername === false}
                />
                <label htmlFor="AllowEditUsername" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Edit their Username</div>
            {showAccessRestrictionNote.allowEditUsername && postFeatures.allowEditUsername === false && accessRestrictionNote}

          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowEditEmail === false) {
                    handleShowAccessRestrictionNote('allowEditEmail');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditEmail"
                  className="toggle-checkbox"
                  checked={postFeatures.allowEditEmail === false ? false : adminSettings.allowEditEmail}
                  onChange={postFeatures.allowEditEmail === false ? undefined : adminSettings.toggleAllowEditEmail}
                  disabled={postFeatures.allowEditEmail === false}
                />
                <label htmlFor="AllowEditEmail" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Edit their Email</div>

            {showAccessRestrictionNote.allowEditEmail && postFeatures.allowEditEmail === false && accessRestrictionNote}



            <div
              onClick={handleShowInfoMessage}
              className='info-button'>i</div>
          </div>

          {showInfoMessage && 
          // <div className='info-message' style={{ marginBottom: '1em' }}>
                  <div className="admin-setup-note"
                  style={{ color: 'gray', fontSize: '0.85em', marginLeft: '1em', marginBottom: '1em' }}>
            If active, users are allowed to change their email address and must verify the new email to complete the process. However, once changed, access via the original email will be disabled. This creates a risk where a malicious user could take over an account by changing the email. To enhance security and prevent unauthorized access, it's strongly recommended to block email changes.</div>}

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowEditPassword === false) {
                    handleShowAccessRestrictionNote('allowEditPassword');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditPassword"
                  className="toggle-checkbox"
                  checked={postFeatures.allowEditPassword === false ? false : adminSettings.allowEditPassword}
                  onChange={postFeatures.allowEditPassword === false ? undefined : adminSettings.toggleAllowEditPassword}
                  disabled={postFeatures.allowEditPassword === false}
                />
                <label htmlFor="AllowEditPassword" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Edit their Password</div>
            {showAccessRestrictionNote.allowEditPassword && postFeatures.allowEditPassword === false && accessRestrictionNote}

          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowModifyProfilePicture === false) {
                    handleShowAccessRestrictionNote('allowModifyProfilePicture');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditProfileImage"
                  className="toggle-checkbox"
                  checked={postFeatures.allowModifyProfilePicture === false ? false : adminSettings.allowModifyProfilePicture}
                  onChange={postFeatures.allowModifyProfilePicture === false ? undefined : adminSettings.toggleAllowEditProfileImage}
                  disabled={postFeatures.allowModifyProfilePicture === false}
                />
                <label htmlFor="AllowEditProfileImage" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Change their Profile Image</div>
            {showAccessRestrictionNote.allowModifyProfilePicture && postFeatures.allowModifyProfilePicture === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (postFeatures.allowDeleteMyUser === false) {
                    handleShowAccessRestrictionNote('allowDeleteMyUser');
                  }
                }}>
                <input
                  type="checkbox"
                  id="AllowDeleteMyUser"
                  className="toggle-checkbox"
                  checked={postFeatures.allowDeleteMyUser === false ? false : adminSettings.allowDeleteMyUser}
                  onChange={postFeatures.allowDeleteMyUser === false ? undefined : adminSettings.toggleAllowDeleteMyUser}
                  disabled={postFeatures.allowDeleteMyUser === false}
                />
                <label htmlFor="AllowDeleteMyUser" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Delete their Account</div>
            {showAccessRestrictionNote.allowDeleteMyUser && postFeatures.allowDeleteMyUser === false && accessRestrictionNote}
          </div>
        </>}
    </div>

  )
}
import { useState } from 'react';

//Hooks
import useAuth from '../../../hooks/useAuth';

//Context
import { useGlobalAdminSettings } from '../../../context/AdminSettingsProvider';
import { useGlobalSuperAdminSettings } from '../../../context/SuperAdminSettingsProvider';

//Styling
import '../../../css/AdminSetup.css'

//Components
import Error from '../Error'
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner'

//Translation
import { useTranslation } from 'react-i18next';


export default function SuperAdminSetup({ isNavOpen }) {

  const { t } = useTranslation();
  const { adminSettings, error, isLoading } = useGlobalAdminSettings();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
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
{t('appSetup.accessRestricted')}
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
      <h2 className='admin-setup-title'>{t('appSetup.appSettings')}</h2>
      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionPosts')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (superAdminSettings.showPostsFeature === false) {
                handleShowAccessRestrictionNote('showPostsFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowPostsFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showPostsFeature === false ? false : adminSettings.showPostsFeature}
              onChange={superAdminSettings.showPostsFeature === false ? undefined : adminSettings.toggleShowPostsFeature}
              disabled={superAdminSettings.showPostsFeature === false}
            />
            <label htmlFor="ShowPostsFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showPostsFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disablePosts')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enablePosts')}</div>
        }
        {showAccessRestrictionNote.showPostsFeature && superAdminSettings.showPostsFeature === false && accessRestrictionNote}

      </div>

      {adminSettings.showPostsFeature &&
        <>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowUserPost === false) {
                    handleShowAccessRestrictionNote('allowUserPost');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowUserPost"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowUserPost === false ? false : adminSettings.allowUserPost}
                  onChange={superAdminSettings.allowUserPost === false ? undefined : adminSettings.toggleAllowUserPost}
                  disabled={superAdminSettings.allowUserPost === false}
                />
                <label htmlFor="AllowUserPost" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanPost')}</div>
            {showAccessRestrictionNote.allowUserPost && superAdminSettings.allowUserPost === false && accessRestrictionNote}
          </div>

        </>}

      {adminSettings.showPostsFeature &&
        <div className='admin-setup-line'>
          <div className="toggle-container">
            <div className="toggle-wrapper"
              onClick={() => {
                if (superAdminSettings.allowPostInteractions === false) {
                  handleShowAccessRestrictionNote('allowPostInteractions');
                }
              }}
            >
              <input
                type="checkbox"
                id="AllowPostInteractions"
                className="toggle-checkbox"
                checked={superAdminSettings.allowPostInteractions === false ? false : adminSettings.allowPostInteractions}
                onChange={superAdminSettings.allowPostInteractions === false ? undefined : adminSettings.toggleAllowPostInteractions}
                disabled={superAdminSettings.allowPostInteractions === false}
              />
              <label htmlFor="AllowPostInteractions" className="toggle-label">
                <span className="toggle-circle"></span>
              </label>
            </div>
          </div>
          <div className='admin-setup-line-text'>{t('appSetup.enablePostInteractions')}</div>
          {showAccessRestrictionNote.allowPostInteractions && superAdminSettings.allowPostInteractions === false && accessRestrictionNote}
        </div>
      }

      {adminSettings.allowPostInteractions &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowPostReactions === false) {
                    handleShowAccessRestrictionNote('allowPostReactions');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowPostReactions"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowPostReactions === false ? false : adminSettings.allowPostReactions}
                  onChange={superAdminSettings.allowPostReactions === false ? undefined : adminSettings.toggleAllowPostReactions}
                  disabled={superAdminSettings.allowPostReactions === false}
                />
                <label htmlFor="AllowPostReactions" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.reactionsOnPosts')}</div>
            {showAccessRestrictionNote.allowPostReactions && superAdminSettings.allowPostReactions === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowFlagPosts === false) {
                    handleShowAccessRestrictionNote('allowFlagPosts');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowFlagPosts"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowFlagPosts === false ? false : adminSettings.allowFlagPosts}
                  onChange={superAdminSettings.allowFlagPosts === false ? undefined : adminSettings.toggleAllowFlagPosts}
                  disabled={superAdminSettings.allowFlagPosts === false}
                />
                <label htmlFor="AllowFlagPosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.reportPosts')}</div>
            {showAccessRestrictionNote.allowFlagPosts && superAdminSettings.allowFlagPosts === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowDeletePosts === false) {
                    handleShowAccessRestrictionNote('allowDeletePosts');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowDeletePosts"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeletePosts === false ? false : adminSettings.allowDeletePosts}
                  onChange={superAdminSettings.allowDeletePosts === false ? undefined : adminSettings.toggleAllowDeletePosts}
                  disabled={superAdminSettings.allowDeletePosts === false}
                />
                <label htmlFor="AllowDeletePosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.deletePosts')}</div>
            {showAccessRestrictionNote.allowDeletePosts && superAdminSettings.allowDeletePosts === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowComments === false) {
                    handleShowAccessRestrictionNote('allowComments');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowComments"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowComments === false ? false : adminSettings.allowComments}
                  onChange={superAdminSettings.allowComments === false ? undefined : adminSettings.toggleAllowComments}
                  disabled={superAdminSettings.allowComments === false}
                />
                <label htmlFor="AllowComments" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.commentsOnPosts')}</div>
            {showAccessRestrictionNote.allowComments && superAdminSettings.allowComments === false && accessRestrictionNote}
          </div>

          {(adminSettings.allowComments || isSuperAdmin) &&
            <>
              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (superAdminSettings.allowCommentReactions === false) {
                        handleShowAccessRestrictionNote('allowCommentReactions');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowCommentsReactions"
                      className="toggle-checkbox"
                      checked={superAdminSettings.allowCommentReactions === false ? false : adminSettings.allowCommentReactions}
                      onChange={superAdminSettings.allowCommentReactions === false ? undefined : adminSettings.toggleAllowCommentReactions}
                      disabled={superAdminSettings.allowCommentReactions === false}
                    />
                    <label htmlFor="AllowCommentsReactions" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.reactionsOnComments')}</div>
                {showAccessRestrictionNote.allowCommentReactions && superAdminSettings.allowCommentReactions === false && accessRestrictionNote}
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (superAdminSettings.allowFlagComments === false) {
                        handleShowAccessRestrictionNote('allowFlagComments');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowFlagComments"
                      className="toggle-checkbox"
                      checked={superAdminSettings.allowFlagComments === false ? false : adminSettings.allowFlagComments}
                      onChange={superAdminSettings.allowFlagComments === false ? undefined : adminSettings.toggleAllowFlagComments}
                      disabled={superAdminSettings.allowFlagComments === false}
                    />
                    <label htmlFor="AllowFlagComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.reportComments')}</div>
                {showAccessRestrictionNote.allowFlagComments && superAdminSettings.allowFlagComments === false && accessRestrictionNote}
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper"
                    onClick={() => {
                      if (superAdminSettings.allowDeleteComments === false) {
                        handleShowAccessRestrictionNote('allowDeleteComments');
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      id="AllowDeleteComments"
                      className="toggle-checkbox"

                      checked={
                        superAdminSettings.allowDeleteComments === false
                          ? false // Force false when disallowed
                          : adminSettings.allowDeleteComments
                      }
                      onChange={
                        superAdminSettings.allowDeleteComments === false
                          ? undefined // Prevent changes
                          : adminSettings.toggleAllowDeleteComments
                      }
                      disabled={superAdminSettings.allowDeleteComments === false}

                    />
                    <label htmlFor="AllowDeleteComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.deleteComments')}</div>

                {showAccessRestrictionNote.allowDeleteComments && superAdminSettings.allowDeleteComments === false && accessRestrictionNote}

              </div>

            </>
          }

        </>
      }

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionMessaging')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (superAdminSettings.showMessagesFeature === false) {
                handleShowAccessRestrictionNote('showMessagesFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowMessagessFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showMessagesFeature === false ? false : adminSettings.showMessagesFeature}
              onChange={superAdminSettings.showMessagesFeature === false ? undefined : adminSettings.toggleShowMessagesFeature}
              disabled={superAdminSettings.showMessagesFeature === false}
            />
            <label htmlFor="ShowMessagessFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showMessagesFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableMessaging')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableMessaging')}</div>
        }
        {showAccessRestrictionNote.showMessagesFeature && superAdminSettings.showMessagesFeature === false && accessRestrictionNote}
      </div>

      {adminSettings.showMessagesFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowSendMessages === false) {
                    handleShowAccessRestrictionNote('allowSendMessages');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowSendMessages"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowSendMessages === false ? false : adminSettings.allowSendMessages}
                  onChange={superAdminSettings.allowSendMessages === false ? undefined : adminSettings.toggleAllowSendMessages}
                  disabled={superAdminSettings.allowSendMessages === false}
                />
                <label htmlFor="AllowSendMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanSendMessages')}</div>
            {showAccessRestrictionNote.allowSendMessages && superAdminSettings.allowSendMessages === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowDeleteMessages === false) {
                    handleShowAccessRestrictionNote('allowDeleteMessages');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowDeleteMessages"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeleteMessages === false ? false : adminSettings.allowDeleteMessages}
                  onChange={superAdminSettings.allowDeleteMessages === false ? undefined : adminSettings.toggleAllowDeleteMessages}
                  disabled={superAdminSettings.allowDeleteMessages === false}
                />
                <label htmlFor="AllowDeleteMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanDeleteMessages')}</div>
            {showAccessRestrictionNote.allowDeleteMessages && superAdminSettings.allowDeleteMessages === false && accessRestrictionNote}
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionSocial')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (superAdminSettings.showSocialFeature === false) {
                handleShowAccessRestrictionNote('showSocialFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowSocialFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showSocialFeature === false ? false : adminSettings.showSocialFeature}
              onChange={superAdminSettings.showSocialFeature === false ? undefined : adminSettings.toggleShowSocialFeature}
              disabled={superAdminSettings.showSocialFeature === false}
            />
            <label htmlFor="ShowSocialFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showSocialFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableSocial')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableSocial')}</div>
        }
            {showAccessRestrictionNote.showSocialFeature && superAdminSettings.showSocialFeature === false && accessRestrictionNote}
      </div>

      {adminSettings.showSocialFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowFollow === false) {
                    handleShowAccessRestrictionNote('allowFollow');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowFollow"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowFollow === false ? false : adminSettings.allowFollow}
                  onChange={superAdminSettings.allowFollow === false ? undefined : adminSettings.toggleAllowFollow}
                  disabled={superAdminSettings.allowFollow === false}
                />
                <label htmlFor="AllowFollow" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.enableUsersFollowing')}</div>
            {showAccessRestrictionNote.allowFollow && superAdminSettings.allowFollow === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowMute === false) {
                    handleShowAccessRestrictionNote('allowMute');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowMute"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowMute === false ? false : adminSettings.allowMute}
                  onChange={superAdminSettings.allowMute === false ? undefined : adminSettings.toggleAllowMute}
                  disabled={superAdminSettings.allowMute === false}
                />
                <label htmlFor="AllowMute" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.enableMuting')}</div>
            {showAccessRestrictionNote.allowMute && superAdminSettings.allowMute === false && accessRestrictionNote}
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionProfile')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper"
            onClick={() => {
              if (superAdminSettings.showProfileFeature === false) {
                handleShowAccessRestrictionNote('showProfileFeature');
              }
            }}
          >
            <input
              type="checkbox"
              id="ShowEditProfileFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showProfileFeature === false ? false : adminSettings.showProfileFeature}
              onChange={superAdminSettings.showProfileFeature === false ? undefined : adminSettings.toggleShowProfileFeature}
              disabled={superAdminSettings.showProfileFeature === false}
            />
            <label htmlFor="ShowEditProfileFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {adminSettings.showProfileFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableEditProfile')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableEditProfile')}</div>
        }
            {showAccessRestrictionNote.showProfileFeature && superAdminSettings.showProfileFeature === false && accessRestrictionNote}

      </div>

      {adminSettings.showProfileFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowEditUsername === false) {
                    handleShowAccessRestrictionNote('allowEditUsername');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditUsername"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditUsername === false ? false : adminSettings.allowEditUsername}
                  onChange={superAdminSettings.allowEditUsername === false ? undefined : adminSettings.toggleAllowEditUsername}
                  disabled={superAdminSettings.allowEditUsername === false}
                />
                <label htmlFor="AllowEditUsername" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditUsername')}</div>
            {showAccessRestrictionNote.allowEditUsername && superAdminSettings.allowEditUsername === false && accessRestrictionNote}

          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowEditEmail === false) {
                    handleShowAccessRestrictionNote('allowEditEmail');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditEmail"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditEmail === false ? false : adminSettings.allowEditEmail}
                  onChange={superAdminSettings.allowEditEmail === false ? undefined : adminSettings.toggleAllowEditEmail}
                  disabled={superAdminSettings.allowEditEmail === false}
                />
                <label htmlFor="AllowEditEmail" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditEmail')}</div>

            {showAccessRestrictionNote.allowEditEmail && superAdminSettings.allowEditEmail === false && accessRestrictionNote}



            <div
              onClick={handleShowInfoMessage}
              className='info-button'>i</div>
          </div>

          {showInfoMessage && 
          // <div className='info-message' style={{ marginBottom: '1em' }}>
                  <div className="admin-setup-note"
                  style={{ color: 'gray', fontSize: '0.85em', marginLeft: '1em', marginBottom: '1em' }}>
            {t('appSetup.emailInfoMessage')}</div>}

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowEditPassword === false) {
                    handleShowAccessRestrictionNote('allowEditPassword');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditPassword"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditPassword === false ? false : adminSettings.allowEditPassword}
                  onChange={superAdminSettings.allowEditPassword === false ? undefined : adminSettings.toggleAllowEditPassword}
                  disabled={superAdminSettings.allowEditPassword === false}
                />
                <label htmlFor="AllowEditPassword" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditPassword')}</div>
            {showAccessRestrictionNote.allowEditPassword && superAdminSettings.allowEditPassword === false && accessRestrictionNote}

          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowModifyProfilePicture === false) {
                    handleShowAccessRestrictionNote('allowModifyProfilePicture');
                  }
                }}
              >
                <input
                  type="checkbox"
                  id="AllowEditProfileImage"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowModifyProfilePicture === false ? false : adminSettings.allowModifyProfilePicture}
                  onChange={superAdminSettings.allowModifyProfilePicture === false ? undefined : adminSettings.toggleAllowEditProfileImage}
                  disabled={superAdminSettings.allowModifyProfilePicture === false}
                />
                <label htmlFor="AllowEditProfileImage" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanChangeProfileImage')}</div>
            {showAccessRestrictionNote.allowModifyProfilePicture && superAdminSettings.allowModifyProfilePicture === false && accessRestrictionNote}
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper"
                onClick={() => {
                  if (superAdminSettings.allowDeleteMyUser === false) {
                    handleShowAccessRestrictionNote('allowDeleteMyUser');
                  }
                }}>
                <input
                  type="checkbox"
                  id="AllowDeleteMyUser"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeleteMyUser === false ? false : adminSettings.allowDeleteMyUser}
                  onChange={superAdminSettings.allowDeleteMyUser === false ? undefined : adminSettings.toggleAllowDeleteMyUser}
                  disabled={superAdminSettings.allowDeleteMyUser === false}
                />
                <label htmlFor="AllowDeleteMyUser" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanDeleteAccount')}</div>
            {showAccessRestrictionNote.allowDeleteMyUser && superAdminSettings.allowDeleteMyUser === false && accessRestrictionNote}
          </div>
        </>}
    </div>

  )
}
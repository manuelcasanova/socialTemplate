import { useState } from 'react';

//Hooks
import useAuth from '../../../hooks/useAuth';

//Context
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
  const { superAdminSettings, error, isLoading } = useGlobalSuperAdminSettings();
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  // console.log("superAdminSettings in AdminSetup.jsx", superAdminSettings)
  // console.log("error in AdminSetup", error)
  // console.log("isLoading", isLoading)

  const [showInfoMessage, setShowInfoMessage] = useState(false)

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
      <p>
        {t('appSetup.note')}
      </p>
      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionPosts')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="ShowPostsFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showPostsFeature}
              onChange={superAdminSettings.toggleShowPostsFeature}
            />
            <label htmlFor="ShowPostsFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showPostsFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disablePosts')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enablePosts')}</div>
        }

      </div>

      {superAdminSettings.showPostsFeature &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowAdminPost"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowAdminPost}
                  onChange={superAdminSettings.toggleAllowAdminPost}
                />
                <label htmlFor="AllowAdminPost" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.adminsCanPost')}</div>
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowUserPost"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowUserPost}
                  onChange={superAdminSettings.toggleAllowUserPost}
                />
                <label htmlFor="AllowUserPost" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanPost')}</div>
          </div>

        </>}

      {superAdminSettings.showPostsFeature &&
        <div className='admin-setup-line'>
          <div className="toggle-container">
            <div className="toggle-wrapper">
              <input
                type="checkbox"
                id="AllowPostInteractions"
                className="toggle-checkbox"
                checked={superAdminSettings.allowPostInteractions}
                onChange={superAdminSettings.toggleAllowPostInteractions}
              />
              <label htmlFor="AllowPostInteractions" className="toggle-label">
                <span className="toggle-circle"></span>
              </label>
            </div>
          </div>
          <div className='admin-setup-line-text'>{t('appSetup.enablePostInteractions')}</div>
        </div>
      }

      {superAdminSettings.allowPostInteractions &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowPostReactions"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowPostReactions}
                  onChange={superAdminSettings.toggleAllowPostReactions}
                />
                <label htmlFor="AllowPostReactions" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.reactionsOnPosts')}</div>
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowFlagPosts"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowFlagPosts}
                  onChange={superAdminSettings.toggleAllowFlagPosts}
                />
                <label htmlFor="AllowFlagPosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.reportPosts')}</div>
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowDeletePosts"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeletePosts}
                  onChange={superAdminSettings.toggleAllowDeletePosts}
                />
                <label htmlFor="AllowDeletePosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.deletePosts')}</div>
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowComments"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowComments}
                  onChange={superAdminSettings.toggleAllowComments}
                />
                <label htmlFor="AllowComments" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.commentsOnPosts')}</div>
          </div>

          {(superAdminSettings.allowComments || isSuperAdmin) &&
            <>
              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowCommentsReactions"
                      className="toggle-checkbox"
                      checked={superAdminSettings.allowCommentReactions}
                      onChange={superAdminSettings.toggleAllowCommentReactions}
                    />
                    <label htmlFor="AllowCommentsReactions" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.reactionsOnComments')}</div>
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowFlagComments"
                      className="toggle-checkbox"
                      checked={superAdminSettings.allowFlagComments}
                      onChange={superAdminSettings.toggleAllowFlagComments}
                    />
                    <label htmlFor="AllowFlagComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.reportComments')}</div>
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowDeleteComments"
                      className="toggle-checkbox"
                      checked={superAdminSettings.allowDeleteComments}
                      onChange={superAdminSettings.toggleAllowDeleteComments}
                    />
                    <label htmlFor="AllowDeleteComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>{t('appSetup.deleteComments')}</div>
              </div>

            </>
          }

        </>
      }

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionMessaging')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="ShowMessagessFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showMessagesFeature}
              onChange={superAdminSettings.toggleShowMessagesFeature}
            />
            <label htmlFor="ShowMessagessFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showMessagesFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableMessaging')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableMessaging')}</div>
        }
      </div>

      {superAdminSettings.showMessagesFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowSendMessages"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowSendMessages}
                  onChange={superAdminSettings.toggleAllowSendMessages}
                />
                <label htmlFor="AllowSendMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanSendMessages')}</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowDeleteMessages"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeleteMessages}
                  onChange={superAdminSettings.toggleAllowDeleteMessages}
                />
                <label htmlFor="AllowDeleteMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanDeleteMessages')}</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionSocial')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="ShowSocialFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showSocialFeature}
              onChange={superAdminSettings.toggleShowSocialFeature}
            />
            <label htmlFor="ShowSocialFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showSocialFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableSocial')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableSocial')}</div>
        }
      </div>

      {superAdminSettings.showSocialFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowFollow"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowFollow}
                  onChange={superAdminSettings.toggleAllowFollow}
                />
                <label htmlFor="AllowFollow" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.enableUsersFollowing')}</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowMute"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowMute}
                  onChange={superAdminSettings.toggleAllowMute}
                />
                <label htmlFor="AllowMute" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.enableMuting')}</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionAdmins')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="AllowManageRoles"
              className="toggle-checkbox"
              checked={superAdminSettings.allowManageRoles}
              onChange={superAdminSettings.toggleAllowManageRoles}
            />
            <label htmlFor="AllowManageRoles" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.manageRoles')}</div>
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="AllowDeleteUsers"
              className="toggle-checkbox"
              checked={superAdminSettings.allowDeleteUsers}
              onChange={superAdminSettings.toggleAllowDeleteUsers}
            />
            <label htmlFor="AllowDeleteUsers" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.deleteUsers')}</div>
      </div>

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionProfile')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="ShowEditProfileFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showProfileFeature}
              onChange={superAdminSettings.toggleShowProfileFeature}
            />
            <label htmlFor="ShowEditProfileFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showProfileFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableEditProfile')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableEditProfile')}</div>
        }

      </div>

      {superAdminSettings.showProfileFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowEditUsername"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditUsername}
                  onChange={superAdminSettings.toggleAllowEditUsername}
                />
                <label htmlFor="AllowEditUsername" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditUsername')}</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowEditEmail"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditEmail}
                  onChange={superAdminSettings.toggleAllowEditEmail}
                />
                <label htmlFor="AllowEditEmail" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditEmail')}</div>

            <div
              onClick={handleShowInfoMessage}
              className='info-button'>i</div>
          </div>

          {showInfoMessage && <div className='info-message' style={{ marginBottom: '1em' }}>{t('appSetup.emailInfoMessage')}</div>}

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowEditPassword"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowEditPassword}
                  onChange={superAdminSettings.toggleAllowEditPassword}
                />
                <label htmlFor="AllowEditPassword" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanEditPassword')}</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowEditProfileImage"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowModifyProfilePicture}
                  onChange={superAdminSettings.toggleAllowEditProfileImage}
                />
                <label htmlFor="AllowEditProfileImage" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanChangeProfileImage')}</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowDeleteMyUser"
                  className="toggle-checkbox"
                  checked={superAdminSettings.allowDeleteMyUser}
                  onChange={superAdminSettings.toggleAllowDeleteMyUser}
                />
                <label htmlFor="AllowDeleteMyUser" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>{t('appSetup.usersCanDeleteAccount')}</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionSubscriber')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="ShowSubscriberFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showSubscriberFeature}
              onChange={superAdminSettings.toggleShowSubscriberFeature}
            />
            <label htmlFor="ShowSubscriberFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showSubscriberFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.disableSubscriberFeature')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.enableSubscriberFeature')}</div>
        }

      </div>

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionCustomRoles')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="EnableCustomRolesFeature"
              className="toggle-checkbox"
              checked={superAdminSettings.showCustomRolesFeature}
              onChange={superAdminSettings.toggleShowCustomRolesFeature}
            />
            <label htmlFor="EnableCustomRolesFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {superAdminSettings.showCustomRolesFeature ?
          <div className='admin-setup-line-text'>{t('appSetup.enableCustomRoles')}</div>
          :
          <div className='admin-setup-line-text'>{t('appSetup.disableCustomRoles')}</div>
        }
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="AllowAdminCreateCustomRole"
              className="toggle-checkbox"
              checked={superAdminSettings.allowAdminCreateCustomRole}
              onChange={superAdminSettings.toggleAllowAdminCreateCustomRole}
            />
            <label htmlFor="AllowAdminCreateCustomRole" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.adminsCanCreateCustomRole')}</div>
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="AllowAdminEditCustomRole"
              className="toggle-checkbox"
              checked={superAdminSettings.allowAdminEditCustomRole}
              onChange={superAdminSettings.toggleAllowAdminEditCustomRole}
            />
            <label htmlFor="AllowAdminEditCustomRole" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.adminsCanEditCustomRole')}</div>
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="AllowAdminDeleteCustomRole"
              className="toggle-checkbox"
              checked={superAdminSettings.allowAdminDeleteCustomRole}
              onChange={superAdminSettings.toggleAllowAdminDeleteCustomRole}
            />
            <label htmlFor="AllowAdminDeleteCustomRole" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.adminsCanDeleteCustomRole')}</div>
      </div>

      <h4 className='admin-setup-subtitle'>{t('appSetup.sectionVisibility')}</h4>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="showSuperAdminInUsersAdmin"
              className="toggle-checkbox"
              checked={superAdminSettings.showSuperAdminInUsersAdmin}
              onChange={superAdminSettings.toggleShowSuperAdminInUsersAdmin}
            />
            <label htmlFor="showSuperAdminInUsersAdmin" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.showSuperAdminInUsersAdmin')}</div>
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="showSuperAdminInSocial"
              className="toggle-checkbox"
              checked={superAdminSettings.showSuperAdminInSocial}
              onChange={superAdminSettings.toggleShowSuperAdminInSocial}
            />
            <label htmlFor="showSuperAdminInSocial" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.showSuperAdminInSocial')}</div>
      </div>

      <div className='admin-setup-line'>
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="showSuperAdminInLoginHistory"
              className="toggle-checkbox"
              checked={superAdminSettings.showSuperAdminInLoginHistory}
              onChange={superAdminSettings.toggleShowSuperAdminInLoginHistory}
            />
            <label htmlFor="showSuperAdminInLoginHistory" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>{t('appSetup.showSuperAdminInLoginHistory')}</div>
      </div>


    </div>



  )
}
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

export default function SuperAdminSetup({ isNavOpen }) {

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
      <h2 className='admin-setup-title'>App Settings</h2>
      <h4 className='admin-setup-subtitle'>POSTS</h4>

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
          <div className='admin-setup-line-text'>Disable Posts</div>
          :
          <div className='admin-setup-line-text'>Enable Posts</div>
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
            <div className='admin-setup-line-text'>Admins Can Post</div>
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
            <div className='admin-setup-line-text'>Users Can Post</div>
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
          <div className='admin-setup-line-text'>Enable Post Interactions</div>
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
            <div className='admin-setup-line-text'>Reactions on Posts</div>
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
            <div className='admin-setup-line-text'>Report Posts</div>
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
            <div className='admin-setup-line-text'>Delete Posts</div>
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
            <div className='admin-setup-line-text'>Comments on Posts</div>
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
                <div className='admin-setup-line-text'>Reactions on Comments</div>
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
                <div className='admin-setup-line-text'>Report Comments</div>
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
                <div className='admin-setup-line-text'>Delete Comments</div>
              </div>

            </>
          }

        </>
      }

      <h4 className='admin-setup-subtitle'>DIRECT MESSAGING</h4>

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
          <div className='admin-setup-line-text'>Disable Messaging</div>
          :
          <div className='admin-setup-line-text'>Enable Messaging</div>
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
            <div className='admin-setup-line-text'>Users Can Send Messages</div>
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
            <div className='admin-setup-line-text'>Users Can Delete Messages</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>SOCIAL CONNECTIONS</h4>

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
          <div className='admin-setup-line-text'>Disable Social Features</div>
          :
          <div className='admin-setup-line-text'>Enable Social Features</div>
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
            <div className='admin-setup-line-text'>Enable Users Following</div>
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
            <div className='admin-setup-line-text'>Enable Muting</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>ADMINISTRATORS</h4>

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
        <div className='admin-setup-line-text'>Admins Can Manage User's Roles</div>
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
        <div className='admin-setup-line-text'>Admins Can Delete Users</div>
      </div>

      <h4 className='admin-setup-subtitle'>PROFILE</h4>

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
          <div className='admin-setup-line-text'>Disable Edit Profile</div>
          :
          <div className='admin-setup-line-text'>Enable Edit Profile</div>
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
            <div className='admin-setup-line-text'>Users Can Edit their Username</div>
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
            <div className='admin-setup-line-text'>Users Can Edit their Email</div>
           
            <div
              onClick={handleShowInfoMessage}
              className='info-button'>i</div>
          </div>

          {showInfoMessage && <div className='info-message' style={{marginBottom: '1em'}}>If active, users are allowed to change their email address and must verify the new email to complete the process. However, once changed, access via the original email will be disabled. This creates a risk where a malicious user could take over an account by changing the email. To enhance security and prevent unauthorized access, it's strongly recommended to block email changes.</div>}

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
            <div className='admin-setup-line-text'>Users Can Edit their Password</div>
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
            <div className='admin-setup-line-text'>Users Can Change their Profile Image</div>
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
            <div className='admin-setup-line-text'>Users Can Delete their Account</div>
          </div>
        </>}

      <h4 className='admin-setup-subtitle'>SUBSCRIBER</h4>

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
          <div className='admin-setup-line-text'>Disable Subscriber Feature</div>
          :
          <div className='admin-setup-line-text'>Enable Subscriber Feature</div>
        }

      </div>

      <h4 className='admin-setup-subtitle'>CUSTOM ROLES</h4>

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
        <div className='admin-setup-line-text'>Enable Custom Roles Feature</div>
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
        <div className='admin-setup-line-text'>Admins Can Create a Custom Role</div>
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
        <div className='admin-setup-line-text'>Admins Can Edit a Custom Role</div>
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
        <div className='admin-setup-line-text'>Admins Can Delete a Custom Role</div>
      </div>

    </div>

  )
}
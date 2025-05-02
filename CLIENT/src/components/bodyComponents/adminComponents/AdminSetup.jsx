//Context
import { useGlobal } from '../../../context/GlobalProvider';

//Styling
import '../../../css/AdminSetup.css'

export default function AdminSetup({ isNavOpen }) {

  const { postFeatures } = useGlobal();
  // console.log("postFeatures in AdminSetup.jsx", postFeatures)

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
              checked={postFeatures.showPostsFeature}
              onChange={postFeatures.toggleShowPostsFeature}
            />
            <label htmlFor="ShowPostsFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {postFeatures.showPostsFeature ?
          <div className='admin-setup-line-text'>Disable Posts</div>
          :
          <div className='admin-setup-line-text'>Enable Posts</div>
        }

      </div>

      {postFeatures.showPostsFeature &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowAdminPost"
                  className="toggle-checkbox"
                  checked={postFeatures.allowAdminPost}
                  onChange={postFeatures.toggleAllowAdminPost}
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
                  checked={postFeatures.allowUserPost}
                  onChange={postFeatures.toggleAllowUserPost}
                />
                <label htmlFor="AllowUserPost" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Post</div>
          </div>

        </>}

      {postFeatures.showPostsFeature &&
        <div className='admin-setup-line'>
          <div className="toggle-container">
            <div className="toggle-wrapper">
              <input
                type="checkbox"
                id="AllowPostInteractions"
                className="toggle-checkbox"
                checked={postFeatures.allowPostInteractions}
                onChange={postFeatures.toggleAllowPostInteractions}
              />
              <label htmlFor="AllowPostInteractions" className="toggle-label">
                <span className="toggle-circle"></span>
              </label>
            </div>
          </div>
          <div className='admin-setup-line-text'>Enable Post Interactions</div>
        </div>
      }

      {postFeatures.allowPostInteractions &&
        <>
          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowPostReactions"
                  className="toggle-checkbox"
                  checked={postFeatures.allowPostReactions}
                  onChange={postFeatures.toggleAllowPostReactions}
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
                  checked={postFeatures.allowFlagPosts}
                  onChange={postFeatures.toggleAllowFlagPosts}
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
                  checked={postFeatures.allowDeletePosts}
                  onChange={postFeatures.toggleAllowDeletePosts}
                />
                <label htmlFor="AllowDeletePosts" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Delete posts</div>
          </div>

          <div className='admin-setup-subline'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowComments"
                  className="toggle-checkbox"
                  checked={postFeatures.allowComments}
                  onChange={postFeatures.toggleAllowComments}
                />
                <label htmlFor="AllowComments" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Comments on Posts</div>
          </div>

          {postFeatures.allowComments &&
            <>
              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowCommentsReactions"
                      className="toggle-checkbox"
                      checked={postFeatures.allowCommentReactions}
                      onChange={postFeatures.toggleAllowCommentReactions}
                    />
                    <label htmlFor="AllowCommentsReactions" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Reactions on comments</div>
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowFlagComments"
                      className="toggle-checkbox"
                      checked={postFeatures.allowFlagComments}
                      onChange={postFeatures.toggleAllowFlagComments}
                    />
                    <label htmlFor="AllowFlagComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Report comments</div>
              </div>

              <div className='admin-setup-subline2'>
                <div className="toggle-container">
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="AllowDeleteComments"
                      className="toggle-checkbox"
                      checked={postFeatures.allowDeleteComments}
                      onChange={postFeatures.toggleAllowDeleteComments}
                    />
                    <label htmlFor="AllowDeleteComments" className="toggle-label">
                      <span className="toggle-circle"></span>
                    </label>
                  </div>
                </div>
                <div className='admin-setup-line-text'>Delete comments</div>
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
              checked={postFeatures.showMessagesFeature}
              onChange={postFeatures.toggleShowMessagesFeature}
            />
            <label htmlFor="ShowMessagessFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {postFeatures.showMessagesFeature ?
          <div className='admin-setup-line-text'>Disable messaging</div>
          :
          <div className='admin-setup-line-text'>Enable messaging</div>
        }
      </div>

      {postFeatures.showMessagesFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowSendMessages"
                  className="toggle-checkbox"
                  checked={postFeatures.allowSendMessages}
                  onChange={postFeatures.toggleAllowSendMessages}
                />
                <label htmlFor="AllowSendMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Message</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowDeleteMessages"
                  className="toggle-checkbox"
                  checked={postFeatures.allowDeleteMessages}
                  onChange={postFeatures.toggleAllowDeleteMessages}
                />
                <label htmlFor="AllowDeleteMessages" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users can delete messages</div>
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
              checked={postFeatures.showSocialFeature}
              onChange={postFeatures.toggleShowSocialFeature}
            />
            <label htmlFor="ShowSocialFeature" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        {postFeatures.showSocialFeature ?
          <div className='admin-setup-line-text'>Disable social features</div>
          :
          <div className='admin-setup-line-text'>Enable social features</div>
        }
      </div>

      {postFeatures.showSocialFeature &&
        <>
          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowFollow"
                  className="toggle-checkbox"
                  checked={postFeatures.allowFollow}
                  onChange={postFeatures.toggleAllowFollow}
                />
                <label htmlFor="AllowFollow" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Enable users following</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowMute"
                  className="toggle-checkbox"
                  checked={postFeatures.allowMute}
                  onChange={postFeatures.toggleAllowMute}
                />
                <label htmlFor="AllowMute" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Enable muting</div>
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
                  checked={postFeatures.allowManageRoles}
                  onChange={postFeatures.toggleAllowManageRoles}
                />
                <label htmlFor="AllowManageRoles" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Admins Can Manage Roles</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowDeleteUsers"
                  className="toggle-checkbox"
                  checked={postFeatures.allowDeleteUsers}
                  onChange={postFeatures.toggleAllowDeleteUsers}
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
                  id="AllowEditUsername"
                  className="toggle-checkbox"
                  checked={postFeatures.allowEditUsername}
                  onChange={postFeatures.toggleAllowEditUsername}
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
                  checked={postFeatures.allowEditEmail}
                  onChange={postFeatures.toggleAllowEditEmail}
                />
                <label htmlFor="AllowEditEmail" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Edit their Email</div>
          </div>

          <div className='admin-setup-line'>
            <div className="toggle-container">
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  id="AllowEditPassword"
                  className="toggle-checkbox"
                  checked={postFeatures.allowEditPassword}
                  onChange={postFeatures.toggleAllowEditPassword}
                />
                <label htmlFor="AllowEditPassword" className="toggle-label">
                  <span className="toggle-circle"></span>
                </label>
              </div>
            </div>
            <div className='admin-setup-line-text'>Users Can Edit their Password</div>
          </div>

    </div>

  )
}
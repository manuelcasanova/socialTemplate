//Context
import { useGlobal } from '../../../context/GlobalProvider';

//Styling
import '../../../css/AdminSetup.css'

export default function AdminSetup({ isNavOpen }) {

  const { postFeatures } = useGlobal();

  return (
    <div className={`admin-setup-container ${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <h2 className='admin-setup-title'>App Settings</h2>
      <h4 className='admin-setup-subtitle'>POSTS FEATURE</h4>
      
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
        <div className='admin-setup-line-text'>ENABLE POSTS FEATURE</div>
      </div>

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
        <div className='admin-setup-line-text'>ALLOW ADMINS TO POST</div>
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
        <div className='admin-setup-line-text'>ALLOW NON ADMIN USERS TO POST</div>
      </div>

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
        <div className='admin-setup-line-text'>ENABLE POST INTERACTIONS</div>
      </div>


    </div>

  )
}
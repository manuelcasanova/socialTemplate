import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
      <h2>All moderator users have access to this page</h2>
      </div>
<Footer />
    </div>
    
  )
}
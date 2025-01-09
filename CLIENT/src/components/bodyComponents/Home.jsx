import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
      <h2>This page is public</h2>
      <Footer />
      </div>

    </div>
    
  )
}
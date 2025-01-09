import Footer from "../mainComponents/footer"

export default function Admin({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
      <h2>All admins have access to this page</h2>
      </div>
    </div>
    
  )
}


import Footer from "../../mainComponents/footer"

export default function AdminUsers({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
      <h2>Admin users</h2>
      </div>
<Footer />
    </div>
    
  )
}


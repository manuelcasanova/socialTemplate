import Footer from "../mainComponents/footer"

export default function Admin({ isNavOpen }) {

  return (
    <div className={`body ${isNavOpen ? 'body-squeezed' : ''}`}>
      <h2>All admins have access to this page</h2>
    </div>
    
  )
}


import Footer from "../mainComponents/footer"

export default function User({ isNavOpen }) {

  return (
    <div className={`body ${isNavOpen ? 'body-squeezed' : ''}`}>
        <h2>All registered users have access to this page</h2>
   
    </div>

  )
}
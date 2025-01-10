import Footer from "../mainComponents/footer"

export default function User({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
        <h2>All registered users have access to this page</h2>
   
    </div>

  )
}
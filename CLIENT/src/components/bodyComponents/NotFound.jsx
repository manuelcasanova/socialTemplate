import Footer from "../mainComponents/footer"
import '../../css/NotFound.css'

export default function NotFound({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      </div>
    </div>
    
  )
}
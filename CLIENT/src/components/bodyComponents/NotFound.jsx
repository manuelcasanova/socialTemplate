import Footer from "../mainComponents/footer"
import '../../css/NotFound.css'

export default function NotFound({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      </div>
    </div>
    
  )
}
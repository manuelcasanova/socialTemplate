import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`body ${isNavOpen ? 'body-squeezed' : ''}`}>
      <h2>All moderator users have access to this page</h2>
    </div>
    
  )
}
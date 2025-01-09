import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`body ${isNavOpen ? 'body-squeezed' : ''}`}>
     
      <h2>This page is public</h2>
     

    </div>
    
  )
}
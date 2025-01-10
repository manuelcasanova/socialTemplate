import Footer from "../mainComponents/footer"

export default function Moderator({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
     
      <h2>This page is public</h2>
     

    </div>
    
  )
}
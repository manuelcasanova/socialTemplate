

export default function HiddenComments({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
        <h2>Comments Hiden (Assessed as Inappropriate)</h2>
    </div>
    
  )
}
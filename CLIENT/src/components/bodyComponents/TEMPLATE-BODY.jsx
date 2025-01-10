

export default function TEMPLATE({ isNavOpen }) {

  return (
    <div className={`body ${isNavOpen ? 'body-squeezed' : ''}`}>
        <h2>TEMPLATE</h2>
    </div>
    
  )
}
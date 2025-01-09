

export default function NAME({ isNavOpen }) {

  return (
    <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
      <div className="body">
        <h2>TEMPLATE</h2>
      </div>
    </div>
    
  )
}
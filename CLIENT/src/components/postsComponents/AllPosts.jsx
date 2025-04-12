export default function AllPosts({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
        <h2>All posts</h2>

    </div>
    
  )
}
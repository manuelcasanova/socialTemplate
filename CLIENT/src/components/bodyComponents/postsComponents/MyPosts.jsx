export default function MyPosts({ isNavOpen }) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
        <h2>My posts</h2>
    </div>
    
  )
}
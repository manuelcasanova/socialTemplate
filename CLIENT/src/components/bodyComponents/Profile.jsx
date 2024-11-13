import useAuth from "../../hooks/useAuth"

export default function Profile () {

  const { auth } = useAuth();  

const userId = auth.userId

  return (
        <h2>Hello {userId}! - All registered users have access to this profile page</h2>
  )
}
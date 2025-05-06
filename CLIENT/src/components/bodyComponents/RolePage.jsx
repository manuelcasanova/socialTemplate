export default function RolePage ({role, isNavOpen}) {

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <h1>{role.role_name} Dashboard</h1>
    </div>
  );
}
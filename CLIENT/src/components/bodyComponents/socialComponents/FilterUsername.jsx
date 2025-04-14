export default function FilterUsername ({filterUsername, setFilterUsername, inputRef}) {
return (
  <div className="filter-container chats-filter posts-filter">
  <div className="filter-wrapper posts-filter">
    <input
      type="text"
      className="filter-container-input-username"
      placeholder="Search by username"
      value={filterUsername}
      onChange={(e) => setFilterUsername(e.target.value)}
      // pattern="[a-zA-Z0-9-_^\s]+" 
      ref={inputRef}
      title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
    />
  </div>
</div>
)
}
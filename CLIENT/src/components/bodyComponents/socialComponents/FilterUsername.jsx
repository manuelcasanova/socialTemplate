export default function FilterUsername ({filterUsername, setFilterUsername, inputRef}) {
return (
  <div className="filter-container chats-filter">
  <div className="filter-wrapper">
    <input
      type="text"
      className="filter-container-input-username"
      placeholder="Username"
      value={filterUsername}
      onChange={(e) => setFilterUsername(e.target.value)}
      pattern="[a-zA-Z0-9-_^\s]+" // Optional, prevents invalid submission
      ref={inputRef}
      title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
    />
  </div>
</div>
)
}
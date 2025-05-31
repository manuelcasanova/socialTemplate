

export default function FilterUsername({ filterUsername, setFilterUsername, inputRef, onSearch }) {
  return (
    <div className="filter-container chats-filter posts-filter">
      <div className="filter-wrapper posts-filter">
        <input
          type="text"
          className="filter-container-input-username"
          placeholder="Search by username and hit enter"
          value={filterUsername}
          onChange={(e) => {
            const value = e.target.value;
            setFilterUsername(value);
            if (value === '') {
              onSearch(); // Trigger search immediately when input is cleared
            }
          }}

          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          // pattern="[a-zA-Z0-9-_^\s]+" 
          ref={inputRef}
          title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
        />


      </div>
    </div>
  )
}
export default function WritePost() {

  const handleClick = () => {
    console.log("Send message");
  };

  return (
    <div className="write-post-container">
      <input
        type="text"
        className="write-post-input"
        placeholder="Got something to say?"
      // value={}
      // onChange={}
      />

      <button 
      className="button-white"
      onClick={handleClick}
      >Send</button>
    </div>
  )
}
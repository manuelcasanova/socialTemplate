import { useEffect, useRef } from "react";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function WritePost() {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  const handleClick = () => {
    console.log("Send message");
  };

  return (
    <div className="write-post-container">
      <input
        ref={inputRef}
        type="text"
        className="write-post-input"
        placeholder="Got something to say?"
      // value={}
      // onChange={}
      />

      <button
        className="button-white"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  )
}
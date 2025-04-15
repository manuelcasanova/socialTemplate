import { useState, useEffect, useRef } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function WritePost({ loggedInUser, setNewPostSubmitted }) {
  const inputRef = useRef(null);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  const handleClick = async () => {
    try {
      if (!content.trim()) {
        setError("Content cannot be empty!");
        return;
      }

      setIsLoading(true);

      // Prepare the data to send
      const postData = {
        content,
        visibility,
        loggedInUser,
      };


      const response = await axiosPrivate.post("/posts/send", postData);

      setContent("");
      setVisibility("public");
      setNewPostSubmitted(true);


    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create the post. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after the API call
    }
  };
  return (
    <div className="write-post-container">
      <input
        ref={inputRef}
        type="text"
        className="write-post-input"
        placeholder="Got something to say?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClick(); 
          }
        }}
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
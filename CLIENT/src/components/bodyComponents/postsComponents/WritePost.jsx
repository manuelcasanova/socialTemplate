import { useState, useEffect, useRef } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

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

  const handleVisibilityClick = () => {
    switch (visibility) {
      case "public":
        setVisibility("private");
        break;
      case "private":
        setVisibility("followers");
        break;
      case "followers":
        setVisibility("public");
        break;
      default:
        setVisibility("public");
    }
  };

  // Determine the icon based on the visibility state
  const getVisibilityIcon = () => {
    switch (visibility) {
      case "public":
        return faEarth;
      case "private":
        return faLock;
      case "followers":
        return faUserFriends;
      default:
        return faEarth;
    }
  };


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

  // Determine the tooltip based on visibility state
  const getVisibilityTooltip = () => {
    switch (visibility) {
      case "public":
        return "Public";
      case "private":
        return "Only you";
      case "followers":
        return "Followers";
      default:
        return "Public";
    }
  };


  return (


    <div className="write-post-container">

      <button className="button-white" onClick={handleVisibilityClick}>
        <FontAwesomeIcon icon={getVisibilityIcon()} 
        title={getVisibilityTooltip()}
        />

      </button>

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
import { useState, useEffect, useRef } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

//Translation
import { useTranslation } from "react-i18next";

export default function WritePost({ loggedInUser, setNewPostSubmitted, setError }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const MAX_CHAR_LIMIT = 5000;

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
        setError(t("writePost.errorEmpty"));
        return;
      }

      if (content.length > MAX_CHAR_LIMIT) {
        setError(t('writePost.errorTooLong', { limit: MAX_CHAR_LIMIT }));
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
      setError(t("writePost.errorFailed"));
    } finally {
      setIsLoading(false); // Set loading to false after the API call
    }
  };

  // Determine the tooltip based on visibility state
  const getVisibilityTooltip = () => {
    switch (visibility) {
      case "public":
        return t("writePost.tooltip.public");
      case "private":
        return t("writePost.tooltip.private");
      case "followers":
        return t("writePost.tooltip.followers");
      default:
        return t("writePost.tooltip.public");
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
        placeholder={t("writePost.placeholder")}
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
        disabled={content.length > MAX_CHAR_LIMIT || isLoading}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>

     {content.length > MAX_CHAR_LIMIT && (
  <div className="char-count">
    {t('writePost.charCount', { count: content.length, limit: MAX_CHAR_LIMIT })}
  </div>
)}

    </div>
  )
}
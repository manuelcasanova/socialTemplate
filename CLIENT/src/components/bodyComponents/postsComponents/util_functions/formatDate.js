// Utility function to format the date based on custom rules
export const formatDate = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMilliseconds = now - postDate;
  
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = now.getFullYear() - postDate.getFullYear();

  if (diffInMilliseconds < 60 * 1000) { // Less than a minute ago
    return 'Less than a minute ago';
  }
  
  if (diffInMinutes < 60) { // Less than an hour ago
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  if (diffInHours < 24) { // Less than 24 hours ago
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  if (diffInDays === 1) { // Yesterday
    return `Yesterday at ${postDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (diffInYears < 1) { // Less than a year ago
    return `${postDate.toLocaleString('en-US', { month: 'long' })} ${postDate.getDate()} at ${postDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  

  // More than a year ago
  return `${postDate.toLocaleString('en-US', { month: 'long' })} ${postDate.getDate()}, ${postDate.getFullYear()} at ${postDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

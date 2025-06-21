export const formatDate = (date, locale = 'en-US', t = (key) => key) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMilliseconds = now - postDate;

  const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = now.getFullYear() - postDate.getFullYear();

  if (diffInMilliseconds < 60 * 1000) {
    return t('posts.lessThanMinuteAgo');
  }

  if (diffInMinutes < 60) {
    return t('posts.minutesAgo', { count: diffInMinutes });
  }

  if (diffInHours < 24) {
    return t('posts.hoursAgo', { count: diffInHours });
  }

  if (diffInDays === 1) {
    return `${t('posts.yesterdayAt')} ${postDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
  }

  if (diffInYears < 1) {
    if (locale.startsWith('es')) {
      // Spanish format: "16 de junio a las 2:38"
      const day = postDate.getDate();
      const month = postDate.toLocaleString(locale, { month: 'long' }); // lowercase month
      const time = postDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });

      return `${day} de ${month} ${t('posts.at')} ${time}`;
    } else {
      return `${postDate.toLocaleString(locale, { month: 'long' })} ${postDate.getDate()} ${t('posts.at')} ${postDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  // More than a year ago
  if (locale.startsWith('es')) {
    const day = postDate.getDate();
    const month = postDate.toLocaleString(locale, { month: 'long' }); // lowercase month
    const year = postDate.getFullYear();
    const time = postDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });

    return `${day} de ${month} de ${year} ${t('posts.at')} ${time}`;
  } else {
    return `${postDate.toLocaleString(locale, { month: 'long' })} ${postDate.getDate()}, ${postDate.getFullYear()} ${t('posts.at')} ${postDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
  }
};

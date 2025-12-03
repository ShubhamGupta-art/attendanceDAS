export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const calculateAttendancePercentage = (presentDays, totalDays) => {
  if (totalDays === 0) return 0;
  return ((presentDays / totalDays) * 100).toFixed(2);
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const formatDate = (timestamp) => {
    // Convert to number if it's a string
    const milliseconds = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
    const date = new Date(milliseconds);
  
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
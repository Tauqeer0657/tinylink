// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',  
    minute: '2-digit'
  });
};

// Truncate long URLs
export const truncateUrl = (url, maxLength = 50) => {
  if (!url) return '';
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
};

// Copy to clipboard 
export const copyToClipboard = async (text, successMessage = 'Copied!', errorMessage = 'Failed to copy') => {
  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    alert(errorMessage);
    return false;
  }
};
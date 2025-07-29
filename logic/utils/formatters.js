/**
 * UTILITY FORMATTERS
 * Centralized formatting utilities for NEXMAX Dashboard
 * 
 * @author NEXMAX Dashboard Team
 * @version 1.0.0
 * @date 2025-07-29
 */

/**
 * Format Currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (MYR, USD, etc.)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'MYR', decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency} 0.00`;
  }

  const formatter = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return formatter.format(amount);
}

/**
 * Format Percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format Number with Thousand Separator
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return value.toLocaleString('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Calculate Percentage Change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculateChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

/**
 * Format Change for Display
 * @param {number} change - Percentage change
 * @param {number} decimals - Number of decimal places
 * @returns {object} Formatted change object with value and direction
 */
export function formatChange(change, decimals = 2) {
  const formattedChange = Math.abs(change).toFixed(decimals);
  const direction = change >= 0 ? 'up' : 'down';
  const sign = change >= 0 ? '+' : '-';

  return {
    value: `${sign}${formattedChange}%`,
    direction,
    raw: change
  };
}

/**
 * Format Date
 * @param {Date|string} date - Date to format
 * @param {string} format - Date format ('short', 'long', 'month', 'year')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    month: { month: 'long', year: 'numeric' },
    year: { year: 'numeric' }
  };

  return dateObj.toLocaleDateString('en-MY', options[format] || options.short);
}

/**
 * Format Time
 * @param {Date|string} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export function formatTime(date, includeSeconds = false) {
  if (!date) return '';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };

  return dateObj.toLocaleTimeString('en-MY', options);
}

/**
 * Format File Size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format Duration
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format Phone Number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Malaysian phone number
  if (cleaned.length === 10 && cleaned.startsWith('01')) {
    return `+60 ${cleaned.substring(1, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Format international number
  if (cleaned.length === 12 && cleaned.startsWith('60')) {
    return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
}

/**
 * Format Credit Card Number
 * @param {string} cardNumber - Credit card number to format
 * @returns {string} Formatted credit card number
 */
export function formatCreditCard(cardNumber) {
  if (!cardNumber) return '';

  // Remove all non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Format as XXXX XXXX XXXX XXXX
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return cardNumber;
}

/**
 * Truncate Text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize First Letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalizeFirst(text) {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert to Title Case
 * @param {string} text - Text to convert
 * @returns {string} Title case text
 */
export function toTitleCase(text) {
  if (!text) return '';
  
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Format Decimal Places
 * @param {number} value - Value to format
 * @param {number} places - Number of decimal places
 * @returns {string} Formatted decimal string
 */
export function formatDecimal(value, places = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }
  
  return value.toFixed(places);
}

/**
 * Format Large Numbers (K, M, B)
 * @param {number} value - Value to format
 * @returns {string} Formatted large number string
 */
export function formatLargeNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  
  return value.toString();
}

export default {
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateChange,
  formatChange,
  formatDate,
  formatTime,
  formatFileSize,
  formatDuration,
  formatPhoneNumber,
  formatCreditCard,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  formatDecimal,
  formatLargeNumber
}; 
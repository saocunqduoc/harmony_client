/**
 * Formats a date string into a localized format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Formats a date string into time only
 * @param dateString Date string to format
 * @returns Formatted time string
 */
export const formatTime = (timeString: string): string => {
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeString;
};

/**
 * Formats a number as Vietnamese currency
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get time ago from date
 * @param dateString Date string to calculate time ago
 * @returns Time ago string
 */
export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} năm trước`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} tháng trước`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ngày trước`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} giờ trước`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} phút trước`;
  }
  
  return 'Vừa xong';
};

/**
 * Maps English weekday names to Vietnamese
 */
export const weekdayTranslations: Record<string, string> = {
  'Monday': 'Thứ Hai',
  'Tuesday': 'Thứ Ba',
  'Wednesday': 'Thứ Tư',
  'Thursday': 'Thứ Năm',
  'Friday': 'Thứ Sáu',
  'Saturday': 'Thứ Bảy',
  'Sunday': 'Chủ Nhật',
};

/**
 * Translates an English weekday name to Vietnamese
 */
export const translateWeekday = (englishWeekday: string): string => {
  // If the entire string is just a day name, return its translation
  if (weekdayTranslations[englishWeekday]) {
    return weekdayTranslations[englishWeekday];
  }
  
  // Otherwise, replace each day name with its translation in the string
  let result = englishWeekday;
  Object.entries(weekdayTranslations).forEach(([english, vietnamese]) => {
    result = result.replace(new RegExp(english, 'g'), vietnamese);
  });
  
  return result;
};

/**
 * Formats a date in Vietnamese locale
 */
export const formatDateToVietnamese = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

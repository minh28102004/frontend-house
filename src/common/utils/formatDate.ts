/**
 * Format a date to relative time (e.g., "5 phút trước", "2 giờ trước")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'Vừa xong';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} tuần trước`;
  } else if (diffMonths < 12) {
    return `${diffMonths} tháng trước`;
  } else {
    return `${diffYears} năm trước`;
  }
}

/**
 * Format a date to Vietnamese locale string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format a date with time to Vietnamese locale string
 */
export function formatDateTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Format a date to ISO string for input[type="datetime-local"]
 */
export function toDateTimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
}

/**
 * Parse a date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

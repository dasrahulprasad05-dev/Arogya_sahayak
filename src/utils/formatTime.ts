/**
 * Convert 24-hour time string (HH:MM or HH:MM:SS) to 12-hour AM/PM format.
 * Examples:
 *   "09:00" → "9:00 AM"
 *   "14:30" → "2:30 PM"
 *   "00:00" → "12:00 AM"
 *   "12:00" → "12:00 PM"
 */
export const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m.padStart(2, '0')} ${ampm}`;
};

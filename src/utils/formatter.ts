export function formatDate(date: number | string | Date): string {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return dateObj.toLocaleDateString('en-US', options).replace(/\//g, '-');
}

export function formatDatTime(date: number | string | Date): string {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  };
  return dateObj.toLocaleString('en-US', options).replace(/\//g, '-').replace(',', '');
}

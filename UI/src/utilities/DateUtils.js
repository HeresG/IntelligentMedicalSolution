export class DateUtils {

  static formatDateTime(dateInput) {
    const date = new Date(dateInput);

    if (isNaN(date)) {
      return '';
    }

    return date.toLocaleString('ro-RO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  static formatDate(dateInput){
    const date = new Date(dateInput);

    if (isNaN(date)) {
      return '';
    }

    return date.toLocaleString('ro-RO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static beetween(startDate, endDate, dateInInterval) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= dateInInterval && end >= dateInInterval;

}
  static isFuture(date, comparedDate){
    return new Date(date) >= new Date(comparedDate)
  }

}

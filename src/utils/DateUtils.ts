import dayjs, { Dayjs } from 'dayjs';

export class DateUtils {
  public static getDateStringForTransaction(date: Date | Dayjs): string {
    return dayjs(date).format('YYYY-MM-DD');
  }
}

import dayjs from 'dayjs';

export default class DateUtils {
  static getDateNDaysAgo(numberOfDays: number) {
    const date = new Date();

    return dayjs(date)
      .subtract(numberOfDays, 'days')
      .toDate();
  }

  static getDateNDaysFromNow(numberOfDays: number) {
    const date = new Date();

    return dayjs(date)
      .add(numberOfDays, 'days')
      .toDate();
  }
}

import moment from 'moment';
import 'moment/locale/ko';

export const utilA = () => {};
export const utilB = () => {};

export const calTimerTime = (time?: number) => {
  if (!time) {
    return '00:00:00';
  }

  const hour = parseInt(`${time / 3600}`, 10);
  const otherValue = time % 3600;
  const minute = parseInt(`${otherValue / 60}`, 10);
  const second = parseInt(`${otherValue % 60}`, 10);

  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  const minStr = minute < 10 ? `0${minute}` : `${minute}`;
  const secondStr = second < 10 ? `0${second}` : `${second}`;

  return `${hourStr}:${minStr}:${secondStr}`;
};

export const calStartEndTime = (startTime?: string, dueTime?: string) => {
  if (startTime === null && dueTime === null) {
    return '정해진 일정 없음';
  }

  if (startTime === null && dueTime !== null) {
    const nowText = moment().format('YYYY-MM-DD');
    if (nowText === dueTime) {
      return '오늘';
    }
    return dueTime;
  }

  return `${startTime} ~ ${dueTime}`;
};

export const calUseTime = (useTime: number) => {
  const hour = parseInt(`${useTime / 3600}`, 10);
  const other = useTime % 3600;
  let min = '';
  if (other <= 900) {
    min = '0';
  } else if (other <= 1800) {
    min = '25';
  } else if (other <= 2700) {
    min = '5';
  } else {
    min = '75';
  }
  const value = `${hour}.${min}`;
  if (value === '0.0') {
    return '0.25';
  }
  return value;
};

export const calDiffSecond = (start: moment.Moment, now: moment.Moment) => {
  const diff = moment.duration(now.diff(start));
  const diffStr = +parseInt(`${diff.asSeconds()}`, 10);
  return diffStr;
};

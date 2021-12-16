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
  const minStr = minute < 10 ? `0${minute}` : `${hour}`;
  const secondStr = second < 10 ? `0${second}` : `${second}`;

  return `${hourStr}:${minStr}:${secondStr}`;
};

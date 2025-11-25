import { formatDistanceToNow } from "date-fns";
export const timeAgo = (_date: string) => {
  const date = new Date(_date);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const secondsInMonth = (months: number): number => {
  const secondsInDay = 24 * 60 * 60;
  const averageDaysInMonth = 30.44;
  return Math.floor(months * averageDaysInMonth * secondsInDay);
};


export const secondsInDay = (days: number): number => {
  return days * 24 * 60 * 60;
};

export const secondsInWeek = (weeks: number): number => {
  return weeks * 7 * 24 * 60 * 60;
};

export const secondsInHour = (hours: number): number => {
  return hours * 60 * 60;
};


export const secondsInMinute = (minutes: number): number => {
  return minutes * 60;
};

export const secondsInYear = (years: number): number => {
  const secondsInDay = 24 * 60 * 60;
  const averageDaysInYear = 365.25; // Account for leap years
  return Math.floor(years * averageDaysInYear * secondsInDay);
};



// reverse
export const secondsToSmartUnit = (seconds: number): string => {
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * 60;
  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * 24 * 60 * 60;
  const secondsPerMonth = 30.44 * 24 * 60 * 60; // Average month
  const secondsPerYear = 365.25 * 24 * 60 * 60; // Average year (leap years)

  if (seconds >= secondsPerYear) {
    const years = seconds / secondsPerYear;
    return `${Math.round(years * 10) / 10} ${years === 1 ? 'year' : 'years'}`;
  } 
  else if (seconds >= secondsPerMonth) {
    const months = seconds / secondsPerMonth;
    return `${Math.round(months * 10) / 10} ${months === 1 ? 'month' : 'months'}`;
  }
  else if (seconds >= secondsPerWeek) {
    const weeks = seconds / secondsPerWeek;
    return `${Math.round(weeks * 10) / 10} ${weeks === 1 ? 'week' : 'weeks'}`;
  }
  else if (seconds >= secondsPerDay) {
    const days = seconds / secondsPerDay;
    return `${Math.round(days * 10) / 10} ${days === 1 ? 'day' : 'days'}`;
  }
  else if (seconds >= secondsPerHour) {
    const hours = seconds / secondsPerHour;
    return `${Math.round(hours * 10) / 10} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  else if (seconds >= secondsPerMinute) {
    const minutes = seconds / secondsPerMinute;
    return `${Math.round(minutes * 10) / 10} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  else {
    return `${Math.round(seconds)} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
};
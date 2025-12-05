import { formatDistanceToNow } from "date-fns";
export const timeAgo = (_date: string) => {
  const date = new Date(_date);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const _secondsInMonth = (months: number): number => {
  const secondsInDay = 24 * 60 * 60;
  const averageDaysInMonth = 30.44;
  return Math.floor(months * averageDaysInMonth * secondsInDay);
};

export const _secondsInDay = (days: number): number => {
  return days * 24 * 60 * 60;
};

export const _secondsInWeek = (weeks: number): number => {
  return weeks * 7 * 24 * 60 * 60;
};

export const _secondsInHour = (hours: number): number => {
  return hours * 60 * 60;
};

export const _secondsInMinute = (minutes: number): number => {
  return minutes * 60;
};

export const _secondsInYear = (years: number): number => {
  const secondsInDay = 24 * 60 * 60;
  const averageDaysInYear = 365.25; // Account for leap years
  return Math.floor(years * averageDaysInYear * secondsInDay);
};

// reverse
export const _secondsToSmartUnit = (seconds: number): string => {
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * 60;
  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * 24 * 60 * 60;
  const secondsPerMonth = 30.44 * 24 * 60 * 60; // Average month
  const secondsPerYear = 365.25 * 24 * 60 * 60; // Average year (leap years)

  if (seconds >= secondsPerYear) {
    const years = seconds / secondsPerYear;
    return `${Math.round(years * 10) / 10} ${years === 1 ? "year" : "years"}`;
  } else if (seconds >= secondsPerMonth) {
    const months = seconds / secondsPerMonth;
    return `${Math.round(months * 10) / 10} ${months === 1 ? "month" : "months"}`;
  } else if (seconds >= secondsPerWeek) {
    const weeks = seconds / secondsPerWeek;
    return `${Math.round(weeks * 10) / 10} ${weeks === 1 ? "week" : "weeks"}`;
  } else if (seconds >= secondsPerDay) {
    const days = seconds / secondsPerDay;
    return `${Math.round(days * 10) / 10} ${days === 1 ? "day" : "days"}`;
  } else if (seconds >= secondsPerHour) {
    const hours = seconds / secondsPerHour;
    return `${Math.round(hours * 10) / 10} ${hours === 1 ? "hour" : "hours"}`;
  } else if (seconds >= secondsPerMinute) {
    const minutes = seconds / secondsPerMinute;
    return `${Math.round(minutes * 10) / 10} ${minutes === 1 ? "minute" : "minutes"}`;
  } else {
    return `${Math.round(seconds)} ${seconds === 1 ? "second" : "seconds"}`;
  }
};

// Time constants in seconds
export const secondsInMinute = 60;
export const secondsInHour = 60 * secondsInMinute; // 3600
export const secondsInDay = 24 * secondsInHour; // 86400
export const secondsInWeek = 7 * secondsInDay; // 604800
export const secondsInMonth = 30 * secondsInDay; // 2592000
export const secondsInYear = 365 * secondsInDay; // 31536000

// Time unit types
export type TimeUnit = "minute" | "hour" | "day" | "week" | "month" | "year";

export interface SmartUnitResult {
  value: number;
  unit: TimeUnit;
  formatted: string;
}

/**
 * Converts seconds to the most appropriate time unit
 */
export function secondsToSmartUnit(seconds: number): string {
  if (!seconds || seconds <= 0) return "0 minutes";

  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < secondsInHour) {
    const minutes = Math.round(absoluteSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  if (absoluteSeconds < secondsInDay) {
    const hours = Math.round(absoluteSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  if (absoluteSeconds < secondsInWeek) {
    const days = Math.round(absoluteSeconds / secondsInDay);
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  if (absoluteSeconds < secondsInMonth) {
    const weeks = Math.round(absoluteSeconds / secondsInWeek);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  }

  if (absoluteSeconds < secondsInYear) {
    const months = Math.round(absoluteSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  const years = Math.round(absoluteSeconds / secondsInYear);
  return `${years} year${years !== 1 ? "s" : ""}`;
}

/**
 * Alternative function that returns structured data
 */
export function secondsToSmartUnitDetailed(seconds: number): SmartUnitResult {
  if (!seconds || seconds <= 0) {
    return { value: 0, unit: "minute", formatted: "0 minutes" };
  }

  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < secondsInHour) {
    const value = Math.round(absoluteSeconds / secondsInMinute);
    return {
      value,
      unit: "minute",
      formatted: `${value} minute${value !== 1 ? "s" : ""}`,
    };
  }

  if (absoluteSeconds < secondsInDay) {
    const value = Math.round(absoluteSeconds / secondsInHour);
    return {
      value,
      unit: "hour",
      formatted: `${value} hour${value !== 1 ? "s" : ""}`,
    };
  }

  if (absoluteSeconds < secondsInWeek) {
    const value = Math.round(absoluteSeconds / secondsInDay);
    return {
      value,
      unit: "day",
      formatted: `${value} day${value !== 1 ? "s" : ""}`,
    };
  }

  if (absoluteSeconds < secondsInMonth) {
    const value = Math.round(absoluteSeconds / secondsInWeek);
    return {
      value,
      unit: "week",
      formatted: `${value} week${value !== 1 ? "s" : ""}`,
    };
  }

  if (absoluteSeconds < secondsInYear) {
    const value = Math.round(absoluteSeconds / secondsInMonth);
    return {
      value,
      unit: "month",
      formatted: `${value} month${value !== 1 ? "s" : ""}`,
    };
  }

  const value = Math.round(absoluteSeconds / secondsInYear);
  return {
    value,
    unit: "year",
    formatted: `${value} year${value !== 1 ? "s" : ""}`,
  };
}

/**
 * Calculates interval in seconds based on duration and time unit
 */
export function calculateInterval(duration: number, unit: string): number {
  const normalizedUnit = unit.toLowerCase().trim();

  switch (normalizedUnit) {
    case "minutes":
    case "minute":
      return secondsInMinute * duration;

    case "hour":
    case "hours":
      return secondsInHour * duration;

    case "day":
    case "days":
      return secondsInDay * duration;

    case "week":
    case "weeks":
      return secondsInWeek * duration;

    case "month":
    case "months":
      return secondsInMonth * duration;

    case "year":
    case "years":
      return secondsInYear * duration;

    default:
      console.warn(`Unknown time unit: ${unit}. Defaulting to days.`);
      return secondsInDay * duration;
  }
}

/**
 * Formats a duration in a human-readable way
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0 minutes";

  const units = [
    { value: secondsInYear, unit: "year" },
    { value: secondsInMonth, unit: "month" },
    { value: secondsInWeek, unit: "week" },
    { value: secondsInDay, unit: "day" },
    { value: secondsInHour, unit: "hour" },
    { value: secondsInMinute, unit: "minute" },
  ];

  let remaining = seconds;
  const parts: string[] = [];

  for (const { value, unit } of units) {
    if (remaining >= value) {
      const count = Math.floor(remaining / value);
      remaining %= value;
      parts.push(`${count} ${unit}${count !== 1 ? "s" : ""}`);
    }
  }

  // If we have very small seconds left, show at least 1 minute
  if (parts.length === 0 && seconds > 0) {
    return "1 minute";
  }

  return parts.join(", ");
}

/**
 * Converts seconds to a short format (e.g., "2h 30m")
 */
export function secondsToShortFormat(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";

  const hours = Math.floor(seconds / secondsInHour);
  const minutes = Math.floor((seconds % secondsInHour) / secondsInMinute);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}

/**
 * Validates if a time unit is supported
 */
export function isValidTimeUnit(unit: string): boolean {
  const validUnits = [
    "minute",
    "minutes",
    "hour",
    "hours",
    "day",
    "days",
    "week",
    "weeks",
    "month",
    "months",
    "year",
    "years",
  ];
  return validUnits.includes(unit.toLowerCase());
}

/**
 * Gets the plural form of a time unit
 */
export function getPluralUnit(unit: string, count: number): string {
  const singularUnits: Record<string, string> = {
    minutes: "minute",
    hours: "hour",
    days: "day",
    weeks: "week",
    months: "month",
    years: "year",
  };

  const baseUnit = singularUnits[unit.toLowerCase()] || unit.toLowerCase();

  if (count === 1) {
    return baseUnit;
  }

  // Handle irregular plurals
  const pluralForms: Record<string, string> = {
    minute: "minutes",
    hour: "hours",
    day: "days",
    week: "weeks",
    month: "months",
    year: "years",
  };

  return pluralForms[baseUnit] || `${baseUnit}s`;
}

// Re-export all time constants as an object for easy access
export const TIME_CONSTANTS = {
  secondsInMinute,
  secondsInHour,
  secondsInDay,
  secondsInWeek,
  secondsInMonth,
  secondsInYear,
} as const;

// Default export for backward compatibility
export default {
  secondsInMinute,
  secondsInHour,
  secondsInDay,
  secondsInWeek,
  secondsInMonth,
  secondsInYear,
  secondsToSmartUnit,
  calculateInterval,
  formatDuration,
  secondsToShortFormat,
  isValidTimeUnit,
  getPluralUnit,
  TIME_CONSTANTS,
};

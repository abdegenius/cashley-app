import { Dispatch, SetStateAction } from "react";

export interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  className?: string;
  disabled?: boolean;
}

export interface MonthYear {
  month: number;
  year: number;
}

export interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface Month {
  value: number;
  name: string;
  isSelected: boolean;
  isDisabled: boolean;
}

export const TIME_UNITS = ["Minutes", "Hour", "Days", "Week", "Months", "Year"] as const;
export const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
export const SERVICE_CONFIG = {
  electricity: { inputLabel: "Meter Number", inputPlaceholder: "Meter Number" },
  tv: { inputLabel: "Smart Card Number", inputPlaceholder: "Smart Card Number" },
  default: { inputLabel: "Phone Number", inputPlaceholder: "Phone Number" },
} as const;

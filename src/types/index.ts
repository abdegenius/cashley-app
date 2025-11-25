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
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
export type SupportedCoin = "BTC" | "ETH" | "USDT";
export const TIME_UNITS = ["Minutes", "Hour", "Days", "Week", "Months", "Year"] as const;
export const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
export const SERVICE_CONFIG = {
  electricity: { inputLabel: "Meter Number", inputPlaceholder: "Meter Number" },
  tv: { inputLabel: "Smart Card Number", inputPlaceholder: "Smart Card Number" },
  default: { inputLabel: "Phone Number", inputPlaceholder: "Phone Number" },
} as const;

export const networks: Record<SupportedCoin, any[]> = {
  BTC: [
    {
      chain: "BTC",
      needTag: false,
      depositConfirm: "1",
      withdrawConfirm: "2",
      minDepositAmount: "0.00001",
      minWithdrawAmount: "0.0005",
      txUrl: "https://www.blockchain.com/explorer/transactions/btc/",
    },
  ],
  ETH: [
    {
      chain: "ETH",
      needTag: false,
      depositConfirm: "12",
      withdrawConfirm: "64",
      minDepositAmount: "0.00000364",
      minWithdrawAmount: "0.00364512",
      txUrl: "https://etherscan.io/tx/",
    },
  ],
  USDT: [
    {
      chain: "ERC20",
      needTag: false,
      depositConfirm: "12",
      withdrawConfirm: "64",
      minDepositAmount: "0.01",
      minWithdrawAmount: "10",
      txUrl: "https://etherscan.io/tx/",
    },
    {
      chain: "TRC20",
      needTag: false,
      depositConfirm: "1",
      withdrawConfirm: "1",
      minDepositAmount: "0.01",
      minWithdrawAmount: "10",
      txUrl: "https://tronscan.org/#/transaction/",
    },
    {
      chain: "BEP20",
      needTag: false,
      depositConfirm: "15",
      withdrawConfirm: "15",
      minDepositAmount: "0.01",
      minWithdrawAmount: "10",
      txUrl: "https://bscscan.com/tx/",
    },
  ],
};

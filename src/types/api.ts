export type ApiResponse<T = any> = {
  error: boolean;
  message: string;
  data: T | null;
};

export interface User {
  uid: string;
  firstname: string;
  lastname: string;
  middlename: string | null;
  username: string;
  email: string;
  phone: string;
  referral_code: string;
  referrer_id: string | null;
  gender: string | null;
  type: string;
  dob: string | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
  ngn_balance: string;
  usdt_balance: string;
  btc_balance: string;
  eth_balance: string;
  bank_code: string | null;
  bank_name: string | null;
  account_reference: string | null;
  account_id: string | null;
  account_name: string | null;
  account_number: string | null;
  level: string;
  pin: string | null;
  house_number: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  nin: string | null;
  nin_status: string;
  bvn: string | null;
  bvn_status: string;
  phone_verification_otp: string;
  phone_verification_status: string;
  email_verification_otp: string;
  email_verification_status: string;
}

export interface Notification {
  id: string;
  title: string;
  date: string;
  description: string;
  isRead?: boolean;
  type?: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  reference: string;
  session_id: string;
  type: "debit" | "credit";
  action: string;
  amount: string;
  fee: string;
  status: "completed" | "failed" | "pending";
  description: string;
  extra: any;
  created_at: string;
}

export interface Wallet {
  id: number;
  ngn_balance: string;
  eth_balance: string;
  btc_balance: string;
  usdt_balance: string;
  created_at?: string;
  updated_at?: string;
}
export interface BankAccount {
  id: number;
  account_id: string;
  account_referencee: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  created_at?: string;
  updated_at?: string;
}

export type PurchaseAction =
  | "airtime"
  | "data"
  | "tv"
  | "electricity"
  | "betting";
export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export type TransactionAction =
  | "airtime"
  | "data"
  | "tv"
  | "electricity"
  | "betting"
  | "fund_transfer"
  | "fund_received"
  | "topup"
  | "bank_transfer";

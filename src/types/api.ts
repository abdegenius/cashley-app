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
  bank_provider_id: string | null;
  crypto_reference: string | null;
  crypto_id: string | null;
  crypto_key: string | null;
  last_change_username_date: string | null;
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

export type PurchaseAction = "airtime" | "data" | "tv" | "electricity" | "betting";
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

export type PurchaseType = "airtime" | "data" | "tv" | "electricity" | "betting";

export type Provider = {
  service_id: string;
  name: string;
  logo: string;
  minimum_amount: string;
  maximum_amount: string;
  type: string;
  serviceID?: string;
};

export type Variation = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixed_price: string;
  service_id?: string;
};

export const SUPPORTED_TOKENS = [
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "/img/eth.png" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "/img/btc.png" },
  { id: "usdt", name: "Tether", symbol: "USDT", icon: "/img/usdt.png" },
];

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

export interface TokenData {
  coin: string;
  iconUrl: string;
  chains: Network[];
}
export interface Network {
  chain?: string;
  needTag?: string;
  depositConfirm?: string;
  withdrawConfirm?: string;
  minDepositAmount?: string;
  minWithdrawAmount?: string;
  txUrl?: string;
}

export interface AssetChain {
  chain: string;
  needTag: string;
  depositConfirm: string;
  withdrawConfirm: string;
  minDepositAmount: string;
  minWithdrawAmount: string;
  txUrl: string;
}

export interface UserCryptoWallet {
  id: string;
  key: string;
  reference: string;
  coin: string;
  chain: string;
  network: string;
  tag: string;
  status: boolean;
  address: string;
  balance: number;
  created_at: string;
  updated_at: string;
}
export interface WalletAsset {
  coin: string;
  balance: string;
  frozen: string;
  updatedAt: string;
}

export interface EstimateFee {
  coin: string;
  chain: string;
  withdrawFee: string;
  minWithdrawAmount: string;
  withdrawable: string;
}

export interface Rate {
  usd_value: number;
  usd_rate: number;
  ngn_value: number;
  ngn_rate: number;
}
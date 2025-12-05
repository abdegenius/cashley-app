import { SupportedCoin } from ".";

export type ApiResponse<T = any> = {
  error: boolean;
  message: string;
  data: T | null;
};

export interface User {
  id?: number;
  password?: string | null;
  device_code?: string | null;
  pnd?: boolean;
  address?: string | null;
  phone_verified?: "0" | "1";
  email_verified?: "0" | "1";
  bvn_verification_status?: "0" | "1";
  bvn_data?: string | null;
  nin_verification_status?: "0" | "1";
  nin_data?: string | null;
  deleted_at?: string | null;
  uid?: string;
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
  crypto_reference?: string | null;
  crypto_id?: string | null;
  crypto_key?: string | null;
  last_change_username_date?: string | null;
  created_at?: string;
  updated_at?: string;
  ngn_balance?: string;
  usdt_balance?: string;
  btc_balance?: string;
  eth_balance?: string;
  bank_code?: string | null;
  bank_name?: string | null;
  account_reference?: string | null;
  account_id?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  level: string;
  pin: string | null;
  house_number?: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  nin: string | null;
  nin_status?: string;
  bvn: string | null;
  bvn_status?: string;
  phone_verification_otp: string;
  phone_verification_status?: string;
  email_verification_otp: string;
  email_verification_status?: string;
}

export interface Notification {
  id: string;
  reference: string;
  title: string;
  body: string;
  status?: string;
  created_at?: string;
}

export interface Transaction {
   user_id?: string;
  id: number | string;
  reference: string;
  session_id?: string;
  type: "debit" | "credit";
  action: string;
  amount: string;
  fee: string;
  status: "completed" | "failed" | "pending";
  description: string;
  extra?: any;
  balance_before: number;
  balance_after: number;
  created_at: string;
  wallet:string;
}

export interface Wallet {
  user_id: number;
  id: number;
  ngn_balance: string;
  eth_balance: string;
  btc_balance: string;
  usdt_balance: string;
  created_at?: string;
  updated_at?: string;
  locked?: number | string;
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

export interface ServicesResponse {
  service_id: string;
  name: string;
  minimium_purchase_amount: number;
  maximium_purchase_amount: number;
  purchase_type: "flexible" | "fix" | string;
  logo: string;
}

export interface ServiceVariationsResponse {
  variation_code: string;
  variation_amount: number;
  name: string;
  duration: string;
}

export interface ElectricityService {
  id: number;
  user_id: string;
  reference: string;
  session_id: string | null;
  type: "credit" | "debit";
  action: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  description: string;
  extra: {
    amount: number;
    service_id: string;
    recipient: string;
    verify_data: {
      address: string;
      meter_number: string;
      customer_name: string;
      minimum_purchase_amount: number;
    };
    meter_number: string;
    variation_code: string;
  };
  created_at: string;
}

export interface AirtimeService {
  id: number;
  user_id: string;
  reference: string;
  session_id: string | null;
  type: "credit" | "debit";
  action: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  description: string;
  extra: {
    phone: string;
    amount: number;
    service_id: string;
  };
  created_at: string;
}

export interface DataService {
  id: number;
  user_id: string;
  reference: string;
  session_id: string | null;
  type: "credit" | "debit";
  action: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  description: string;
  extra: {
    phone: string;
    amount: number;
    service_id: string;
    recipient: string;
    variation_code: string;
  };
  created_at: string;
}

export interface TvService {
  id: number;
  user_id: string;
  reference: string | number;
  session_id: string | null;
  type: "credit" | "debit";
  action: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  description: string;
  extra: {
    type: string;
    amount: number;
    service_id: string;
    recipient: string;
    verify_data: {
      status: string;
      due_date: string;
      customer_name: string;
      customer_type: string;
      customer_number: string;
    };
    variation_code: string;
    smartcard_number: string;
  };
  created_at: string;
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

export interface Schedule {
  id: number;
  title: string;
  action: string;
  identifier: string;
  interval: number;
  frequency: string;
  status: string;
  reference: string;
  data: {
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export type Networks = {
  [K in SupportedCoin]: AssetChain[];
};

export interface CryptoWallet {
  reference: string;
  coin: string;
  chain: string;
  network: string;
  address: string;
  tag: string | null;
  balance: number | string;
  [key: string]: any;
}

export interface Giftcard {
  id: number;
  reference: string;
  name: string;
  logo: string;
  slug: string;
  currency: string;
  min_face_value: string;
  max_face_value: string;
  ngn_rate: string;
  countries: GiftcardCountry[];
  extra: string;
  instruction: string;
  created_at: string;
  updated_at: string;
}

export interface GiftcardCountry {
  country: string;
  flag: string;
}

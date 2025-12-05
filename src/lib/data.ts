import { BankAccount, SidebarItem } from "@/types/admin";
import { Banknote, Users, Wallet as WalletIcon } from "lucide-react";
import {
  User,
  Wallet,
  Transaction,
  ElectricityService,
  TvService,
  DataService,
  AirtimeService,
} from "@/types/api";
import { useEffect, useState } from "react";
import api from "./axios";

export const mockUsers: User[] = [
  {
    id: 1,
    uid: "USR-001",
    username: "talimoses",
    email: "talinanzing1112020@gmail.com",
    phone: "+2348012345678",
    password: "hashed_password_123",
    firstname: "Tali",
    lastname: "Moses",
    middlename: "Nanzing",
    referral_code: "REF-TALI001",
    referrer_id: null,
    gender: "male",
    type: "admin",
    dob: "1990-05-15",
    photo: null,
    device_code: "DEV-001",
    pnd: false,
    level: "5",
    pin: "1234",
    bank_provider_id: "BANK-001",
    house_number: "123",
    street: "Main Street",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    zipcode: "100001",
    address: "123 Main Street, Lagos, Nigeria",
    phone_verification_otp: "123456",
    phone_verified: "1",
    email_verification_otp: "654321",
    email_verified: "1",
    bvn: "12345678901",
    bvn_verification_status: "1",
    bvn_data: JSON.stringify({ verified: true, name: "Tali Moses" }),
    nin: "12345678901",
    nin_verification_status: "1",
    nin_data: JSON.stringify({ verified: true, name: "Tali Moses" }),
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    deleted_at: null,
  },
  {
    id: 2,
    uid: "USR-002",
    username: "johndoe",
    email: "johndoe@example.com",
    phone: "+2348098765432",
    password: "hashed_password_456",
    firstname: "John",
    lastname: "Doe",
    middlename: null,
    referral_code: "REF-JOHN002",
    referrer_id: "1",
    gender: "male",
    type: "user",
    dob: "1992-08-20",
    photo: null,
    device_code: "DEV-002",
    pnd: false,
    level: "3",
    pin: "5678",
    bank_provider_id: "BANK-002",
    house_number: "456",
    street: "Broadway",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    zipcode: "900001",
    address: "456 Broadway, Abuja, Nigeria",
    phone_verification_otp: "234567",
    phone_verified: "1",
    email_verification_otp: "765432",
    email_verified: "1",
    bvn: "23456789012",
    bvn_verification_status: "1",
    bvn_data: JSON.stringify({ verified: true, name: "John Doe" }),
    nin: null,
    nin_verification_status: "0",
    nin_data: null,
    created_at: "2024-01-16T11:30:00Z",
    updated_at: "2024-01-16T11:30:00Z",
    deleted_at: null,
  },
  {
    id: 3,
    uid: "USR-003",
    username: "janesmith",
    email: "janesmith@example.com",
    phone: "+2348055512345",
    password: "hashed_password_789",
    firstname: "Jane",
    lastname: "Smith",
    middlename: "Marie",
    referral_code: "REF-JANE003",
    referrer_id: "1",
    gender: "female",
    type: "user",
    dob: "1995-03-10",
    photo: null,
    device_code: "DEV-003",
    pnd: true,
    level: "2",
    pin: "9012",
    bank_provider_id: "BANK-003",
    house_number: "789",
    street: "Oak Avenue",
    city: "Port Harcourt",
    state: "Rivers",
    country: "Nigeria",
    zipcode: "500001",
    address: "789 Oak Avenue, Port Harcourt, Nigeria",
    phone_verification_otp: "345678",
    phone_verified: "1",
    email_verification_otp: "876543",
    email_verified: "1",
    bvn: "34567890123",
    bvn_verification_status: "0",
    bvn_data: null,
    nin: "34567890123",
    nin_verification_status: "1",
    nin_data: JSON.stringify({ verified: true, name: "Jane Smith" }),
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
    deleted_at: null,
  },
  {
    id: 4,
    uid: "USR-004",
    username: "mikejohnson",
    email: "mikejohnson@example.com",
    phone: "+2348033344455",
    password: "hashed_password_012",
    firstname: "Mike",
    lastname: "Johnson",
    middlename: null,
    referral_code: "REF-MIKE004",
    referrer_id: "2",
    gender: "male",
    type: "user",
    dob: "1988-12-05",
    photo: null,
    device_code: "DEV-004",
    pnd: false,
    level: "4",
    pin: "3456",
    bank_provider_id: "BANK-004",
    house_number: "321",
    street: "Pine Street",
    city: "Ibadan",
    state: "Oyo",
    country: "Nigeria",
    zipcode: "200001",
    address: "321 Pine Street, Ibadan, Nigeria",
    phone_verification_otp: "456789",
    phone_verified: "0",
    email_verification_otp: "987654",
    email_verified: "1",
    bvn: "45678901234",
    bvn_verification_status: "1",
    bvn_data: JSON.stringify({ verified: true, name: "Mike Johnson" }),
    nin: null,
    nin_verification_status: "0",
    nin_data: null,
    created_at: "2024-01-18T14:20:00Z",
    updated_at: "2024-01-18T14:20:00Z",
    deleted_at: null,
  },
  {
    id: 5,
    uid: "USR-005",
    username: "sarahwilson",
    email: "sarahwilson@example.com",
    phone: "+2348077788899",
    password: "hashed_password_345",
    firstname: "Sarah",
    lastname: "Wilson",
    middlename: "Grace",
    referral_code: "REF-SARAH005",
    referrer_id: null,
    gender: "female",
    type: "user",
    dob: "1993-07-25",
    photo: null,
    device_code: "DEV-005",
    pnd: false,
    level: "1",
    pin: "7890",
    bank_provider_id: null,
    house_number: "654",
    street: "Maple Road",
    city: "Kano",
    state: "Kano",
    country: "Nigeria",
    zipcode: "700001",
    address: "654 Maple Road, Kano, Nigeria",
    phone_verification_otp: "567890",
    phone_verified: "1",
    email_verification_otp: "098765",
    email_verified: "0",
    bvn: null,
    bvn_verification_status: "0",
    bvn_data: null,
    nin: null,
    nin_verification_status: "0",
    nin_data: null,
    created_at: "2024-01-19T16:45:00Z",
    updated_at: "2024-01-19T16:45:00Z",
    deleted_at: null,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    reference: "REF-001",
    type: "credit",
    action: "wallet_topup",
    amount: "50000",
    fee: "50",
    balance_before: 100000,
    balance_after: 149950,
    status: "completed",
    description: "Bank Transfer Deposit",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    reference: "REF-002",
    type: "debit",
    action: "bank_transfer",
    amount: "20000",
    fee: "100",
    balance_before: 95000,
    balance_after: 74900,
    status: "completed",
    description: "ATM Withdrawal",
    created_at: "2024-01-16T14:45:00Z",
  },
  {
    id: 3,
    reference: "REF-003",
    type: "credit",
    action: "fund_transfer",
    amount: "15000",
    fee: "10",
    balance_before: 10000,
    balance_after: 24990,
    status: "pending",
    description: "Peer-to-Peer Transfer",
    created_at: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    user_id: "1",
    reference: "REF-004",
    type: "debit",
    action: "electricity",
    amount: "25000",
    fee: "25",
    balance_before: 149950,
    balance_after: 124925,
    status: "failed",
    description: "Bill Payment - Electricity",
    created_at: "2024-01-18T16:20:00Z",
  },
  {
    id: "5",
    user_id: "4",
    reference: "REF-005",
    type: "credit",
    action: "wallet_topup",
    amount: "75000",
    fee: "75",
    balance_before: 0,
    balance_after: 74925,
    status: "completed",
    description: "Mobile Money Deposit",
    created_at: "2024-01-19T11:10:00Z",
  },
];

export const mockWallets: Wallet[] = [
  {
    id: 1,
    ngn_balance: "2000",
    eth_balance: "2000",
    btc_balance: "2000",
    usdt_balance: "124925",
    locked: 5000,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    ngn_balance: "2000",
    eth_balance: "2000",
    btc_balance: "2000",
    usdt_balance: "74900",
    locked: 2000,
    created_at: "2024-01-16",
  },
  {
    id: 3,
    ngn_balance: "2000",
    eth_balance: "2000",
    btc_balance: "2000",
    usdt_balance: "24990",
    locked: 1000,
    created_at: "2024-01-17",
  },
  {
    id: 4,
    ngn_balance: "2000",
    eth_balance: "2000",
    btc_balance: "2000",
    usdt_balance: "74925",
    locked: 3000,
    created_at: "2024-01-18",
  },
  {
    id: 5,
    ngn_balance: "2000",
    eth_balance: "2000",
    btc_balance: "2000",
    usdt_balance: "0",
    locked: 0,
    created_at: "2024-01-19",
  },
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    userId: "1",
    bankName: "Guaranty Trust Bank",
    bankCode: "058",
    accountName: "Tali Moses",
    accountNumber: "0123456789",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    bankName: "Access Bank",
    bankCode: "044",
    accountName: "John Doe",
    accountNumber: "9876543210",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    userId: "3",
    bankName: "Zenith Bank",
    bankCode: "057",
    accountName: "Jane Smith",
    accountNumber: "4561237890",
    createdAt: "2024-01-17",
  },
  {
    id: "4",
    userId: "4",
    bankName: "First Bank",
    bankCode: "011",
    accountName: "Mike Johnson",
    accountNumber: "7890123456",
    createdAt: "2024-01-18",
  },
];

export const electricityService: ElectricityService[] = [
  {
    id: 105,
    user_id: "105",
    reference: "26043025541520995006",
    session_id: "202510291406eninLfE3",
    type: "debit",
    action: "electricity",
    amount: "1000.00",
    status: "failed",
    wallet: "balance",
    description: "KADUNA ELECTRIC token of ₦1,000.00 purchased for 1111111111111",
    extra: {
      amount: 1000,
      recipient: "1111111111111",
      service_id: "kaduna-electric",
      verify_data: {
        address: "DANTU ROAD OPP ZARIA",
        meter_number: "1111111111111",
        customer_name: "TEST METER",
        minimum_purchase_amount: 500,
      },
      meter_number: "1111111111111",
      variation_code: "prepaid",
    },
    created_at: "2025-10-29T13:06:19.000Z",
  },
  {
    id: 106,
    user_id: "106",
    reference: "26043025541520995006",
    session_id: "202510291406eninLfE3",
    type: "debit",
    action: "electricity",
    amount: "1000.00",
    status: "failed",
    wallet: "balance",
    description: "KADUNA ELECTRIC token of ₦1,000.00 purchased for 1111111111111",
    extra: {
      amount: 1000,
      recipient: "1111111111111",
      service_id: "kaduna-electric",
      verify_data: {
        address: "DANTU ROAD OPP ZARIA",
        meter_number: "1111111111111",
        customer_name: "TEST METER",
        minimum_purchase_amount: 500,
      },
      meter_number: "1111111111111",
      variation_code: "prepaid",
    },
    created_at: "2025-10-29T13:06:19.000Z",
  },
  {
    id: 107,
    user_id: "107",
    reference: "26043025541520995006",
    session_id: "202510291406eninLfE3",
    type: "debit",
    action: "electricity",
    amount: "1000.00",
    status: "failed",
    wallet: "balance",
    description: "KADUNA ELECTRIC token of ₦1,000.00 purchased for 1111111111111",
    extra: {
      amount: 1000,
      recipient: "1111111111111",
      service_id: "kaduna-electric",
      verify_data: {
        address: "DANTU ROAD OPP ZARIA",
        meter_number: "1111111111111",
        customer_name: "TEST METER",
        minimum_purchase_amount: 500,
      },
      meter_number: "1111111111111",
      variation_code: "prepaid",
    },
    created_at: "2025-10-29T13:06:19.000Z",
  },
  {
    id: 108,
    user_id: "108",
    reference: "26043025541520995006",
    session_id: "202510291406eninLfE3",
    type: "debit",
    action: "electricity",
    amount: "1000.00",
    status: "failed",
    wallet: "balance",
    description: "KADUNA ELECTRIC token of ₦1,000.00 purchased for 1111111111111",
    extra: {
      amount: 1000,
      recipient: "1111111111111",
      service_id: "kaduna-electric",
      verify_data: {
        address: "DANTU ROAD OPP ZARIA",
        meter_number: "1111111111111",
        customer_name: "TEST METER",
        minimum_purchase_amount: 500,
      },
      meter_number: "1111111111111",
      variation_code: "prepaid",
    },
    created_at: "2025-10-29T13:06:19.000Z",
  },
];

export const tvService: TvService[] = [
  {
    id: 99,
    user_id: "99",
    reference: "03975832254317997788",
    session_id: "202510291235DVRncnrU",
    type: "debit",
    action: "tv",
    amount: "1100.00",
    status: "completed",
    wallet: "balance",
    description:
      "DSTV subscription of ₦1,100.00 - DSTV BOX OFFICE PREMIER for 1212121212 was successful",
    extra: {
      type: "tv",
      amount: 1100,
      recipient: "1212121212",
      service_id: "dstv",
      verify_data: {
        status: "ACTIVE",
        due_date: "2025-02-06T00:00:00",
        customer_name: "TEST METER",
        customer_type: "DSTV",
        customer_number: "8061522780",
      },
      variation_code: "dstv-box-office-premier",
      smartcard_number: "1212121212",
    },
    created_at: "2025-10-29T11:35:04.000Z",
  },
  {
    id: 100,
    user_id: "100",
    reference: "03975832254317997788",
    session_id: "202510291235DVRncnrU",
    type: "debit",
    action: "tv",
    amount: "1100.00",
    status: "completed",
    wallet: "balance",
    description:
      "DSTV subscription of ₦1,100.00 - DSTV BOX OFFICE PREMIER for 1212121212 was successful",
    extra: {
      type: "tv",
      amount: 1100,
      recipient: "1212121212",
      service_id: "dstv",
      verify_data: {
        status: "ACTIVE",
        due_date: "2025-02-06T00:00:00",
        customer_name: "TEST METER",
        customer_type: "DSTV",
        customer_number: "8061522780",
      },
      variation_code: "dstv-box-office-premier",
      smartcard_number: "1212121212",
    },
    created_at: "2025-10-29T11:35:04.000Z",
  },
  {
    id: 101,
    user_id: "101",
    reference: "03975832254317997788",
    session_id: "202510291235DVRncnrU",
    type: "debit",
    action: "tv",
    amount: "1100.00",
    status: "completed",
    wallet: "balance",
    description:
      "DSTV subscription of ₦1,100.00 - DSTV BOX OFFICE PREMIER for 1212121212 was successful",
    extra: {
      type: "tv",
      amount: 1100,
      recipient: "1212121212",
      service_id: "dstv",
      verify_data: {
        status: "ACTIVE",
        due_date: "2025-02-06T00:00:00",
        customer_name: "TEST METER",
        customer_type: "DSTV",
        customer_number: "8061522780",
      },
      variation_code: "dstv-box-office-premier",
      smartcard_number: "1212121212",
    },
    created_at: "2025-10-29T11:35:04.000Z",
  },
];

export const dataService: DataService[] = [
  {
    id: 110,
    user_id: "110",
    reference: "11850103394452745035",
    session_id: "2025102914420IQQ7NEd",
    type: "debit",
    action: "data",
    amount: "200.00",
    status: "pending",
    wallet: "balance",
    description: "MTN DATA purchase of ₦200.00 to 08011111111",
    extra: {
      phone: "08011111111",
      amount: 200,
      recipient: "08011111111",
      service_id: "mtn-data",
      variation_code: "mtn-xtradata-200",
    },
    created_at: "2025-10-29T13:42:54.000Z",
  },
  {
    id: 111,
    user_id: "111",
    reference: "11850103394452745035",
    session_id: "2025102914420IQQ7NEd",
    type: "debit",
    action: "data",
    amount: "200.00",
    status: "failed",
    wallet: "balance",
    description: "MTN DATA purchase of ₦200.00 to 08011111111",
    extra: {
      phone: "08011111111",
      amount: 200,
      recipient: "08011111111",
      service_id: "mtn-data",
      variation_code: "mtn-xtradata-200",
    },
    created_at: "2025-10-29T13:42:54.000Z",
  },
  {
    id: 112,
    user_id: "112",
    reference: "11850103394452745035",
    session_id: "2025102914420IQQ7NEd",
    type: "debit",
    action: "data",
    amount: "200.00",
    status: "completed",
    wallet: "balance",
    description: "MTN DATA purchase of ₦200.00 to 08011111111",
    extra: {
      phone: "08011111111",
      amount: 200,
      recipient: "08011111111",
      service_id: "mtn-data",
      variation_code: "mtn-xtradata-200",
    },
    created_at: "2025-10-29T13:42:54.000Z",
  },
  {
    id: 113,
    user_id: "113",
    reference: "11850103394452745035",
    session_id: "2025102914420IQQ7NEd",
    type: "debit",
    action: "data",
    amount: "200.00",
    status: "completed",
    wallet: "balance",
    description: "MTN DATA purchase of ₦200.00 to 08011111111",
    extra: {
      phone: "08011111111",
      amount: 200,
      recipient: "08011111111",
      service_id: "mtn-data",
      variation_code: "mtn-xtradata-200",
    },
    created_at: "2025-10-29T13:42:54.000Z",
  },
];

export const airtimeService: AirtimeService[] = [
  {
    id: 37,
    user_id: "37",
    reference: "10007534480242448226",
    session_id: "req_202510142220_WXuCb54o",
    type: "debit",
    action: "airtime",
    amount: "100.00",
    status: "pending",
    wallet: "balance",
    description: "AIRTEL airtime purchase of NGN100 to 09125381992",
    extra: {
      phone: "09125381992",
      amount: 100,
      service_id: "airtel",
    },
    created_at: "2025-10-14T21:20:45.000Z",
  },
  {
    id: 38,
    user_id: "38",
    reference: "10007534480242448226",
    session_id: "req_202510142220_WXuCb54o",
    type: "debit",
    action: "airtime",
    amount: "100.00",
    status: "failed",
    wallet: "balance",
    description: "AIRTEL airtime purchase of NGN100 to 09125381992",
    extra: {
      phone: "09125381992",
      amount: 100,
      service_id: "airtel",
    },
    created_at: "2025-10-14T21:20:45.000Z",
  },
  {
    id: 39,
    user_id: "39",
    reference: "10007534480242448226",
    session_id: "req_202510142220_WXuCb54o",
    type: "debit",
    action: "airtime",
    amount: "100.00",
    status: "completed",
    wallet: "balance",
    description: "AIRTEL airtime purchase of NGN100 to 09125381992",
    extra: {
      phone: "09125381992",
      amount: 100,
      service_id: "airtel",
    },
    created_at: "2025-10-14T21:20:45.000Z",
  },
];

export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "wallets", label: "Wallets" },
  { id: "airtime", label: "Airtime Purchases" },
  { id: "data", label: "Data Subscriptions" },
  { id: "electricity", label: "Electricity Bills" },
  {
    id: "tv-subscription",
    label: "Cable/TV Subscriptions",
  },
  { id: "transactions", label: "Transactions" },
];

// User CRUD operations (Only Users have create functionality)
export const userService = {
  getAll: () => mockUsers,
  create: (user: Omit<User, "id" | "created_at" | "updated_at">) => {
    const newUser: User = {
      ...user,
      id: mockUsers.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },
  update: (id: number, updates: Partial<User>) => {
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return mockUsers[index];
    }
    return null;
  },
  delete: (id: number) => {
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      const deletedUser = mockUsers[index];
      mockUsers[index] = {
        ...deletedUser,
        deleted_at: new Date().toISOString(),
      };
      return deletedUser;
    }
    return null;
  },
};

// Transaction operations (Read, Update, Delete only)
export const transactionService = {
  getAll: () => mockTransactions,
  update: (id: string, updates: Partial<Transaction>) => {
    const index = mockTransactions.findIndex((transaction) => transaction.id === Number(id));
    if (index !== -1) {
      mockTransactions[index] = { ...mockTransactions[index], ...updates };
      return mockTransactions[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = mockTransactions.findIndex((transaction) => transaction.id === Number(id));
    if (index !== -1) {
      return mockTransactions.splice(index, 1)[0];
    }
    return null;
  },
};

// Wallet operations (Read, Update, Delete only)
export const walletService = {
  getAll: () => mockWallets,
  update: (id: string, updates: Partial<Wallet>) => {
    const numericId = Number(id);
    const index = mockWallets.findIndex((wallet) => wallet.id === numericId);
    if (index !== -1) {
      mockWallets[index] = { ...mockWallets[index], ...updates };
      return mockWallets[index];
    }
    return null;
  },
  delete: (id: string) => {
    const numericId = Number(id);
    const index = mockWallets.findIndex((wallet) => wallet.id === numericId);
    if (index !== -1) {
      return mockWallets.splice(index, 1)[0];
    }
    return null;
  },
};

export const purchaseElectricity = {
  getAll: () => electricityService,
  update: (id: string, updates: Partial<ElectricityService>) => {
    const index = electricityService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      electricityService[index] = { ...electricityService[index], ...updates };
      return electricityService[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = electricityService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      return electricityService.splice(index, 1)[0];
    }
    return null;
  },
};

export const purchaseData = {
  getAll: () => dataService,
  update: (id: string, updates: Partial<DataService>) => {
    const index = dataService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      dataService[index] = { ...dataService[index], ...updates };
      return dataService[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = dataService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      return dataService.splice(index, 1)[0];
    }
    return null;
  },
};

export const purchaseAirtime = {
  getAll: () => airtimeService,
  update: (id: string, updates: Partial<AirtimeService>) => {
    const index = airtimeService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      airtimeService[index] = { ...airtimeService[index], ...updates };
      return airtimeService[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = airtimeService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      return airtimeService.splice(index, 1)[0];
    }
    return null;
  },
};

export const purchaseTv = {
  getAll: () => tvService,
  update: (id: string, updates: Partial<TvService>) => {
    const index = tvService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      tvService[index] = { ...tvService[index], ...updates };
      return tvService[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = tvService.findIndex((purchase) => purchase.id.toString() === id);
    if (index !== -1) {
      return tvService.splice(index, 1)[0];
    }
    return null;
  },
};

import { PurchaseAction, PurchaseType } from "@/types/api";
import {
  Bitcoin,
  ChartBar,
  Gift,
  Lightbulb,
  ListCheck,
  PhoneCall,
  PiggyBank,
  Plus,
  Send,
  Tv,
  Volleyball,
  Wifi,
} from "lucide-react";

export const stringArray = (value: string, splitter: string = "-") => {
  let array = value.trim().toString().split(splitter);
  if (array.length == 0) {
    array = ["", ""];
  } else if (array.length == 1) {
    array = [array[0].trim(), ""];
  } else if (array.length == 2) {
    array = [array[0].trim(), array[1].trim()];
  } else if (array.length == 3) {
    array = [array[0].trim(), array[1].trim(), array[2].trim()];
  } else if (array.length > 3) {
    array = [array[0].trim(), array[1].trim(), array[2].trim(), array[3].trim()];
  }
  return array;
};

export const customerLabel = (type: PurchaseAction) => {
  if (["airtime", "data"].includes(type)) {
    return "Phone Number";
  } else if (["tv"].includes(type)) {
    return "Smartcard Number";
  } else if (["electricity"].includes(type)) {
    return "Meter Number";
  } else if (["betting"].includes(type)) {
    return "Account ID";
  } else {
    return "";
  }
};

export const pinExtractor = (otp: string[]) => {
  if (Array.isArray(otp)) {
    return otp.join().replaceAll(" ", "").replaceAll(",", "").trim();
  }
  return "";
};

export const services = [
  {
    id: "send",
    name: "Send",
    title: "Send Money",
    icon: Send,
    link: "/app/send",
    featured: false,
    purchaseable: false,
  },
  {
    id: "receive",
    name: "Receive",
    title: "Receive Money",
    icon: Plus,
    link: "/app/receive",
    featured: false,
    purchaseable: false,
  },
  {
    id: "data",
    name: "Data",
    title: "Data Purchase",
    icon: Wifi,
    link: "/app/services/data",
    featured: true,
    purchaseable: true,
    slider: {
      color: "from-green-500 to-green-700",
      title: "Data Topups Made Easy",
      subtitle: "Stay connected & stream anywhere",
      tagline: "Tap, recharge, and surf the web 🌐",
    },
  },
  {
    id: "airtime",
    name: "Airtime",
    title: "Airtime Purchase",
    icon: PhoneCall,
    link: "/app/services/airtime",
    featured: true,
    purchaseable: true,
    slider: {
      color: "from-blue-500 to-blue-700",
      title: "Instant Airtime Recharge",
      subtitle: "Never run out of talk time",
      tagline: "Recharge and stay chatting 💬",
    },
  },
  {
    id: "electricity",
    name: "Electricity",
    title: "Electricity Token",
    icon: Lightbulb,
    link: "/app/services/electricity",
    featured: true,
    purchaseable: true,
    slider: {
      color: "from-yellow-500 to-yellow-700",
      title: "Power Up Instantly",
      subtitle: "Pay bills and keep your lights on",
      tagline: "Simple, fast, and shock-free ⚡",
    },
  },
  {
    id: "tv",
    name: "Cable/TV",
    title: "Cable/TV Subscription",
    icon: Tv,
    link: "/app/services/tv",
    featured: true,
    purchaseable: true,
    slider: {
      color: "from-purple-500 to-pink-500",
      title: "Binge Without Limits",
      subtitle: "Cable subscriptions in a flash",
      tagline: "Catch your favorite shows anytime 📺",
    },
  },
  {
    id: "giftcard",
    name: "Gift Card",
    title: "Gift Card",
    icon: Gift,
    link: "",
    featured: false,
    purchaseable: false,
  },
  {
    id: "betting",
    name: "Betting",
    title: "Betting Topup",
    icon: Volleyball,
    link: "",
    featured: false,
    purchaseable: false,
    slider: {
      color: "from-red-500 to-red-700",
      title: "Bet & Win",
      subtitle: "Top up your betting account instantly",
      tagline: "Place bets, win big, flex later 🎯",
    },
  },
  {
    id: "crypto",
    name: "Crypto",
    title: "Send & Receive Crypto",
    icon: Bitcoin,
    link: "/app/crypto",
    featured: true,
    purchaseable: false,
    slider: {
      color: "from-indigo-500 to-purple-600",
      title: "Trade Crypto Easily",
      subtitle: "Transact crypto instantly",
      tagline: "Flex your digital assets 🚀",
    },
  },
  {
    id: "savings",
    name: "Savings",
    title: "Savings",
    icon: PiggyBank,
    link: "",
    featured: true,
    purchaseable: false,
    slider: {
      color: "from-teal-500 to-cyan-500",
      title: "Save Smarter",
      subtitle: "Grow your funds effortlessly",
      tagline: "Stack coins and watch them grow 💰",
    },
  },
  {
    id: "investments",
    name: "Investments",
    title: "Investments",
    icon: ChartBar,
    link: "",
    featured: false,
    purchaseable: false,
  },
  {
    id: "account_statements",
    name: "Statement",
    title: "Generate Account Statement",
    icon: ListCheck,
    link: "account-statement",
    featured: false,
    purchaseable: false,
  },
];

export const getFeatureData = (_id: string) => {
  const id = _id.trim().toLowerCase();
  if (id) {
    return services.find((service) => service.id === id);
  }
  return null;
};

export const statusLabel = (_status: string) => {
  const status = _status.trim().toLowerCase();
  if (status === "completed")
    return "<span class='bg-lime-100 border border-lime-400 text-lime-800 px-2 py-0.5 rounded-full text-xs font-medium'>Completed</span>";
  else if (status === "failed")
    return "<span class='bg-rose-100 border border-rose-400 text-rose-800 px-2 py-0.5 rounded-full text-xs font-medium'>Failed</span>";
  else if (status === "pending")
    return "<span class='bg-amber-100 border border-amber-4000 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium'>Pending</span>";
  else
    return "<span class='bg-zinc-100 border border-zinc-400 text-zinc-800 px-2 py-0.5 rounded-full text-xs font-medium'>Processing</span>";
};

export const cleanServiceName = (name: string) => {
  return name
    .replace(
      /\b(Distribution|distribution|DISTRIBUTION|Company|company|COMPANY|Electric|electric|ELECTRIC|Electricity|electricity|ELECTRICITY|vtu|Vtu|VTU|Payment|payment|PAYMENT|Data|data|DATA|airtime|Airtime|AIRTIME|internet|Internet|INTERNET|Subscription|subscription|SUBSCRIPTION)\b/gi,
      ""
    )
    .trim();
};

const purchaseable_services = [
  {
    title: "Buy Airtime",
    icon: PhoneCall,
    step_1_title: "Select network",
    step_1_description: "Choose your network provider",
    recipient: "Phone Number",
    placeholder: "Enter phone number",
    show_amount_grid: true,
    show_variations: false,
    id: "airtime",
    api_key: "airtime",
  },
  {
    title: "Purchase Data",
    icon: Wifi,
    step_1_title: "Select network",
    step_1_description: "Choose your network provider",
    recipient: "Phone Number",
    placeholder: "Enter phone number",
    show_amount_grid: false,
    show_variations: true,
    id: "data",
    api_key: "data",
  },
  {
    title: "Cable/TV Subscription",
    icon: Tv,
    step_1_title: "Select provider",
    step_1_description: "Choose your TV service provider",
    recipient: "Smartcard Number",
    placeholder: "Enter smartcard number",
    show_amount_grid: false,
    show_variations: true,
    id: "tv",
    api_key: "tv-subscription",
  },
  {
    title: "Purchase Electricity Token",
    icon: Tv,
    step_1_title: "Select provider",
    step_1_description: "Choose your Electricity distro",
    recipient: "Meter Number",
    placeholder: "Enter meter number",
    show_amount_grid: false,
    show_variations: true,
    id: "electricity",
    api_key: "electricity-bill",
  },
];

export const getPurchaseableService = (type: PurchaseType) => {
  return purchaseable_services.find((service) => service.id == type);
};

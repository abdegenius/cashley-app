"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Eye,
  EyeOff,
  Wifi,
  Tv,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import api from "@/libs/axios";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";

type PurchaseType = "airtime" | "data" | "tv";

interface PurchaseProps {
  type: PurchaseType;
}

type TransactionData = {
  dateTime: string;
  paymentMethod: string;
  status: string;
  description: string;
  transactionId: string;
  providerLogo: string;
  providerName: string;
  planName: string;
};

type Provider = {
  serviceID: string;
  name: string;
  image: string;
  minimium_amount: string;
  maximum_amount: string;
  product_type: string;
};

type Variation = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
  serviceID?: string;
};


export default function Purchase({ type }: PurchaseProps) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showOTPFull] = useState(false);
  const [reference, setReference] = useState("");

  const [formData, setFormData] = useState({
    service_id: "",
    amount: "",
    customer_id: "",
    variation: null as Variation | null,
    transactionData: null as TransactionData | null,
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const presetAmounts = [100, 200, 500, 1000, 2000, 5000];


  const getConfig = () => {
    const config = {
      airtime: {
        title: "Buy Airtime",
        icon: PhoneCall,
        step1Title: "Select network",
        step1Description: "Choose your network provider",
        customerLabel: "Phone Number",
        placeholder: "+2348012345678",
        showAmountGrid: true,
        showVariations: false,
        apiServiceType: "airtime"
      },
      data: {
        title: "Purchase Data",
        icon: Wifi,
        step1Title: "Select network",
        step1Description: "Choose your network provider",
        customerLabel: "Phone Number",
        placeholder: "Enter phone number",
        showAmountGrid: false,
        showVariations: true,
        apiServiceType: "data"
      },
      tv: {
        title: "Cable Subscription",
        icon: Tv,
        step1Title: "Select provider",
        step1Description: "Choose your TV service provider",
        customerLabel: "Smartcard Number",
        placeholder: "Enter smartcard number",
        showAmountGrid: false,
        showVariations: true,
        apiServiceType: "tv-subscription"
      },
    };

    return config[type];
  };

  const config = getConfig();

 const fetchProviders = async () => {
  setLoading(true);
  try {
    console.log('Fetching providers for service type:', config.apiServiceType);
    
    const response = await api.get<ApiResponse>(
      `/general/bill/service?service=${config.apiServiceType}`
    );
    
    console.log('Providers API Response:', response.data);
    
    if (response.data.error === false) {
      const providersData: Provider[] = response.data.data.map((provider: any) => ({
        serviceID: provider.serviceID,
        name: provider.name,
        image: provider.image,
        minimium_amount: provider.minimium_amount,
        maximum_amount: provider.maximum_amount,
        product_type: provider.product_type
      }));
      console.log('Processed providers:', providersData);
      setProviders(providersData);
    } else {
      console.error("API Error:", response.data.message);
      toast.error(`Failed to load providers: ${response.data.message}`);
      setProviders([]);
    }
  } catch (error: any) {
    console.error("Network Error:", error);
    toast.error(`Network error: ${error.message}`);
    setProviders([]);
  } finally {
    setLoading(false);
  }
};

const fetchVariations = async (serviceID: string) => {
  setLoading(true);
  try {
    console.log('Fetching variations for serviceID:', serviceID);
    
    const response = await api.get<ApiResponse>(
      `/general/bill/service-variations?service_id=${serviceID}`
    );
    
    console.log('Variations API Response:', response.data);
    
    if (response.data.error === false && response.data.data.variations) {
      const variationsData: Variation[] = response.data.data.variations.map((variation: any) => ({
        variation_code: variation.variation_code,
        name: variation.name,
        variation_amount: variation.variation_amount,
        fixedPrice: variation.fixedPrice,
        serviceID: serviceID
      }));
      console.log('Processed variations:', variationsData);
      setVariations(variationsData);
    } else {
      console.error("API Error:", response.data.message);
      toast.error(`Failed to load plans: ${response.data.message}`);
      setVariations([]);
    }
  } catch (error: any) {
    console.error("Network Error:", error);
    toast.error(`Network error: ${error.message}`);
    setVariations([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!formData.service_id) return;

  // Validate serviceID format
  if (typeof formData.service_id !== 'string' || formData.service_id.trim() === '') {
    console.error('Invalid service_id format:', formData.service_id);
    return;
  }

  if (config.showVariations) {
    fetchVariations(formData.service_id);
  }
}, [formData.service_id, type, config.showVariations]);

  // Fetch providers on mount
 useEffect(() => {
    fetchProviders();
  }, [type]);

  useEffect(() => {
    if (!formData.service_id) return;

    if (config.showVariations) {
      fetchVariations(formData.service_id);
    }
  }, [formData.service_id, type, config.showVariations]);

  const handleBack = () => {
    if (step === 1) {
      window.history.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleNumberClick = (num: string) => {
    if (num === "←") {
      const lastFilledIndex = otp.reduce(
        (acc, digit, idx) => (digit ? idx : acc),
        -1
      );
      if (lastFilledIndex >= 0) {
        const newOtp = [...otp];
        newOtp[lastFilledIndex] = "";
        setOtp(newOtp);
      }
    } else if (num === "✓") {
      if (otp.every((d) => d)) {
        handleSubmit();
      }
    } else {
      const emptyIndex = otp.findIndex((digit) => !digit);
      if (emptyIndex !== -1) {
        const newOtp = [...otp];
        newOtp[emptyIndex] = num;
        setOtp(newOtp);
      }
    }
  };

  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare request data based on purchase type
      const requestData: any = {
        phone: formData.customer_id,
        amount: parseFloat(formData.amount),
        service_id: formData.service_id,
        pin: otp.join("")
      };

      if (type === "data" && formData.variation) {
        requestData.variation_code = formData.variation.variation_code;
      } else if (type === "tv" && formData.variation) {
        requestData.smartcard_number = formData.customer_id;
        requestData.variation_code = formData.variation.variation_code;
        requestData.type = "renew";
      }

      let endpoint = "";
      switch (type) {
        case "airtime":
          endpoint = "/transactions/buy-airtime";
          break;
        case "data":
          endpoint = "/transactions/buy-data";
          break;
        case "tv":
          endpoint = "/transactions/buy-tv";
          break;
      }

      const response = await api.post<ApiResponse>(endpoint, requestData);

      if (response.data.error === false) {
        // Create transaction data from response
        const transactionData: TransactionData = {
          dateTime: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }),
          paymentMethod: "Cashley",
          status: response.data.data.status,
          description: response.data.data.description || 
            (type === "data" ? "Data plan" : 
             type === "airtime" ? "Airtime" : "TV Subscription"),
          transactionId: response.data.data?.session_id || `TRX${Date.now()}`,
          providerLogo: providers.find((p) => p.serviceID === formData.service_id)?.image || "",
          providerName: providers.find((p) => p.serviceID === formData.service_id)?.name || "",
          planName: formData.variation?.name || "",
        };

        setSuccess(true);
        setReference(transactionData.transactionId);
        setFormData((prev) => ({ ...prev, transactionData }));
      } else {
        throw new Error(response.data.message || "Transaction failed");
      }
      
      handleNext();
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setSuccess(false);
      handleNext();
    } finally {
      setLoading(false);
    }
  };


  const isStep1Valid = () => {
    if (!formData.service_id) return false;
    if (!formData.customer_id) return false;

    if (config.showVariations && !formData.variation) return false;
    if (config.showAmountGrid && !formData.amount) return false;

    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-3xl font-black">{config.step1Title}</h2>
            </div>

            <div className="space-y-6">
              <ProviderSelect
                providers={providers}
                value={formData.service_id}
                onChange={(service_id) =>
                  setFormData((prev) => ({ ...prev, service_id }))
                }
                loading={loading}
              />

                   {formData.service_id &&
                (config.showAmountGrid || formData.variation) && (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">
                      {config.customerLabel}
                    </label>

                    <div className="w-full flex gap-3 items-center">
                      <div className="p-4 my-3 rounded-full bg-card">+234</div>
                      <TextInput
                        value={formData.customer_id}
                        onChange={(customer_id) =>
                          setFormData((prev) => ({ ...prev, customer_id }))
                        }
                        placeholder={config.placeholder}
                        type="tel"
                      />
                    </div>
                  </div>
                )}


              {config.showVariations && formData.service_id && (
                <VariationSelect
                  variations={variations}
                  value={formData.variation}
                  onSelect={(variation) =>
                    setFormData((prev) => ({
                      ...prev,
                      variation,
                      amount: variation.variation_amount,
                    }))
                  }
                  type={type}
                  loading={loading}
                />
              )}

              {config.showAmountGrid && formData.service_id && (
                <AmountGrid
                  value={formData.amount}
                  onChange={(amount) =>
                    setFormData((prev) => ({ ...prev, amount }))
                  }
                  presetAmounts={presetAmounts}
                  minAmount={providers.find(p => p.serviceID === formData.service_id)?.minimium_amount}
                  maxAmount={providers.find(p => p.serviceID === formData.service_id)?.maximum_amount}
                />
              )}

         
              <Button
                onclick={handleNext}
                type="secondary"
                text="Continue"
                width="w-full py-4"
                disabled={!isStep1Valid()}
                loading={loading}
              />
            </div>
          </motion.div>
        );

 case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 w-full h-full flex flex-col justify-end"
          >
            <div className="w-full bg-card py-5 rounded-t-3xl">
              <div className="space-y-1">
                <h2 className="text-xl font-black w-full text-center">
                  Summary
                </h2>
              </div>

              <div className="w-full rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center max-w-md mx-auto">
                  <span className="text-xl font-black w-full">
                    ₦{parseInt(formData.amount || "0").toLocaleString()}
                  </span>
                  <Image
                    src={"/svg/leftRight.svg"}
                    alt="swap arrow"
                    width={30}
                    height={30}
                    className=""
                  />
                  <span className="font-black w-full">
                    {formData.variation?.name || "Custom Amount"}
                  </span>
                </div>

                <div className="space-y-3">
                  <ReviewItem label="Product" value={type.toUpperCase()} />
                  <ReviewItem
                    label={type === "tv" ? "Provider" : "Network"}
                    value={
                      providers.find(
                        (p) => p.serviceID === formData.service_id
                      )?.name || ""
                    }
                  />
                  <ReviewItem
                    label={config.customerLabel}
                    value={formData.customer_id}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onclick={handleBack}
                  type="primary"
                  text="Back"
                  width="flex-1 py-4"
                />
                <Button
                  onclick={handleNext}
                  type="secondary"
                  text="Confirm & Pay"
                  width="flex-1 py-4"
                />
              </div>
            </div>
          </motion.div>
        );


      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black">Enter Your PIN</h2>
              <p className="text-lg">
                To complete this transaction, please enter your 4-digit PIN
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  animate={{ scale: digit ? 1.1 : 1 }}
                  className={`w-15 h-15 rounded-full flex items-center justify-center text-xl font-semibold ${
                    showOTPFull
                      ? ""
                      : digit
                      ? "primary-purple-to-blue"
                      : "bg-card"
                  }`}
                >
                  {showOTPFull ? digit || "" : digit ? "•" : ""}
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => !showOTPFull}
              className="flex items-center justify-center gap-2 mx-auto mb-6 text-sm hover:text-stone-800"
            >
              {showOTPFull ? <EyeOff size={18} /> : <Eye size={18} />}
              {showOTPFull ? "Hide" : "Show"} PIN
            </button>

            <Keypad
              numbers={[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "✓",
                "0",
                "←",
              ]}
              onNumberClick={handleNumberClick}
              onDelete={() => handleNumberClick("←")}
              onConfirm={() => handleNumberClick("✓")}
              disableConfirm={!otp.every((d) => d)}
              loading={loading}
            />
          </motion.div>
        );

   case 4:
        return (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 text-center py-5 bg-card rounded-2xl px-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 primary-purple-to-blue rounded-full flex items-center justify-center mx-auto"
              >
                {success ? (
                  <Check size={40} className="" />
                ) : (
                  <X size={40} className="" />
                )}
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black">
                  {success ? "Transaction Successful" : "Transaction Failed"}
                </h2>
                <p className="text-lg">
                  {success
                    ? "Your transaction has been processed successfully"
                    : "Something went wrong. Please try again."}
                </p>
                <div className="flex flex-col gap-2">
                  <span>Amount Sent</span>
                  <span className="font-black text-2xl">
                    ₦{parseInt(formData.amount).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-4 my-5 max-w-sm mx-auto">
                  <h5 className="text-center text-sm">Beneficiary</h5>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Image
                        src={formData.transactionData?.providerLogo || ""}
                        alt="service provider"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>{formData.customer_id}</div>
                    </div>
                    <ArrowRight size={24} className="placeholder-text" />
                  </div>
                </div>
              </div>

              {success && formData.transactionData && (
                <div className="w-full rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Date & Time</span>
                    <span className="font-medium">
                      {formData.transactionData.dateTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment method</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.transactionId}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
            <div className="w-full flex gap-6">
              <button className="w-full py-4 px-5 rounded-full bg-card">
                Share as image
              </button>
              <button className="w-full py-4 px-5 rounded-full bg-card">
                Share as PDF
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full mx-auto max-w-xl flex flex-col">
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}

// Sub-components
interface ProviderSelectProps {
  providers: Provider[];
  value: string;
  onChange: (service_id: string) => void;
  loading?: boolean;
}

function ProviderSelect({ providers, value, onChange, loading }: ProviderSelectProps) {

    const getProviderImage = (provider: Provider) => {
    const imageMap: { [key: string]: string } = {
      'mtn': '/img/mtn.png',
      'airtel': '/img/airtel.png',
      'glo': '/img/glo.png',
      'etisalat': '/img/9mobile.png',
      '9mobile': '/img/9mobile.png',
      'foreign-airtime': '/img/international.png',
      'dstv': '/img/dstv.png',
      'gotv': '/img/gotv.png',
      'startimes': '/img/startimes.png',
      'showmax': '/img/showmax.png',
      'airtel-data': '/img/airtel.png',
      'mtn-data': '/img/mtn.png',
      'glo-data': '/img/glo.png',
      'etisalat-data': '/img/9mobile.png',
      'smile-direct': '/img/smile.png',
      'spectranet': '/img/spectranet.png',
      'glo-sme-data': '/img/glo.png',
    };
    
    return imageMap[provider.serviceID] || '/img/placeholder.png';
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-0.5 bg-card animate-pulse">
              <div className="flex flex-col items-center w-full rounded-2xl overflow-hidden bg-card h-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.serviceID}
            className={` rounded-2xl p-0.5 ${
              value === provider.serviceID
                ? "primary-purple-to-blue"
                : "bg-card"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(provider.serviceID)}
              className={`flex flex-col items-center w-full rounded-2xl overflow-hidden transition-all bg-card`}
            >
              <div className="w-full h-auto  mb-2 flex items-center justify-center">
                <div className="w-full h-20 relative">
                  <Image
                    src={getProviderImage(provider)}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/placeholder.png";
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium py-1 text-center">
                {provider.name}
              </span>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface VariationSelectProps {
  variations: Variation[];
  value: Variation | null;
  onSelect: (variation: Variation) => void;
  type: PurchaseType;
  loading?: boolean;
}

function VariationSelect({
  variations,
  value,
  onSelect,
  type,
  loading
}: VariationSelectProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <label className="text-sm font-semibold">
          Select {type === "tv" ? "Package" : "Data Plan"}
        </label>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-0.5 bg-card animate-pulse">
              <div className="w-full p-4 rounded-2xl bg-card h-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full ">
      <label className="text-sm font-semibold">
        Select {type === "tv" ? "Package" : "Data Plan"}
      </label>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 max-h-100 overflow-y-scroll">
        {variations.map((variation) => (
          <div
            key={variation.variation_code}
            className={` rounded-2xl p-0.5 ${
              value?.variation_code === variation.variation_code
                ? "primary-purple-to-blue"
                : "bg-card"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(variation)}
              className={`w-full text-sm p-4 rounded-2xl text-left transition-all bg-card
            `}
            >
              <div className="flex flex-col  justify-between items-center">
                <div>
                  <h4 className="font-black text-center">
                    {variation.name}
                  </h4>
                  {/* <p className="text-sm text-center">
                    {type === "tv" ? "Package" : "Data Plan"}
                  </p> */}
                </div>
                {/* <span className="text-center text-sm">
                  ₦{parseFloat(variation.variation_amount).toLocaleString()}
                </span> */}
              </div>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AmountGridProps {
  value: string;
  onChange: (value: string) => void;
  presetAmounts: number[];
  minAmount?: string;
  maxAmount?: string;
}

function AmountGrid({ value, onChange, presetAmounts, minAmount, maxAmount }: AmountGridProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold">Amount</label>
      <div className="grid grid-cols-3 gap-3">
        {presetAmounts.map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(amount.toString())}
            className={`p-4 rounded-2xl transition-all ${
              value === amount.toString()
                ? "bg-primary/10 font-black"
                : "bg-card"
            }`}
          >
            ₦{amount.toLocaleString()}
          </motion.button>
        ))}
      </div>

      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Custom amount"
        type="number"
        currency="₦"
        // min={minAmount}
        // max={maxAmount}
      />
      
      {(minAmount || maxAmount) && (
        <p className="text-xs text-zinc-500">
          Amount range: ₦{parseFloat(minAmount || "0").toLocaleString()} - ₦{parseFloat(maxAmount || "0").toLocaleString()}
        </p>
      )}
    </div>
  );
}




function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 last:border-b-0">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

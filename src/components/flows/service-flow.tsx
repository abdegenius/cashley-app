"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ApiResponse, Transaction, User } from "@/types/api";
import toast from "react-hot-toast";
import { formatToNGN } from "@/utils/amount";
import { EnterPin } from "../EnterPin";
import { cleanServiceName, pinExtractor, purchaseable_services } from "@/utils/string";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../Loading";
import { Check, X } from "lucide-react";

type PurchaseType = "airtime" | "data" | "tv" | "electricity";

interface PurchaseProps {
  type: PurchaseType;
  user?: User | null;
}

type Provider = {
  service_id: string;
  name: string;
  logo: string;
  minimum_amount: string;
  maximum_amount: string;
  type: string;
};

type Variation = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixed_price: string;
  service_id?: string;
};


export default function Purchase({ type, user }: PurchaseProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyData, setVerifyData] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [formData, setFormData] = useState({
    service_id: "",
    amount: "",
    customer_id: "",
    variation: null as Variation | null,
    type: ""
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const presetAmounts = [100, 200, 500, 1000, 2000, 5000];

  const config = purchaseable_services[type];

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(
        `/bill/service?service=${config.api_key}`
      );
      if (!response.data.error) {
        const providersData: Provider[] = response.data.data.map((provider: any) => ({
          service_id: provider.serviceID,
          name: cleanServiceName(provider.name),
          logo: provider.image,
          minimum_amount: provider.minimium_amount,
          maximum_amount: provider.maximum_amount,
          type: provider.product_type
        }));
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

  const fetchVariations = async (service_id: string) => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(
        `/bill/service-variations?service_id=${service_id}`
      );

      if (!response.data.error && response.data.data.variations) {
        const variationsData: Variation[] = response.data.data.variations.map((variation: any) => ({
          variation_code: variation.variation_code,
          name: variation.name,
          variation_amount: variation.variation_amount,
          fixed_price: variation.fixedPrice,
          service_id: service_id
        }));
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

  const handlePrev = () => {
    if (step === 1) window.history.back();
    else setStep((prev) => prev - 1);
  };


  const handlePartialReset = () => {
    setStep(1);
    setOtp(["", "", "", ""]);
    setFormData({
      service_id: formData.service_id,
      amount: formData.amount,
      customer_id: formData.customer_id,
      variation: null,
      type: ""
    });
    setVariations([])
    setVerifyData(null)
    setVerifying(false)
    setPurchasing(false)
  };

  const handleReset = () => {
    setStep(1);
    setOtp(["", "", "", ""]);
    setSuccess(false);
    setFormData({
      service_id: "",
      amount: "",
      customer_id: "",
      variation: null,
      type: ""
    });
    setVariations([])
    setTransaction(null)
    setVerifyData(null)
    setVerifying(false)
    setLoading(false)
    setPurchasing(false)
  };


  const handleNext = () => setStep((prev) => prev + 1);

  const handleSubmit = async () => {
    setPurchasing(true);
    setStep(1);
    try {
      let payload = {
        service_id: formData.service_id, pin: pinExtractor(otp), amount: formData.amount,
        ...(formData.customer_id) && { phone: ["airtime", "data"].includes(type) ? formData.customer_id : (user?.phone ?? null) },
        ...(["betting", "tv", "data"].includes(type) && formData.variation) && { variation_code: formData.variation.variation_code.toString() },
        ...(["betting", "tv", "electricity"].includes(type) && formData.customer_id) && { customer_id: formData.customer_id },
        ...(["tv"].includes(type) && formData.type) && { type: formData.type },
        ...(["electricity"].includes(type) && formData.type) && { variation_code: formData.type },
        ...(verifyData) && { verify_data: verifyData }
      }
      const url = `/transactions/buy-${type}`;
      const res = await api.post<ApiResponse<Transaction | null>>(url, payload);
      if (res.data.error) {
        setSuccess(false)
        toast.error(res.data.message ?? "Transaction failed")
      } else {
        setSuccess(true)
        setTransaction(res.data.data)
        toast.success("Transaction successful");
      }
    } catch (err) {
      toast.error("An error was encountered while processing your request, please try again.")
    } finally {
      handlePartialReset()
    }
  }

  const handleVerifyCustomer = async () => {
    setVerifying(true);
    try {
      let payload = {
        service_id: formData.service_id,
        number: formData.customer_id,
        type: type === "electricity" ? formData.type : formData.variation?.variation_code,
      }
      const url = "/bill/verify";
      const res = await api.post<ApiResponse>(url, payload);
      if (res.data.error) {
        toast.error("Verification failed")
      } else {
        toast.success("Verification successful");
      }
      setVerifyData(res.data.data ?? null);
    } catch (err) {
    } finally {
      setVerifying(false)
    }
  }

  const isStep1Valid = () => {
    const baseCheck = !!formData.service_id;
    const amount = Number(formData.amount);
    if (amount <= 0 || amount > Number(user?.ngn_balance)) {
      return false;
    }
    switch (type) {
      case "airtime":
        return baseCheck && !!formData.customer_id && amount >= 10;
      case "data":
        return baseCheck && !!formData.customer_id && !!formData.variation && amount > 0;
      case "tv":
        return (
          baseCheck &&
          !!formData.customer_id &&
          !!formData.variation &&
          !!formData.type &&
          verifyData &&
          amount > 0
        );
      case "electricity":
        return (
          baseCheck &&
          !!formData.customer_id &&
          !!formData.type &&
          verifyData &&
          amount > 1000
        );
      default:
        return false;
    }
  };


  useEffect(() => {
    if (!formData.service_id) return;

    if (typeof formData.service_id !== 'string' || formData.service_id.trim() === '') {
      console.error('Invalid service_id format:', formData.service_id);
      return;
    }

    if (config.show_variations) {
      fetchVariations(formData.service_id);
    }
  }, [formData.service_id, type, config.show_variations]);

  // Fetch providers on mount
  useEffect(() => {
    fetchProviders();
  }, [type]);

  useEffect(() => {
    if (!formData.service_id) return;

    if (config.show_variations) {
      fetchVariations(formData.service_id);
    }
  }, [formData.service_id, type, config.show_variations]);

  return (
    <div className="w-full h-full mx-auto max-w-xl flex flex-col px-4">
      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-2 z-0"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-black">{config.step_1_title}</h2>
            </div>

            <div className="space-y-6">
              <ProviderSelect
                providers={providers}
                value={formData.service_id}
                onChange={(service_id) =>
                  setFormData((prev) => ({ ...prev, service_id: formData.service_id === service_id ? "" : service_id }))
                }
                loading={loading}
              />

              {formData.service_id &&
                (config.show_amount_grid || formData.variation) && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold pb-0">
                      {config.recipient}
                    </label>

                    <div className="w-full flex gap-3 items-center">
                      <div className="p-4 my-3 rounded-full bg-card">+234</div>
                      <TextInput
                        value={formData.customer_id}
                        onChange={(customer_id) =>
                          setFormData((prev) => ({ ...prev, customer_id }))
                        }
                        placeholder={config.placeholder}
                        type="text"
                        minLength="10"
                        maxLength="10"
                      />
                    </div>
                  </div>
                )}


              {config.show_variations && formData.service_id && (
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

              {config.show_amount_grid && formData.service_id && (
                <AmountGrid
                  value={formData.amount}
                  onChange={(amount) =>
                    setFormData((prev) => ({ ...prev, amount }))
                  }
                  presetAmounts={presetAmounts}
                  minAmount={providers.find(p => p.service_id === formData.service_id)?.minimum_amount}
                  maxAmount={providers.find(p => p.service_id === formData.service_id)?.maximum_amount}
                />
              )}

            </div>

            <Button
              onclick={handleNext}
              type="secondary"
              text="Continue"
              width="w-full py-4"
              disabled={!isStep1Valid()}
              loading={loading}
            />
          </motion.div>
        </AnimatePresence>
        {step == 2 &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-1 fixed max-w-xl inset-0 mx-auto space-y-8 w-full h-full"
          >
            <div className="z-1 inset-0 relative w-full h-full backdrop-blur-sm bg-zinc-900/10" />
            <div className="bottom-0 absolute z-2 w-full h-auto flex flex-col justify-end items-end">
              <div className="w-full bg-card py-5 rounded-t-3xl">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black w-full text-center">
                    Summary
                  </h2>
                </div>

                <div className="w-full rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-xl font-black w-full justify-start flex">
                      Amount
                    </div>
                    <Image
                      src={"/svg/leftRight.svg"}
                      alt="swap arrow"
                      width={60}
                      height={60}
                      className="justify-center flex"
                    />
                    <div className="text-xl font-black w-full justify-end flex">
                      {formatToNGN(Number(formData.amount))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ReviewItem label="Product" value={type.toUpperCase()} />
                    <ReviewItem
                      label={type === "tv" ? "Provider" : "Network"}
                      value={
                        providers.find(
                          (p) => p.service_id === formData.service_id
                        )?.name || ""
                      }
                    />
                    <ReviewItem
                      label={config.recipient}
                      value={formData.customer_id}
                    />
                  </div>
                </div>

                <div className="flex gap-x-4 px-5">
                  <Button
                    onclick={handlePrev}
                    type="dark"
                    text="Cancel"
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
            </div>
          </motion.div>}
        {step == 3 &&
          <EnterPin
            otp={otp}
            show={true}
            setOtp={setOtp}
            headerText={"Enter your 4-digit transaction pin"}
            buttonText={"Pay"}
            onConfirm={handleSubmit}
            onBack={handlePrev}
          />}
        {success && transaction && (
          <div className="fixed z-5 inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center max-w-xl mx-auto p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 text-center py-4 bg-card rounded-2xl px-4"
            >

              <div className="w-full flex p-2 items-end justify-end">
                <button onClick={handleReset} className="text-lg font-medium text-red-400">
                  Close
                </button>
              </div>
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

              <div className="space-y-0">
                <h2 className="text-xl text-stone-400 font-black">
                  {success ? "Transaction Successful" : "Transaction Failed"}
                </h2>
                <p className="text-sm text-stone-200">
                  {success
                    ? "Your transaction has been processed successfully"
                    : "Something went wrong. Please try again."}
                </p>
                <div className="flex flex-col gap-0 pt-2">
                  <span className="font-black purple-text text-4xl">
                    {formatToNGN(Number(transaction.amount))}
                  </span>
                  <span className="text-stone-400 text-sm">Amount</span>
                </div>
              </div>

              <div className="w-full rounded-2xl p-2 space-y-2">
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Recipient</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {formData.customer_id}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Service</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.action}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Status</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.status}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Amount</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {formatToNGN(Number(transaction.amount))}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Date</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.created_at}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Reference</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.reference}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Session ID</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.session_id ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between items-start space-x-4">
                  <span className="text-stone-400 text-sm">Description</span>
                  <span className="font-mono text-sm text-right text-stone-200">
                    {transaction.description}
                  </span>
                </div>
              </div>
            </motion.div>
            <div className="my-6 w-full flex gap-4 px-4">
              <button className="w-full p-4 rounded-full bg-card">
                Share as image
              </button>
              <button className="w-full p-4 rounded-full bg-card">
                Share as PDF
              </button>
            </div>
          </div>
        )}
        {(purchasing || verifying) && <LoadingOverlay />}
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

    return imageMap[provider.service_id] || '/img/placeholder.png';
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="w-full overflow-x-auto flex flex-row items-stretch justify-start space-x-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full max-w-[100px] min-w-[100px] rounded-2xl p-0.5 bg-card animate-pulse">
              <div className="flex flex-col items-center w-full rounded-2xl overflow-hidden bg-card h-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto flex flex-row items-stretch justify-start space-x-2">
        {providers.map((provider, i) => (
          <div
            key={i}
            className={`w-full max-w-[100px] min-w-[100px] rounded-2xl p-0.5 ${value === provider.service_id
              ? "primary-purple-to-blue"
              : "bg-card"
              } ${value && value !== provider.service_id ? 'opacity-50' : 'opacity-100'}`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(provider.service_id)}
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
        {variations.map((variation, i) => (
          <div
            key={i}
            className={` rounded-2xl p-0.5 ${value?.variation_code === variation.variation_code
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
    <div className="space-y-1">
      <label className="text-sm font-semibold">Amount</label>
      <div className="flex flex-row items-center justify-start space-x-2 overflow-x-auto mb-4">
        {presetAmounts.map((amount, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(amount.toString())}
            className={`w-[90px] sm:w-[120px] p-2.5 text-sm rounded-2xl transition-all bg-card border-2 ${value === amount.toString()
              ? "border-purple-600"
              : "border-transparent"
              }`}
          >
            {formatToNGN(Number(amount), false)}
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
          Amount range:
          {formatToNGN(Number(minAmount))}
          {" - "}
          {formatToNGN(Number(maxAmount))}
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

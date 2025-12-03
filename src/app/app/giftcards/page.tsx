"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Eye, EyeOff, ArrowRight, Search, Upload } from "lucide-react";
import api from "@/lib/axios";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { Keypad } from "@/components/modals/Keypad";

interface Country {
  country: string;
  flag: string;
}

type GiftCard = {
  id: number;
  name: string;
  reference: string;
  slug: string;
  logo: string;
  currency: string;
  min_face_value: string;
  max_face_value: string;
  ngn_rate: string;
  instruction: string | null;
  extra: {};
  countries: Country[];
};

type TransactionData = {
  dateTime: string;
  paymentMethod: string;
  status: string;
  description: string;
  transactionId: string;
  providerLogo: string;
  providerName: string;
  planName: string;
  voucherCode?: string;
  country?: string;
  currency?: string;
  received?: string;
};

type FormDataType = {
  service_id: string;
  selectedVariant: GiftCard | null;
  amount: string;
  voucher: string;
  uploadedImage: File | null;
  imagePreview: string | null;
  transactionData: TransactionData | null;
};

export default function GiftCard() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showOTPFull, setShowOTPFull] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [giftcards, setGiftcards] = useState<GiftCard[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<GiftCard[]>([]);
  const [providers, setProviders] = useState<GiftCard[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    service_id: "",
    selectedVariant: null,
    amount: "",
    voucher: "",
    uploadedImage: null,
    imagePreview: null,
    transactionData: null,
  });

  // Fetch gift cards
  useEffect(() => {
    const fetchGiftcards = async () => {
      try {
        const res = await api.get("/giftcards");
        const data: GiftCard[] = res.data.data;
        setGiftcards(data);

        const uniqueMap = new Map<string, GiftCard>();
        data.forEach((item) => {
          if (!uniqueMap.has(item.slug)) {
            uniqueMap.set(item.slug, { ...item, logo: `/img/giftcard/${item.logo}` });
          }
        });

        const uniqueProviders = Array.from(uniqueMap.values());
        setProviders(uniqueProviders);
        setFilteredProviders(uniqueProviders);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGiftcards();
  }, []);

  // Filter providers
  useEffect(() => {
    if (!giftcards) return;
    const query = searchQuery.toLowerCase();
    const filtered = giftcards
      .filter((item) => item.name.toLowerCase().includes(query))
      .reduce((acc: GiftCard[], item) => {
        if (!acc.find((p) => p.slug === item.slug)) {
          acc.push({ ...item, logo: `/img/giftcard/${item.logo}` });
        }
        return acc;
      }, []);
    setFilteredProviders(filtered);
  }, [searchQuery, giftcards]);

  // Handlers
  const handleProviderSelect = (provider: GiftCard) => {
    setFormData((prev) => ({ ...prev, service_id: provider.slug }));
    setStep(2);
  };

  const handleVariantSelect = (variant: GiftCard) => {
    setFormData((prev) => ({
      ...prev,
      selectedVariant: variant,
      amount: variant.min_face_value,
    }));
  };

  const handleAmountChange = (value: string) => setFormData((prev) => ({ ...prev, amount: value }));
  const handleVoucherChange = (value: string) => setFormData((prev) => ({ ...prev, voucher: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        uploadedImage: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleBack = () => {
    if (step === 1) return window.history.back();
    if (step === 2) setFormData((prev) => ({ ...prev, selectedVariant: null, amount: "", voucher: "", uploadedImage: null, imagePreview: null }));
    if (step === 3) setOtp(["", "", "", ""]);
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step === 2) {
      const amountNum = parseFloat(formData.amount);
      const variant = formData.selectedVariant;
      if (!variant) return;
      const min = parseFloat(variant.min_face_value);
      const max = parseFloat(variant.max_face_value);
      if (amountNum < min || amountNum > max || !formData.voucher || !formData.uploadedImage) return;
    }
    setStep((prev) => prev + 1);
  };

  const handleNumberClick = (num: string) => {
    if (num === "←") {
      const last = otp.reduce((acc, val, idx) => (val ? idx : acc), -1);
      if (last >= 0) {
        const newOtp = [...otp];
        newOtp[last] = "";
        setOtp(newOtp);
      }
    } else if (num === "✓") {
      if (otp.every((d) => d)) handleSubmit();
    } else {
      const emptyIndex = otp.findIndex((d) => !d);
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
      await new Promise((res) => setTimeout(res, 2000));

      const variant = formData.selectedVariant;
      if (!variant) return;

      const amountNum = parseFloat(formData.amount);
      const rate = parseFloat(variant.ngn_rate);
      const received = Math.round(amountNum * rate).toString();

      const firstCountry = variant.countries[0];

      const transactionData: TransactionData = {
        dateTime: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" }),
        paymentMethod: "Cashley",
        status: "Completed",
        description: "Sell Gift Card",
        transactionId: `TRX${Date.now()}`,
        providerLogo: `/img/giftcard/${variant.logo}`,
        providerName: variant.name,
        planName: `${variant.currency} ${formData.amount}`,
        voucherCode: formData.voucher,
        country: firstCountry.country,
        currency: variant.currency,
        received,
      };

      setSuccess(true);
      setFormData((prev) => ({ ...prev, transactionData }));
      setStep(5);
    } catch {
      setSuccess(false);
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.service_id;
      case 2: {
        const variant = formData.selectedVariant;
        if (!variant) return false;
        const amountNum = parseFloat(formData.amount);
        const min = parseFloat(variant.min_face_value);
        const max = parseFloat(variant.max_face_value);
        return amountNum >= min && amountNum <= max && !!formData.voucher && !!formData.uploadedImage;
      }
      case 3: return true;
      case 4: return otp.every((d) => d);
      default: return false;
    }
  };

  // Render Steps
  const renderStep = () => {
    switch (step) {
      case 1: return <StepOne providers={filteredProviders} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedServiceId={formData.service_id} onSelect={handleProviderSelect} />;
      case 2: return <StepTwo formData={formData} variants={giftcards.filter((g) => g.slug === formData.service_id)} handleVariantSelect={handleVariantSelect} handleAmountChange={handleAmountChange} handleVoucherChange={handleVoucherChange} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} onNext={handleNext} isStepValid={isStepValid} />;
      case 3: return <StepThree formData={formData} providers={providers} onNext={handleNext} onBack={handleBack} />;
      case 4: return <StepFour otp={otp} showOTPFull={showOTPFull} setShowOTPFull={setShowOTPFull} handleNumberClick={handleNumberClick} loading={loading} />;
      case 5: return <StepFive transactionData={formData.transactionData} success={success} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full mx-auto max-w-xl flex flex-col">
      {step > 1 && (
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="p-2 hover:bg-card rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}

/** ---------- Sub-components ---------- **/

function StepOne({ providers, searchQuery, setSearchQuery, selectedServiceId, onSelect }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-stone-400">Select Gift Card</h2>
        <p className="text-stone-200">Pick a gift card to sell quickly and safely</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
        <TextInput value={searchQuery} onChange={setSearchQuery} placeholder="Search gift cards..." type="text" className="pl-12 rounded-xl border border-stone-200 shadow-sm outline-none" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {providers.map((p: GiftCard) => (
          <GiftCardItem key={p.reference} provider={p} selected={selectedServiceId === p.slug} onClick={() => onSelect(p)} />
        ))}
      </div>
    </motion.div>
  );
}

function GiftCardItem({ provider, selected, onClick }: any) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`flex flex-col items-center bg-transparent rounded-2xl shadow hover:shadow-lg overflow-hidden transition-all border-2 ${selected ? "border-stone-600" : "border-stone-800"}`}>
      <div className="w-full h-24 relative rounded-xl bg-white p-0">
        <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
      </div>
      <span className="text-md font-medium py-2 text-center text-stone-200">{provider.name}</span>
    </motion.button>
  );
}

/** Additional Steps (StepTwo, StepThree, StepFour, StepFive) would follow a similar modular pattern **/
/** ---------- Step 2: Select Variant & Enter Details ---------- **/
function StepTwo({
  formData,
  variants,
  handleVariantSelect,
  handleAmountChange,
  handleVoucherChange,
  handleImageUpload,
  fileInputRef,
  onNext,
  isStepValid,
}: any) {
  const selectedVariant = formData.selectedVariant;
  const rate = selectedVariant ? parseFloat(selectedVariant.ngn_rate) : 0;
  const min = selectedVariant ? parseFloat(selectedVariant.min_face_value) : 0;
  const max = selectedVariant ? parseFloat(selectedVariant.max_face_value) : 0;
  const estimated = formData.amount ? (parseFloat(formData.amount) * rate).toFixed(0) : "0";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-stone-400">Enter Gift Card Details</h2>
        <p className="text-stone-200">Select a variant, enter amount, voucher code & upload proof</p>
      </div>

      {variants[0] && (
        <div className="w-full h-40 relative rounded-2xl overflow-hidden shadow">
          <Image src={`/img/giftcard/${variants[0].logo}`} alt={variants[0].name} fill className="object-contain rounded-xl" />
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 items-center gap-2">
        {variants.map((variant: GiftCard) => {
          const firstCountry = variant.countries[0];
          const isSelected = selectedVariant?.id === variant.id;
          return (
            <motion.button
              key={variant.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVariantSelect(variant)}
              className={`rounded-2xl p-2 text-center border transition ${isSelected ? "border-stone-600 bg-card" : "border-stone-800 bg-transparent"}`}
            >
              <div className="text-2xl mb-0">{firstCountry.flag}</div>
              <span className="text-xs font-medium">{variant.currency}</span>
            </motion.button>
          );
        })}
      </div>

      {selectedVariant && (
        <div className="space-y-4">
          {/* Min/Max & Buy Rate */}
          <div className="bg-stone-950/50 rounded-2xl p-4 space-y-2 shadow-inner">
            <div className="flex justify-between">
              <span>Min/Max Value:</span>
              <span>{min} - {max} {selectedVariant.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>Countries:</span>
              <div className="flex gap-1">{selectedVariant.countries.map((c: any, i: number) => <span key={i}>{c.flag}</span>)}</div>
            </div>
            <div className="flex justify-between">
              <span>Buy Rate:</span>
              <span>1 {selectedVariant.currency} = ₦{rate.toLocaleString()}</span>
            </div>
          </div>

          {/* Inputs */}
          <TextInput
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder={`Enter amount (${min}-${max} ${selectedVariant.currency})`}
            type="number"
          />
          <TextInput
            value={formData.voucher}
            onChange={handleVoucherChange}
            placeholder="Enter voucher code"
            type="text"
          />

          {/* Upload Proof */}
          <label className="w-full justify-center py-3 flex items-center gap-2 text-lg cursor-pointer text-stone-200 hover:text-stone-400">
            <Upload size={20} /> Upload Proof
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {formData.imagePreview && (
            <div className="mt-2 w-28 h-28 relative rounded overflow-hidden">
              <Image src={formData.imagePreview} alt="Proof" fill className="object-cover" />
            </div>
          )}

          {/* Estimated Receive */}
          {formData.amount && (
            <div className="bg-card rounded p-3 text-center font-semibold">
              You will receive: ₦{parseInt(estimated).toLocaleString()}
            </div>
          )}

          <Button onclick={onNext} type="secondary" text="Continue" width="w-full py-4" disabled={!isStepValid()} />
        </div>
      )}
    </motion.div>
  );
}

/** ---------- Step 3: Summary ---------- **/
function StepThree({ formData, providers, onNext, onBack }: any) {
  const variant = formData.selectedVariant;
  const provider = providers.find((p: GiftCard) => p.slug === formData.service_id);
  const received = parseInt(formData.transactionData?.received || "0").toLocaleString();
  const firstCountry = variant?.countries[0]?.country || "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-transparent rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Summary</h2>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>{variant?.currency} {formData.amount}</span>
          <ArrowRight size={24} />
          <span>₦{received}</span>
        </div>
        <ReviewItem label="Product" value="Sell Gift Card" />
        <ReviewItem label="Brand" value={provider?.name || variant?.name || ""} />
        <ReviewItem label="Country" value={firstCountry} />
        <ReviewItem label="Amount" value={`${variant?.currency} ${formData.amount}`} />
        <ReviewItem label="Voucher" value={formData.voucher} />
        <ReviewItem label="Receive" value={`₦${received}`} />
      </div>
      <div className="flex gap-4">
        <Button onclick={onBack} type="primary" text="Back" width="flex-1 py-4" />
        <Button onclick={onNext} type="secondary" text="Confirm & Pay" width="flex-1 py-4" />
      </div>
    </motion.div>
  );
}

/** ---------- Step 4: Enter OTP ---------- **/
function StepFour({ otp, showOTPFull, setShowOTPFull, handleNumberClick, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold">Enter Your PIN</h2>
        <p className="text-stone-500">To complete this transaction, enter your 4-digit PIN</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {otp.map((digit: string, i: number) => (
          <motion.div
            key={i}
            animate={{ scale: digit ? 1.1 : 1 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold ${showOTPFull ? "" : digit ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : "bg-stone-100"}`}
          >
            {showOTPFull ? digit || "" : digit ? "•" : ""}
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => setShowOTPFull(!showOTPFull)}
        className="flex items-center justify-center gap-2 mx-auto mb-6 text-sm text-stone-700 hover:text-stone-900"
      >
        {showOTPFull ? <EyeOff size={18} /> : <Eye size={18} />} {showOTPFull ? "Hide" : "Show"} PIN
      </button>

      <Keypad disableConfirm={false} onConfirm={() => null} onDelete={() => null} numbers={["1", "2", "3", "4", "5", "6", "7", "8", "9", "✓", "0", "←"]} onNumberClick={handleNumberClick} loading={loading} />
    </motion.div>
  );
}

/** ---------- Step 5: Transaction Result ---------- **/
function StepFive({ transactionData, success }: any) {
  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center bg-transparent rounded-2xl shadow p-6">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
          {success ? <Check size={40} className="text-white" /> : <X size={40} className="text-white" />}
        </div>
        <h2 className="text-3xl font-bold">{success ? "Transaction Successful" : "Transaction Failed"}</h2>
        <p className="text-stone-500">{success ? "Gift card sold successfully" : "Something went wrong. Please try again."}</p>
        {transactionData && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Amount Received</h3>
            <span className="text-2xl font-bold">₦{parseInt(transactionData.received || "0").toLocaleString()}</span>
          </div>
        )}
      </motion.div>
      <div className="flex gap-4">
        <button className="w-full py-4 px-5 rounded-full bg-stone-100">Share as Image</button>
        <button className="w-full py-4 px-5 rounded-full bg-stone-100">Share as PDF</button>
      </div>
    </div>
  );
}

/** ---------- Review Item ---------- **/
function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-stone-200">
      <span className="text-stone-700">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

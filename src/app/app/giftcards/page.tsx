"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, ArrowRight, Search, Upload, Circle, ListFilter } from "lucide-react";
import api from "@/lib/axios";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { ApiResponse, Giftcard } from "@/types/api";
import toast from "react-hot-toast";
import { formatToNGN } from "@/utils/amount";
import { EnterPin } from "@/components/EnterPin";
import { LoadingOverlay } from "@/components/Loading";
import Link from "next/link";


type FormDataType = {
  service_id: string;
  selectedVariant: Giftcard | null;
  amount: string;
  voucher: string;
  proof: string | null;
};

export default function GiftcardPage() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [giftcards, setGiftcards] = useState<Giftcard[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Giftcard[]>([]);
  const [providers, setProviders] = useState<Giftcard[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultFormData = {
    service_id: "",
    selectedVariant: null,
    amount: "",
    voucher: "",
    proof: null,
  }

  const [formData, setFormData] = useState<FormDataType>(defaultFormData);

  // Fetch gift cards
  useEffect(() => {
    const fetchGiftcards = async () => {
      try {
        const res = await api.get("/giftcards");
        const data: Giftcard[] = res.data.data;
        setGiftcards(data);

        const uniqueMap = new Map<string, Giftcard>();
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
      .reduce((acc: Giftcard[], item) => {
        if (!acc.find((p) => p.slug === item.slug)) {
          acc.push({ ...item, logo: `/img/giftcard/${item.logo}` });
        }
        return acc;
      }, []);
    setFilteredProviders(filtered);
  }, [searchQuery, giftcards]);

  // Handlers
  const handleProviderSelect = (provider: Giftcard) => {
    setFormData((prev) => ({ ...prev, service_id: provider.slug }));
    setStep(2);
  };

  const handleVariantSelect = (variant: Giftcard) => {
    setFormData((prev) => ({
      ...prev,
      selectedVariant: variant,
      amount: variant.min_face_value,
    }));
  };

  const handleAmountChange = (value: string) => setFormData((prev) => ({ ...prev, amount: value }));
  const handleVoucherChange = (value: string) => setFormData((prev) => ({ ...prev, voucher: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post<ApiResponse>(
        "/upload-file",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.error) {
        toast.error(res.data.message || "Failed to upload proof");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        proof: res.data.data,
      }));

    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Something went wrong during upload");
    } finally {
      setUploading(false)
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
      if (amountNum < min || amountNum > max || !formData.voucher || !formData.proof) return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {

      const variant = formData.selectedVariant;
      if (!variant) return;

      const firstCountry = variant.countries[0];

      const payload = {
        value: formData.amount,
        voucher: formData.voucher,
        country: firstCountry.country,
        proof: formData.proof
      }

      const res = await api.post<ApiResponse>(`/giftcard-transactions/${variant.reference}`, payload)
      if (res.data.error) {
        setSuccess(false);
        setStep(3);
        toast.error(res.data.message)
      } else {
        setSuccess(true);
        setStep(1);
        setFormData(defaultFormData);
        toast.success(res.data.message)
      }
    } catch {
      toast.error("An error was encountered, please try again!")
      setSuccess(false);
      setStep(3);
    } finally {
      setOtp(["", "", "", ""])
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
        return amountNum >= min && amountNum <= max && !!formData.voucher && !!formData.proof;
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
      case 2: return <StepTwo formData={formData} variants={giftcards.filter((g) => g.slug === formData.service_id)} handleVariantSelect={handleVariantSelect} handleAmountChange={handleAmountChange} handleVoucherChange={handleVoucherChange} handleImageUpload={handleImageUpload} fileInputRef={fileInputRef} onNext={handleNext} isStepValid={isStepValid} uploading={uploading} />;
      case 3: return <StepThree formData={formData} providers={providers} onNext={handleNext} onBack={handleBack} />;
      case 4: return <StepFour otp={otp} setOtp={setOtp} loading={loading} handleSubmit={handleSubmit} handleBack={handleBack} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full mx-auto max-w-xl flex flex-col space-y-4 px-4">

      <div className="flex items-center justify-between">
        <div className="w-full">
          {step > 1 && (
            <button onClick={handleBack} className="py-2 hover:bg-card bg-stone-950/25 px-4 border border-stone-800 rounded-4xl transition-colors">
              Back
            </button>
          )}
        </div>
        <Link className="w-auto flex-none flex items-center justify-end space-x-2 purple-text text-lg font-bold" href={"/app/giftcards/history"}>
          <ListFilter size={20} />
          <span>View history</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
}

/** ---------- Sub-components ---------- **/

function StepOne({ providers, searchQuery, setSearchQuery, selectedServiceId, onSelect }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-extrabold text-stone-400">Select Gift Card</h2>
        <p className="text-stone-200">Pick a gift card to sell quickly and safely</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
        <TextInput value={searchQuery} onChange={setSearchQuery} placeholder="Search gift cards..." type="text" className="pl-12 rounded-xl border border-stone-200 shadow-sm outline-none" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {providers.map((p: Giftcard) => (
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
  uploading
}: any) {
  const selectedVariant = formData.selectedVariant;
  const rate = selectedVariant ? parseFloat(selectedVariant.ngn_rate) : 0;
  const min = selectedVariant ? parseFloat(selectedVariant.min_face_value) : 0;
  const max = selectedVariant ? parseFloat(selectedVariant.max_face_value) : 0;
  const estimated = formData.amount ? (parseFloat(formData.amount) * rate).toFixed(0) : "0";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-extrabold text-stone-400">Enter Gift Card Details</h2>
        <p className="text-stone-200">Select a variant, enter amount, voucher code & upload proof</p>
      </div>

      {variants[0] && (
        <div className="w-full h-40 bg-stone-50 relative rounded-2xl overflow-hidden shadow">
          <Image src={`/img/giftcard/${variants[0].logo}`} alt={variants[0].name} fill className="object-cover rounded-xl" />
        </div>
      )}
      <VariantDropdown
        variants={variants}
        selectedVariant={selectedVariant}
        handleVariantSelect={handleVariantSelect}
      />

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
          <label className="w-full flex items-center justify-center py-3 text-lg cursor-pointer text-stone-200 hover:text-stone-400">
            {!uploading ? <div className="flex items-center gap-2 "><Upload size={20} /> {formData.proof ? "Change Proof" : "Upload Proof"}</div> : <div className="flex items-center gap-2 "><Circle size={20} /> Uploading</div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <div className="w-full flex items-center justify-center">
            {!uploading && formData.proof && (
              <div className="mt-2 w-28 h-28 relative rounded overflow-hidden">
                <Image src={formData.proof} alt="Proof" fill className="object-cover" />
              </div>
            )}
          </div>

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

function StepThree({ formData, providers, onNext, onBack }: any) {
  const variant = formData.selectedVariant;
  const provider = providers.find((p: Giftcard) => p.slug === formData.service_id);
  const received = formatToNGN(Number(formData.amount) * Number(variant.ngn_rate));
  const firstCountry = variant?.countries[0]?.country || "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-transparent rounded-2xl shadow space-y-2">
        <h2 className="text-2xl text-stone-400 font-bold mb-8">Summary</h2>
        <div className="flex justify-between items-center text-md font-semibold text-stone-200 text-lg">
          <span>{variant.name} ({variant?.currency} {formData.amount})</span>
          <ArrowRight size={20} />
          <span>{received}</span>
        </div>
        <ReviewItem label="Product" value="Sell Gift Card" />
        <ReviewItem label="Brand" value={provider?.name || variant?.name || ""} />
        <ReviewItem label="Country" value={firstCountry} />
        <ReviewItem label="Amount" value={`${variant?.currency} ${formData.amount}`} />
        <ReviewItem label="Voucher" value={formData.voucher} />
        <ReviewItem label="Receive" value={received} />
      </div>
      <div className="flex gap-4">
        <Button onclick={onBack} type="primary" text="Back" width="flex-1 py-4" />
        <Button onclick={onNext} type="secondary" text="Confirm & Pay" width="flex-1 py-4" />
      </div>
    </motion.div>
  );
}

function StepFour({ otp, setOtp, handleSubmit, handleBack, loading }: any) {
  return (
    <EnterPin
      otp={otp}
      show={true}
      setOtp={setOtp}
      headerText={"Enter your 4-digit transaction pin"}
      buttonText={"Sell"}
      onConfirm={handleSubmit}
      onBack={handleBack}
    />
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-stone-700">
      <span className="text-stone-300">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
interface VariantDropdownProps {
  variants: Giftcard[];
  selectedVariant: Giftcard;
  handleVariantSelect: any;
}
function VariantDropdown({ variants, selectedVariant, handleVariantSelect }: VariantDropdownProps) {
  const [query, setQuery] = useState("");

  const filteredVariants = useMemo(() => {
    return variants.filter((v: Giftcard) =>
      v.countries[0].country.toLowerCase().includes(query.toLowerCase()) ||
      v.currency.toLowerCase().includes(query.toLowerCase())
    );
  }, [variants, query]);

  return (
    <div className="w-full space-y-2">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search country or currency..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-600 outline-none"
      />

      {/* Dropdown Box */}
      <div className="relative w-full">
        <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-800 p-2 bg-stone-950 shadow-lg">

          {filteredVariants.length === 0 && (
            <p className="text-center text-sm text-stone-500 py-4">No match found</p>
          )}

          {filteredVariants.map((variant: any) => {
            const firstCountry = variant.countries[0];
            const isSelected = selectedVariant?.id === variant.id;

            return (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${isSelected ? "bg-stone-800 border border-stone-600" : "hover:bg-stone-900"}
                `}
              >
                <span className="text-xl">
                  {variant.currency === "EUR" ? "🇪🇺" : firstCountry.flag}
                </span>

                <div className="flex flex-col text-left">
                  <span className="font-medium text-sm">{firstCountry.country}</span>
                  <span className="text-xs text-stone-400">{variant.currency}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

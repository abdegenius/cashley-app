"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { Check } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/api";
import { LoadingOverlay } from "../Loading";

type VerificationType = "bvn" | "nin" | "address";

interface VerifyProps {
  type: VerificationType;
}

interface NinData {
  nin: string;
}

interface BvnData {
  bvn: string;
}

interface AddressDataProps {
  city: string;
  state: string;
  country: string;
  zipcode: string;
  street: string;
  house_number: string;
}
const bvnSchema = z.object({
  bvn: z
    .string()
    .min(11, "BVN must be exactly 11 digits")
    .max(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain only numbers"),
});

const ninSchema = z.object({
  nin: z
    .string()
    .min(11, "NIN must be exactly 11 digits")
    .max(11, "NIN must be exactly 11 digits")
    .regex(/^\d+$/, "NIN must contain only numbers"),
});

const addressSchema = z.object({
  street: z.string("Street Must not be empty"),
  state: z.string("State must not be empty"),
  city: z.string("City must not be empty"),
  zipcode: z
    .string("Zipcode must not be empty")
    .regex(/^\d+$/, "ZipCode must contain only numbers"),
  house_number: z.string("house number must not be empty"),
  country: z.string("country must not be empty"),
});
export default function Verify({ type }: VerifyProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bvnData, setBvnData] = useState<BvnData>({
    bvn: "",
  });

  const [ninData, setNinData] = useState<NinData>({
    nin: "",
  });

  const [addressData, setAddressData] = useState<AddressDataProps>({
    city: "",
    state: "",
    country: "",
    zipcode: "",
    street: "",
    house_number: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const verifyBvn = async (data: BvnData): Promise<boolean> => {
    try {
      const validatedData = bvnSchema.parse(data);

      const response = await api.post<ApiResponse>("/user/verify/bvn", validatedData);
      if (response.data && !response.data.error) {
        toast.success("BVN verified successfully");
        return true;
      } else {
        const err = response.data.message;
        toast.error(`${err}`);
        return false;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.issues[0].message);
      }
      console.warn("failed to verify BVN", error);
      return false;
    }
  };

  const verifyNin = async (data: NinData): Promise<boolean> => {
    try {
      const validatedData = ninSchema.parse(data);
      const response = await api.post<ApiResponse>("/user/verify/nin", validatedData);

      if (response.data && !response.data.error) {
        toast.success("NIN verified successfully");
        return true;
      } else {
        const err = response.data.message;
        toast.error(`${err}`);
        return false;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.issues[0].message);
      }
      console.warn("failed to verify BVN", error);
      return false;
    }
  };

  const uploadAddress = async (data: AddressDataProps): Promise<boolean> => {
    try {
      const validatedData = addressSchema.parse(data);
      const response = await api.post<ApiResponse>("/user/verify/address", validatedData);

      if (response.data && !response.data.error) {
        toast.success("Address uploaded successfully");
        return true;
      } else {
        const err = response.data.message;
        toast.error(`${err}`);
        return false;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.issues[0].message);
      }
      console.warn("failed to Upload Address", error);
      return false;
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let result = false;
      if (type === "bvn") {
        result = await verifyBvn(bvnData);
      } else if (type === "nin") {
        result = await verifyNin(ninData);
      } else if (type === "address") {
        result = await uploadAddress(addressData);
      }
      if (result) {
        handleNext();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (type === "bvn") {
      setBvnData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (type === "nin") {
      setNinData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (type === "address") {
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  const labelToFieldName = (label: string): string => {
    const fieldMap: { [key: string]: string } = {
      "BVN Number": "bvn",
      "NIN Number": "nin",
      Address: "address",
    };
    return fieldMap[label] || label.toLowerCase().replace(/\s+/g, "");
  };

  const getFieldValue = (fieldLabel: string) => {
    const fieldName = labelToFieldName(fieldLabel);

    if (type === "bvn") {
      return bvnData[fieldName as keyof BvnData] || "";
    } else if (type === "nin") {
      return ninData[fieldName as keyof NinData] || "";
    } else if (type === "address") {
      return addressData[fieldName as keyof AddressDataProps] || "";
    }
    return "";
  };
  const isBvnDataComplete = () => {
    return bvnData.bvn.length === 11;
  };

  const isNinDataComplete = () => {
    return ninData.nin.length === 11;
  };

  const isAddressDataComplete = () => {
    return (
      addressData.city.length > 1,
      addressData.country.length > 1,
      addressData.house_number.length > 0,
      addressData.state.length > 1,
      addressData.zipcode != null,
      addressData.street.length > 1
    );
  };

  const getVerificationConfig = () => {
    const config = {
      bvn: {
        title: "BVN Verification",
        fields: [{ label: "BVN Number", type: "number", required: true }],
        description:
          "Secure your account and unlock full access by verifying your BVN. It's quick, safe, and helps us keep your Cashley account protected.",
        loadingText: "Verifying your BVN details...",
        placeholder: "BVN Number",
        inputType: "number" as const,
      },
      nin: {
        title: "NIN Verification",
        fields: [{ label: "NIN Number", type: "number", required: true }],
        description:
          "Update your account limit and unlock extra features by verifying your NIN. It's quick, safe, and helps us keep your Cashley account protected..",
        loadingText: "Verifying your NIN details...",
        placeholder: "NIN Number",
        inputType: "number" as const,
      },
      address: {
        title: "Address Verification",
        fields: [
          { label: "Country", type: "string", required: true },
          { label: "State", type: "string", required: true },
          { label: "City", type: "string", required: true },
          { label: "Street", type: "string", required: true },
          { label: "House No", type: "string", required: true },
          { label: "Zipcode", type: "number", required: true },
        ],
        description:
          "Update your account limit and unlock extra features by Uploading your Address. It's quick, safe, and helps us keep your Cashley account protected..",
        loadingText: "Verifying your Address details...",
        placeholder: "Address",
        inputType: "text" as const,
      },
    };

    return config[type];
  };

  const renderStep = () => {
    const config = getVerificationConfig();

    switch (step) {
      case 1:
        return (
          <div className="">
            <h1 className="text-2xl font-semibold text-stone-400">{config.title}</h1>
            <h3 className="text-md font-normal text-stone-200 pb-10">{config.description}</h3>
            <div className="space-y-2 mb-4">
              {config.fields?.map((field) => (
                <TextInput
                  key={field.label}
                  value={getFieldValue(field.label)}
                  onChange={(value) => handleInputChange(labelToFieldName(field.label), value)}
                  placeholder={field.label}
                  type={field.type as any}
                  // required={field.required}
                />
              ))}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            {loading && <LoadingOverlay />}
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full min-h-full flex flex-col items-center justify-start space-y-12">
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-stone-400">{config.title}</h1>
              <h3 className="text-md font-normal text-stone-200 pb-10">
                {type === "bvn"
                  ? "Your BVN was successfully verified. Your account is now a Level 1 account. Proceed with Cashley and enjoy our services."
                  : type === "nin"
                    ? "Your NIN was successfully verified. Your account is now a Level 2 account. Proceed with Cashley and enjoy our services."
                    : type === "address"
                      ? "Your Address was successfully Uploaded. Your account is now a Level 3 account. Proceed with Cashley and enjoy our services."
                      : "Your CAC was successfully verified. Your account is now a Level 4 account. Proceed with Cashley and enjoy our services."}
              </h3>
            </div>

            <div className="w-40 h-40 rounded-full primary-purple-to-blue flex items-center justify-center mb-24">
              <Check size={40} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full mx-auto max-w-xl flex relative flex-col justify-between p-4 space-y-2">
      <div>{renderStep()}</div>

      {step === 1 && (
        <Button
          onclick={handleSubmit}
          type="secondary"
          text="Continue"
          width="py-4"
          disabled={
            type === "bvn"
              ? !isBvnDataComplete()
              : type === "nin"
                ? !isNinDataComplete()
                : !isAddressDataComplete()
          }
        />
      )}

      {step === 2 && (
        <Button
          onclick={() => router.push("/app")}
          type="secondary"
          text="Continue"
          width="py-4 mx-12"
        />
      )}
    </div>
  );
}

"use client";

import { Keypad } from "@/components/modals/Keypad";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion } from "framer-motion";
import { Check, Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { z } from "zod";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type VerificationType = "bvn" | "nin" | "selfie";

interface VerifyProps {
  type: VerificationType;
}

interface NinData {
  nin: string;
}


interface BvnData {
  bvn: string;
  // dateOfBirth: string;
  // street: string;
  // street2: string;
  // city: string;
  // state: string;
  // zipcode: string;
}
const bvnSchema = z.object({
  bvn: z
    .string()
    .min(11, "BVN must be exactly 11 digits")
    .max(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain only numbers"),
  // dateOfBirth: z.string().min(1, "Date of Birth is required"),
  // street: z.string().min(1, "Street is required"),
  // street2: z.string().optional(),
  // city: z.string().min(1, "City is required"),
  // state: z.string().min(1, "State is required"),
  // zipcode: z.string().min(1, "Zipcode is required"),
});

const ninSchema = z.object({
  nin: z
    .string()
    .min(11, "NIN must be exactly 11 digits")
    .max(11, "NIN must be exactly 11 digits")
    .regex(/^\d+$/, "NIN must contain only numbers"),
});

export default function Verify({ type }: VerifyProps) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, showLoading] = useState(false);
  const [bvnData, setBvnData] = useState<BvnData>({
    bvn: "",
    // dateOfBirth: "",
    // street: "",
    // street2: "",
    // city: "",
    // state: "",
    // zipcode: "",
  });

  const [ninData, setNinData] = useState<NinData>({
    nin: "",
  });
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (type === "selfie" && step === 1) {
      setIsCameraOn(true);
    } else {
      setIsCameraOn(false);
    }
  }, [type, step]);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      return imageSrc;
    }
    return null;
  };

  const handleNumberClick = (num: string) => {
    if (otp.length < 4) {
      setOtp((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setOtp((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (type === "selfie" && step === 1) {
      const image = capturePhoto();
      if (image) {
        setCapturedImage(image);
        setStep((prev) => prev + 1);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const verifyBvn = async (data: BvnData) => {
    try {
      const validatedData = bvnSchema.parse(data);

      const response = await api.post("/user/verify/bvn", validatedData);
      if (response.data && !response.data.error) {
        toast.success("BVN verified successfully");
        router.push("/app")
      } else {
        const err = response.data.message;
        toast.error("Failed to upload BVN: ", err);
      }
    } catch (error) {
      console.log("failed to upload BVN", error);
    }
  };

  const verifyNin = async (data: NinData) => {
    try {
      const validatedData = ninSchema.parse(data);
      const response = await api.post("/user/verify/nin", validatedData);

      if (response.data && !response.data.error) {
        toast.success("NIN verified successfully");
        router.push("/app")
      } else {
        const err = response.data.message;
        toast.error("Failed to verify NIN", err);
        throw new Error(err);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.issues[0].message);
      }
      throw error;
    }
  };

  const handleLoading = async () => {
    showLoading(true);
    setError("");
    try {
      if (type === "bvn") {
        const result = await verifyBvn(bvnData);
        console.log("BVN Verification Result:", result);
      } else if (type === "nin") {
        const result = await verifyNin(ninData);
        console.log("NIN Verification Result:", result);
      }

      setTimeout(() => {
        showLoading(false);
        handleNext();
      }, 3000);
    } catch (err) {
      showLoading(false);
      setError(err instanceof Error ? err.message : "Verification failed");
      console.error("Verification error:", err);
    }
  };
  const handleConfirm = () => {
    if (otp.length === 4) {
      console.log("PIN entered:", otp);
      setOtp("");
      handleLoading();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (type === "bvn") {
      setBvnData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (type === "nin") {
      setNinData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const labelToFieldName = (label: string): string => {
    const fieldMap: { [key: string]: string } = {
      "BVN Number": "bvn",
      // "Date of Birth": "dateOfBirth",
      // "Street": "street",
      // "Street 2": "street2",
      // "City": "city",
      // "State": "state",
      // "Zipcode": "zipcode",
      "NIN Number": "nin"
    };
    return fieldMap[label] || label.toLowerCase().replace(/\s+/g, '');
  };

  const getFieldValue = (fieldLabel: string) => {
    const fieldName = labelToFieldName(fieldLabel);

    if (type === "bvn") {
      return bvnData[fieldName as keyof BvnData] || "";
    } else if (type === "nin") {
      return ninData[fieldName as keyof NinData] || "";
    }
    return "";
  };
  const isBvnDataComplete = () => {
    return (
      bvnData.bvn.length === 11
      //  &&
      // bvnData.dateOfBirth &&
      // bvnData.street &&
      // bvnData.city &&
      // bvnData.state &&
      // bvnData.zipcode
    );
  };

  const isNinDataComplete = () => {
    return ninData.nin.length === 11;
  };

  const keypadNumbers = [
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
  ];

  const getVerificationConfig = () => {
    const config = {
      bvn: {
        title: "BVN Verification",
        fields: [
          { label: "BVN Number", type: "number", required: true },
          // { label: "Date of Birth", type: "date", required: true },
          // { label: "Street", type: "text", required: true },
          // { label: "Street 2", type: "text", required: false },
          // { label: "City", type: "text", required: true },
          // { label: "State", type: "text", required: true },
          // { label: "Zipcode", type: "number", required: true },
        ],
        step1Description:
          "Secure your account and unlock full access by verifying your BVN. It's quick, safe, and helps us keep your Cashley account protected.",
        step2Description:
          "An OTP code has been successfully sent to the number attached to the BVN provided, please input below.",
        loadingText: "Verifying your BVN details...",
        placeholder: "BVN Number",
        inputType: "number" as const,
      },
      nin: {
        title: "NIN Verification",
        fields: [
          { label: "NIN Number", type: "number", required: true },
        ],
        step1Description:
          "Launch YouTube courses and hints by verifying your NIN.",
        step2Description:
          "An OTP code has been successfully sent to the number attached to the NIN provided, please input below.",
        loadingText: "Verifying your NIN details...",
        placeholder: "NIN Number",
        inputType: "number" as const,
      },
      selfie: {
        fields: [],
        title: "Selfie Verification",
        step1Description:
          "Secure your account and unlock full access by creating a new face. It's quick, safe, and helps keep your Cashley account protected.",
        step2Description: "Please place your face within the frame",
        loadingText: "Matching your face with documentation...",
        placeholder: "",
        inputType: "selfie" as const,
      },
    };

    return config[type];
  };

  const renderDots = (val: string) => (
    <div className="flex justify-between w-full gap-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: val[i] ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`w-15 h-15 rounded-full text-center flex items-center justify-center ${val[i]
            ? "primary-purple-to-blue shadow-md"
            : "bg-card border border-stone-300"
            }`}
        >
          {val[i] || ""}
        </motion.div>
      ))}
    </div>
  );

  const renderSelfieFrame = () => (
    <div className="w-90 h-90 bg-gray-100 mx-auto rounded-full overflow-hidden mt-10 mb-6 border-2 border-dashed border-gray-800 relative">
      {isCameraOn ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            }}
            onUserMedia={() => console.log("Camera is working!")}
            onUserMediaError={(error) => {
              console.error("Camera error:", error);
              setError("Unable to access camera. Please check permissions.");
              setIsCameraOn(false);
            }}
            className="w-full h-full object-cover"
            mirrored={true}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-70 h-70 border-2 border-white rounded-full opacity-60"></div>
          </div>
        </>
      ) : error ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
          <Camera size={48} className="mb-4" />
          <p className="text-center">{error}</p>
          <button
            onClick={() => {
              setError("");
              setIsCameraOn(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry Camera
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
          <div className="w-20 h-20 relative flex items-center justify-center animate-spin">
            <div className="w-full bottom-[45%] h-0.5 rounded-full absolute blue-bg rotate-90" />
            <div className="w-full bottom-[45%] h-0.5 rounded-full absolute purple-bg rotate-45" />
            <div className="w-full bottom-[45%] h-0.5 rounded-full absolute orange-bg -rotate-45" />
            <div className="w-10 h-10 rounded-full bg-card relative z-99"></div>
          </div>
          <p className="mt-4">Starting camera...</p>
        </div>
      )}
    </div>
  );

  const renderCapturedImage = () => (
    <div className="w-90 h-90 bg-gray-100 mx-auto rounded-full overflow-hidden mt-10 mb-6 border-2 border-dashed border-gray-800 relative">
      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Captured selfie"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
          <Camera size={48} className="mb-4" />
          <p>No image captured</p>
        </div>
      )}
    </div>
  );

  const renderLoadingScreen = (text: string) => (
    <div className="absolute min-h-screen bg-black/50 z-99 max-w-xl mx-auto bottom-0 left-0 h-full w-full transparent-bg flex items-end">
      <div className="w-full rounded-t-3xl bg-card space-y-3 flex flex-col justify-center items-center p-10">
        <div className="w-20 h-20 relative flex items-center justify-center animate-spin">
          <div className="w-full bottom-[45%] h-0.5 rounded-full absolute blue-bg rotate-90" />
          <div className="w-full bottom-[45%] h-0.5 rounded-full absolute purple-bg rotate-45" />
          <div className="w-full bottom-[45%] h-0.5 rounded-full absolute orange-bg -rotate-45" />
          <div className="w-full bottom-[45%] h-0.5 rounded-full absolute blue-bg -rotate-" />
          <div className="w-10 h-10 rounded-full bg-card relative z-99"></div>
          <div className="w-5 h-5 rounded-full bg-card absolute top-0 z-99"></div>
          <div className="w-5 h-5 rounded-full bg-card absolute top-0 z-99"></div>
        </div>
        <h1 className="text-3xl font-black">Please Wait</h1>
        <h1 className="text-lg">{text}</h1>
      </div>
    </div>
  );

  const renderStep = () => {
    const config = getVerificationConfig();

    switch (step) {
      case 1:
        return (
          <div className="">
            <h1 className="text-2xl font-semibold text-stone-400">{config.title}</h1>
            <h3 className="text-md font-normal text-stone-200 pb-10">{config.step1Description}</h3>
            {type === "selfie" ? (
              renderSelfieFrame()
            ) : (
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
            )}
          </div>
        ); case 2:
        return (
          <div className="">
            <h1 className="text-3xl font-black">{config.title}</h1>
            <h3 className="text-lg pb-10">
              {type === "selfie"
                ? "Your selfie has been captured. Please verify this is you."
                : config.step2Description}
            </h3>
            {type === "selfie" ? (
              <>
                {renderCapturedImage()}
                <div className="flex gap-4 mt-6">
                  <Button
                    onclick={() => {
                      setCapturedImage(null);
                      setStep(1);
                    }}
                    type="primary"
                    text="Retake"
                    width="py-4 flex-1"
                  />
                  <Button
                    onclick={handleLoading}
                    type="secondary"
                    text="Confirm"
                    width="py-4 flex-1"
                  />
                </div>
              </>
            ) : (
              renderDots(otp)
            )}
            {loading && renderLoadingScreen(config.loadingText)}
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full min-h-full gap-30 flex flex-col items-center justify-between">
            <div className="w-full">
              <h1 className="text-3xl font-black text-start w-full">
                {type === "selfie" ? "Selfie Verification" : config.title}
              </h1>
              <h3 className="text-lg pb-10 w-full text-start">
                {type === "selfie"
                  ? "Your selfie verification was successful. Your account will be free and you have unlocked full access. Proceed with Cashley and enjoy our services."
                  : type === "bvn"
                    ? "Your BVN was successfully verified. Your account is now a Tier 1 account. Proceed with Cashley and enjoy our services."
                    : "Your NIN was successfully verified. Your account is now a Tier 2 account. Proceed with Cashley and enjoy our services."}
              </h3>
            </div>

            <div className="w-50 h-50 rounded-full primary-purple-to-blue flex items-center justify-center">
              <Check size={50} />
            </div>
          </div>
        );
    }
  };

  const showKeypad = step === 2 && type !== "selfie";

  return (
    <div className="w-full h-full mx-auto max-w-xl flex relative flex-col justify-between p-4 space-y-2">
      <div>{renderStep()}</div>

      {step === 1 && type === "selfie" && (
        <Button
          onclick={handleNext}
          type="secondary"
          text="Capture & Continue"
          width="py-4"
        />
      )}

      {step === 1 && type !== "selfie" && (
        <Button
          onclick={handleNext}
          type="secondary"
          text="Continue"
          width="py-4"
          disabled={
            type === "bvn" ? !isBvnDataComplete() : !isNinDataComplete()
          }
        />
      )}

      {step === 3 && (
        <Button
          onclick={() => console.log("Verification completed!")}
          type="secondary"
          text="Continue"
          width="py-4"
        />
      )}


      {showKeypad && (
        <div className="w-full bg-card py-5 flex max-w-xl mx-auto items-center absolute bottom-0 left-0">
          <Keypad
            numbers={keypadNumbers}
            onNumberClick={handleNumberClick}
            onDelete={handleDelete}
            onConfirm={handleConfirm}
            disableConfirm={otp.length < 4}
            loading={false}
          />
        </div>
      )}
    </div>
  );
}

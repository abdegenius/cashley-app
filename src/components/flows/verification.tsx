"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion } from "framer-motion";
import { Check, Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type VerificationType = "bvn" | "nin" | "selfie";

interface VerifyProps {
  type: VerificationType;
}

export default function Verify({ type }: VerifyProps) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, showLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start camera automatically when selfie verification is active
  useEffect(() => {
    if (type === "selfie" && step === 1) {
      setIsCameraOn(true);
    } else {
      setIsCameraOn(false);
    }
  }, [type, step]);

  // Capture photo from webcam
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
    // If it's selfie verification and step 1, capture the image first
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

  const handleLoading = () => {
    showLoading(true);
    setTimeout(() => {
      showLoading(false);
      handleNext();
    }, 3000);
  };

  const handleConfirm = () => {
    if (otp.length === 4) {
      console.log("PIN entered:", otp);
      setOtp("");
      handleLoading();
    }
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
        step1Description:
          "Launch YouTube courses and hints by verifying your NIN.",
        step2Description:
          "An OTP code has been successfully sent to the number attached to the NIN provided, please input below.",
        loadingText: "Verifying your NIN details...",
        placeholder: "NIN Number",
        inputType: "number" as const,
      },
      selfie: {
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
          className={`w-15 h-15 rounded-full text-center flex items-center justify-center ${
            val[i]
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
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
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
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
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
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
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
            <h1 className="text-3xl font-black">{config.title}</h1>
            <h3 className="text-lg pb-10">{config.step1Description}</h3>
            {type === "selfie" ? (
              renderSelfieFrame()
            ) : (
              <TextInput
                value=""
                onChange={() => {}}
                placeholder={config.placeholder}
                type={config.inputType}
              />
            )}
          </div>
        );
      case 2:
        return (
          <div className="">
            <h1 className="text-3xl font-black">{config.title}</h1>
            <h3 className="text-lg pb-10">
              {type === "selfie" 
                ? "Your selfie has been captured. Please verify this is you."
                : config.step2Description
              }
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
    <div className="w-full h-full min-h-[90vh] mx-auto max-w-xl flex relative flex-col justify-between px-5 py-3">
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
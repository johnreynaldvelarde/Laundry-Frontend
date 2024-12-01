import React, { useState, useEffect } from "react";
import { COLORS } from "../../constants/color";
import email_verified from "../../assets/images/email_verified.jpg";
import backgroundImage from "../../assets/images/forget-password-background_1.jpg";
import {
  isEmailExist,
  updateAccountIsVerified,
} from "../../services/api/authClient";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import useAuth from "../../contexts/AuthContext";
import { ArrowLeft } from "@phosphor-icons/react";
import usePopup from "../../hooks/common/usePopup";
import PopupChangeEmail from "./PopupChangeEmail";
import { checkCustomerDetails } from "../../services/api/checkApi";
import { useNavigate } from "react-router-dom";
import {
  generateRandomCode,
  sendVerificationEmail,
} from "../../utils/emailUtils";

const VerifiedAccount = () => {
  const { userDetails, fetchUserDetails, accessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const { isOpen, popupType, openPopup, closePopup, popupData } = usePopup();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails?.email) {
      setEmail(userDetails.email);
    }
  }, [userDetails?.email]);

  useEffect(() => {
    if (email) {
      const newCode = generateRandomCode();
      setGeneratedCode(newCode);
      //sendVerificationEmail(email, newCode);
    }
  }, [email]);

  useEffect(() => {
    if (timer > 0 && isResendDisabled) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer, isResendDisabled]);

  const handleChange = (event, index) => {
    const value = event.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 3) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      toast.error("Please enter the complete 4-digit code.");
      return;
    }

    if (enteredCode === generatedCode) {
      toast.success("Account verified successfully!");
      setLoading(true);

      try {
        const response = await updateAccountIsVerified.putAccountIsVerified(
          userDetails.userId
        );
        if (response.success) {
          const details = await checkCustomerDetails.getCheckCustomerDetails(
            userDetails.userId
          );
          const { storeIdIsNull, addressIdIsNull, isVerified } = details.data;
          if (details.success !== false) {
            if (!isVerified) {
              navigate("/verified-account");
            } else if (storeIdIsNull || addressIdIsNull) {
              navigate("/complete-details");
            } else {
              navigate("/customer-page");
            }
          } else {
            toast.error("Failed to check customer details.");
          }
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error("Error during login or fetching user details:", error);
        toast.error("An error occurred while verifying the account.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Invalid verification code.");
    }
  };

  const handleResendCode = () => {
    if (isResendDisabled) return;
    setIsResendLoading(true);
    const newCode = generateRandomCode();
    setGeneratedCode(newCode);
    sendVerificationEmail(email, newCode)
      .then(() => {
        toast.success("A new verification code has been sent to your email.");
      })
      .catch((error) => {
        toast.error(
          "There was an issue resending the verification code. Please try again later."
        );
      })
      .finally(() => {
        setIsResendDisabled(true);
        setIsResendLoading(false);
      });
  };

  const handleRefreshData = async () => {
    await fetchUserDetails(accessToken);
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.1,
        }}
      ></div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <img
            src={email_verified}
            alt="Email Verified"
            className="w-full h-80 mb-1"
          />
          <h1
            className="text-3xl font-bold text-center"
            style={{ color: COLORS.text }}
          >
            Verify Your Account
          </h1>

          <p className="mt-4 text-center" style={{ color: COLORS.primary }}>
            A 4-digit verification code has been sent to:
          </p>

          <p
            className="font-bold text-center"
            style={{ color: COLORS.secondary }}
          >
            {email}
          </p>

          <div className="flex justify-center mt-4 space-x-5">
            {code.map((num, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                value={num}
                onChange={(e) => handleChange(e, index)}
                maxLength="1"
                className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="font-semibold mt-6 px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all w-full"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
            ) : (
              "Verify Account"
            )}
          </button>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className={`text-sm font-semibold ${
                isResendDisabled ? "text-gray-400 cursor-not-allowed" : ""
              }`}
              style={{
                color: isResendDisabled ? COLORS.disable_text : COLORS.primary,
              }}
            >
              {isResendLoading ? "Resending..." : `Resend Code (${timer}s)`}
            </button>

            <button
              onClick={() => openPopup("changeEmail")}
              disabled={isResendDisabled}
              className="text-sm font-semibold"
              style={{
                color: isResendDisabled
                  ? COLORS.disable_text
                  : COLORS.secondary,
              }}
            >
              Change Email
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 text-sm font-normal transition-all"
              style={{
                color: COLORS.primary,
              }}
            >
              <ArrowLeft
                size={20}
                color={COLORS.primary}
                className="mr-1 inline"
              />
              Back to Home
            </button>
          </div>
        </div>
      </div>
      {isOpen && popupType === "changeEmail" && (
        <PopupChangeEmail
          open={isOpen}
          onClose={closePopup}
          data_email={email}
          userDetails={userDetails}
          refreshData={handleRefreshData}
        />
      )}
    </div>
  );
};

export default VerifiedAccount;

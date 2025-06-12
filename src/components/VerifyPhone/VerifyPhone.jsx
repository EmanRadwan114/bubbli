import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true;

export default function VerifyPhone() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  };

  const sendCode = async () => {
    setupRecaptcha();

    if (!phone) {
      setError("Please enter a phone number");
      return;
    }

    setError("");
    setMessage("");
    setIsSending(true);

    try {
      const formattedPhone = phone.startsWith("+2") ? phone : `+2${phone}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setMessage("Verification code sent successfully!");
    } catch (err) {
      console.error("Error sending code:", err);
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setError("Please enter the verification code");
      return;
    }
    if (!confirmationResult) {
      setError("Please request a verification code first");
      return;
    }

    setError("");
    setMessage("");
    setIsVerifying(true);

    try {
      const result = await confirmationResult.confirm(code);
      const token = await result.user.getIdToken();
      console.log("Verified! ID token:", token);
      setMessage("Phone number verified successfully!");
      // send token to backend here if needed
    } catch (err) {
      console.error("Verification failed:", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-secondary-dark px-4">
      <div className="w-full max-w-md bg-white dark:bg-black p-8 rounded-2xl shadow-xl space-y-6 border border-secondary/20 dark:border-secondary-dark/30">
        <h2 className="text-2xl font-bold text-center text-dark dark:text-light">
          Phone Verification
        </h2>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 234 567 8901"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-secondary/50 dark:border-secondary-dark/50 bg-white dark:bg-black/80 text-dark dark:text-light focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent"
            />
          </div>

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" className="hidden"></div>

          <button
            onClick={sendCode}
            disabled={isSending}
            className="w-full bg-accent dark:bg-accent-dark hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            {isSending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-secondary/50 dark:border-secondary-dark/50 bg-white dark:bg-black/80 text-dark dark:text-light focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent"
            />
          </div>

          <button
            onClick={verifyCode}
            disabled={isVerifying || !confirmationResult}
            className="w-full bg-primary dark:bg-primary-dark hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify & Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Palette,
  ShieldCheck,
  User,
  UserPlus,
  RotateCcw,
  Check,
  AlertCircle,
  LogIn,
} from "lucide-react";
import HangingLamp from "../components/HangingLamp";
import { LOGIN_THEMES } from "../components/loginThemes";
import { authApi } from "../services/api";

const OTP_INITIAL_SECONDS = 300; // 5 minutes

export default function RegisterPage() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(() => {
    return localStorage.getItem("secret_login_theme") || "amber";
  });

  // Wizard Step State: 1 = Identity, 2 = 4-digit OTP, 3 = Password Creation
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [verificationToken, setVerificationToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // 5-Minute OTP Timer
  const [timerSeconds, setTimerSeconds] = useState(OTP_INITIAL_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const currentTheme =
    LOGIN_THEMES.find((t) => t.id === selectedThemeId) || LOGIN_THEMES[0];

  const handleThemeChange = (id) => {
    setSelectedThemeId(id);
    localStorage.setItem("secret_login_theme", id);
  };

  // Timer countdown for OTP expiry
  useEffect(() => {
    let interval = null;
    if (step === 2 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Auto-focus first OTP input when arriving at Step 2
  useEffect(() => {
    if (step === 2 && isLightOn) {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 200);
    }
  }, [step, isLightOn]);

  // Handle OTP digit changes with smooth auto-advance
  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    const lastChar = cleanVal.slice(-1);
    const updated = [...otpDigits];
    updated[index] = lastChar;
    setOtpDigits(updated);
    setError("");

    // Auto-advance to next input
    if (index < 3 && lastChar) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace navigation between OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste in OTP inputs
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const digits = pasted.split("");
    const updated = ["", "", "", ""];
    digits.forEach((d, i) => {
      if (i < 4) updated[i] = d;
    });
    setOtpDigits(updated);
    setError("");

    const targetIdx = Math.min(digits.length, 3);
    otpInputRefs[targetIdx].current?.focus();
  };

  // -------------------------------------------------------------
  // Step 1: Send 4-Digit OTP to User's Email
  // -------------------------------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessNotice("");

    const errors = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Full name is required (at least 2 characters).";
    }
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const res = await authApi.sendOtp(name.trim(), email.trim().toLowerCase());
      if (res.success) {
        setStep(2);
        setTimerSeconds(OTP_INITIAL_SECONDS);
        setCanResend(false);
        setOtpDigits(["", "", "", ""]);
        setSuccessNotice(
          res.message || "A 4-digit verification code has been dispatched to your email."
        );
      } else {
        throw new Error(res.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError(err.message || "Failed to dispatch verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend && timerSeconds > 0) return;
    setIsLoading(true);
    setError("");
    setSuccessNotice("");

    try {
      const res = await authApi.sendOtp(name.trim(), email.trim().toLowerCase());
      if (res.success) {
        setTimerSeconds(OTP_INITIAL_SECONDS);
        setCanResend(false);
        setOtpDigits(["", "", "", ""]);
        setSuccessNotice("A new 4-digit verification code has been dispatched.");
        otpInputRefs[0].current?.focus();
      }
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Step 2: Verify Entered 4-Digit OTP
  // -------------------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessNotice("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 4) {
      setError("Please enter the complete 4-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.verifyOtp(email.trim().toLowerCase(), fullOtp);
      if (res.success && res.verificationToken) {
        setVerificationToken(res.verificationToken);
        setStep(3);
        setSuccessNotice("Identity verified successfully! Please create your secure password.");
      } else {
        throw new Error(res.message || "Invalid verification code.");
      }
    } catch (err) {
      setError(err.message || "Incorrect verification code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Step 3: Complete Registration & Create User in MongoDB
  // -------------------------------------------------------------
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessNotice("");

    const errors = {};
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        verificationToken,
      };

      const res = await authApi.register(payload);
      if (res.success) {
        // Successful registration: redirect to login with pre-filled email and confirmation
        navigate("/secret-login", {
          replace: true,
          state: {
            registeredEmail: email.trim().toLowerCase(),
            message: "Registration successful! You may now sign in to the Admin Console.",
          },
        });
      } else {
        throw new Error(res.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.message || "Unable to complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans antialiased selection:bg-amber-500/30">
      {/* Background Room Atmosphere & Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(24, 24, 27, 0.4) 0%, rgba(9, 9, 11, 0.98) 100%)",
        }}
      />

      {/* Top Bar: Return Link, 5-Color Theme Switcher, & Illumination Status */}
      <header className="relative z-40 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-400 backdrop-blur-md transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>
          <Link
            to="/secret-login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono font-medium text-zinc-400 backdrop-blur-md transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <LogIn size={13} />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </div>

        {/* 5-Color Theme Switcher */}
        <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/85 px-3.5 py-1.5 backdrop-blur-md shadow-xl">
          <Palette size={13} className="text-zinc-400 mr-1" />
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">Theme:</span>
          <div className="flex items-center gap-2">
            {LOGIN_THEMES.map((t) => {
              const isSelected = t.id === selectedThemeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  title={`${t.name} (${t.label})`}
                  className={`group relative size-5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? "scale-125 ring-2 ring-white/90 shadow-md"
                      : "hover:scale-115 opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: t.accent,
                    boxShadow: isSelected ? `0 0 10px ${t.glow}` : "none",
                  }}
                  aria-label={`Select ${t.name} theme`}
                >
                  {isSelected && (
                    <span className="size-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
          <span
            className="text-[11px] font-mono font-semibold hidden md:inline ml-1"
            style={{ color: currentTheme.glow }}
          >
            {currentTheme.name}
          </span>
        </div>

        {/* Illumination Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span
            className={`size-2 rounded-full transition-colors duration-300 ${
              isLightOn ? currentTheme.indicatorColor : "bg-zinc-700"
            }`}
          />
          <span className="hidden sm:inline">
            {isLightOn
              ? "Illumination: Active"
              : "Shadow Mode: Pull Cord to Illuminate"}
          </span>
        </div>
      </header>

      {/* Main Content Area: Left Lamp & Right Registration Panel */}
      <main className="relative z-30 flex-1 flex flex-col md:flex-row items-center justify-around px-4 sm:px-8 lg:px-16 py-6 gap-8 max-w-7xl mx-auto w-full">
        {/* Left: The Interactive Desk Lamp with Freeform Drag & Auto-Snap */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <HangingLamp
            isLightOn={isLightOn}
            onToggle={() => setIsLightOn((prev) => !prev)}
            theme={currentTheme}
          />
        </div>

        {/* Right: The Registration Card (Revealed when light is ON) */}
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out transform ${
            isLightOn
              ? "opacity-100 translate-y-0 scale-100 filter-none pointer-events-auto"
              : "opacity-0 translate-y-6 scale-95 blur-md pointer-events-none"
          }`}
        >
          <div
            className={`relative rounded-2xl border ${currentTheme.cardBorder} bg-zinc-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500`}
            style={{
              boxShadow: isLightOn ? currentTheme.cardShadow : "none",
            }}
          >
            {/* Top Light Rim Highlight */}
            <div
              className={`absolute inset-x-8 -top-px h-px bg-gradient-to-r ${currentTheme.cardRim}`}
            />

            {/* Header Badge & Title */}
            <div className="mb-5">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border ${currentTheme.badge} px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2.5 shadow-2xs`}
              >
                <ShieldCheck size={12} className={currentTheme.badgeIcon} />
                <span>Admin Enrollment • Step {step} of 3</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Admin Registration</span>
                <UserPlus size={18} className={currentTheme.accentText} />
              </h1>

              {/* Progress Steps Indicator */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    step >= 1 ? "bg-amber-400" : "bg-zinc-800"
                  }`}
                  style={{
                    backgroundColor: step >= 1 ? currentTheme.accent : "#27272a",
                  }}
                />
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    step >= 2 ? "bg-amber-400" : "bg-zinc-800"
                  }`}
                  style={{
                    backgroundColor: step >= 2 ? currentTheme.accent : "#27272a",
                  }}
                />
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    step >= 3 ? "bg-amber-400" : "bg-zinc-800"
                  }`}
                  style={{
                    backgroundColor: step >= 3 ? currentTheme.accent : "#27272a",
                  }}
                />
              </div>
            </div>

            {/* Success Notification Banner */}
            {successNotice && (
              <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 1: USER DETAILS (NAME & EMAIL)                          */}
            {/* ============================================================ */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed -mt-1">
                  Enter your administrative name and email address. A 4-digit OTP will be dispatched to your inbox for identity verification.
                </p>

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (validationErrors.name) {
                          setValidationErrors((prev) => ({ ...prev, name: "" }));
                        }
                        if (error) setError("");
                      }}
                      placeholder="e.g. Ashish Sahu"
                      className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                        validationErrors.name
                          ? "border-red-500/70 focus:border-red-500"
                          : `border-zinc-800 ${currentTheme.inputFocus}`
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors((prev) => ({ ...prev, email: "" }));
                        }
                        if (error) setError("");
                      }}
                      placeholder="admin@ashish.dev"
                      className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                        validationErrors.email
                          ? "border-red-500/70 focus:border-red-500"
                          : `border-zinc-800 ${currentTheme.inputFocus}`
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Submit Step 1 Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending 4-Digit OTP...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      <span>Send 4-Digit Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ============================================================ */}
            {/* STEP 2: 4-DIGIT OTP VERIFICATION                             */}
            {/* ============================================================ */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-3 text-xs flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                      Sent to
                    </span>
                    <span className="font-mono text-zinc-200 truncate">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setSuccessNotice("");
                    }}
                    className="text-[11px] font-mono hover:underline shrink-0 cursor-pointer"
                    style={{ color: currentTheme.glow }}
                  >
                    Change Email
                  </button>
                </div>

                <div className="text-center py-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-3">
                    Enter the 4-digit code sent to your inbox
                  </label>

                  {/* 4 Split Digit Input Boxes */}
                  <div
                    className="flex justify-center items-center gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`size-14 text-center font-mono text-2xl font-bold rounded-xl border bg-zinc-950/90 text-white focus:outline-hidden transition shadow-inner ${
                          digit
                            ? "border-amber-400/80 shadow-amber-400/10"
                            : "border-zinc-800"
                        } ${currentTheme.inputFocus}`}
                        style={{
                          borderColor: digit ? currentTheme.accent : undefined,
                        }}
                      />
                    ))}
                  </div>

                  {/* 5-Minute Timer and Resend Controls */}
                  <div className="mt-4 flex items-center justify-between text-xs px-2">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                      <span>Expires in:</span>
                      <span
                        className={`font-semibold ${
                          timerSeconds < 60 ? "text-red-400" : "text-zinc-200"
                        }`}
                      >
                        {formatTime(timerSeconds)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isLoading}
                      className="inline-flex items-center gap-1 text-[11px] font-mono hover:underline disabled:opacity-40 disabled:hover:no-underline cursor-pointer transition"
                      style={{ color: canResend ? currentTheme.glow : "#71717a" }}
                    >
                      <RotateCcw size={11} className={isLoading ? "animate-spin" : ""} />
                      <span>Resend Code</span>
                    </button>
                  </div>
                </div>

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 4}
                  className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ============================================================ */}
            {/* STEP 3: PASSWORD CREATION                                    */}
            {/* ============================================================ */}
            {step === 3 && (
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed -mt-1">
                  Create a strong password for your administrator profile. Your account will be persisted in MongoDB upon confirmation.
                </p>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors((prev) => ({ ...prev, password: "" }));
                        }
                        if (error) setError("");
                      }}
                      placeholder="At least 8 characters"
                      className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                        validationErrors.password
                          ? "border-red-500/70 focus:border-red-500"
                          : `border-zinc-800 ${currentTheme.inputFocus}`
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (validationErrors.confirmPassword) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                        }
                        if (error) setError("");
                      }}
                      placeholder="Re-type your password"
                      className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                        validationErrors.confirmPassword
                          ? "border-red-500/70 focus:border-red-500"
                          : `border-zinc-800 ${currentTheme.inputFocus}`
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password strength checklist */}
                <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2.5 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`size-1.5 rounded-full ${
                        password.length >= 8 ? "bg-emerald-400" : "bg-zinc-600"
                      }`}
                    />
                    <span
                      className={
                        password.length >= 8 ? "text-emerald-300" : "text-zinc-400"
                      }
                    >
                      Minimum 8 characters length
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`size-1.5 rounded-full ${
                        password && password === confirmPassword
                          ? "bg-emerald-400"
                          : "bg-zinc-600"
                      }`}
                    />
                    <span
                      className={
                        password && password === confirmPassword
                          ? "text-emerald-300"
                          : "text-zinc-400"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                </div>

                {/* Complete Registration Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Account in MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Complete Registration & Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Sign In Link */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
              <span>Already have an admin account? </span>
              <Link
                to="/secret-login"
                className="font-medium hover:underline transition"
                style={{ color: currentTheme.glow }}
              >
                Sign In to Console &rarr;
              </Link>
            </div>

            {/* Security Note */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Bcrypt 10-Salt • JWT</span>
              <span>5-Min OTP Expiry</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-30 p-4 text-center text-xs font-mono text-zinc-600">
        <span>
          Admin Registration Console • Pull cord to illuminate • 4-Digit OTP Verified
        </span>
      </footer>
    </div>
  );
}

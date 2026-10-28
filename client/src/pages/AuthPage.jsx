import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
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
  Send,
  Sparkles,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import HangingLamp from "../components/HangingLamp";
import { LOGIN_THEMES } from "../components/loginThemes";
import { useAuth } from "../auth/AuthContext";
import { authApi } from "../services/api";
import { toast, showToast } from "../utils/toast";

const DEFAULT_EXPIRY_SECONDS = 600; // 10 minutes
const DEFAULT_COOLDOWN_SECONDS = 60; // 60 seconds

export default function AuthPage({ initialMode = "login" }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: "login" or "register"
  const isRegisterRoute =
    location.pathname === "/register" ||
    location.pathname === "/secret-register" ||
    initialMode === "register";

  const [activeTab, setActiveTab] = useState(isRegisterRoute ? "register" : "login");

  // Keep activeTab synchronized with pathname
  useEffect(() => {
    const isReg =
      location.pathname === "/register" ||
      location.pathname === "/secret-register";
    setActiveTab(isReg ? "register" : "login");
  }, [location.pathname]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    const targetUrl = tab === "register" ? "/secret-register" : "/secret-login";
    if (location.pathname !== targetUrl) {
      navigate(targetUrl, { replace: true, state: location.state });
    }
  };

  // Illumination state: persistent across tab changes
  const [isLightOn, setIsLightOn] = useState(() => {
    try {
      return (
        sessionStorage.getItem("secret_lamp_illuminated") === "true" ||
        localStorage.getItem("secret_lamp_illuminated") === "true"
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("secret_lamp_illuminated", String(isLightOn));
      localStorage.setItem("secret_lamp_illuminated", String(isLightOn));
    } catch {}
  }, [isLightOn]);

  const handleToggleLight = () => {
    setIsLightOn((prev) => !prev);
  };

  // Theme selection
  const [selectedThemeId, setSelectedThemeId] = useState(() => {
    return localStorage.getItem("secret_login_theme") || "amber";
  });

  const currentTheme =
    LOGIN_THEMES.find((t) => t.id === selectedThemeId) || LOGIN_THEMES[0];

  const handleThemeChange = (id) => {
    setSelectedThemeId(id);
    localStorage.setItem("secret_login_theme", id);
  };

  // -------------------------------------------------------------
  // LOGIN STATE & HANDLERS
  // -------------------------------------------------------------
  const [loginEmail, setLoginEmail] = useState(location.state?.registeredEmail || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginValidationErrors, setLoginValidationErrors] = useState({});
  const [loginNotice, setLoginNotice] = useState(location.state?.message || "");

  const from = location.state?.from?.pathname || "/admin";
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    error: authError,
    setError: setAuthError,
    login,
    logout,
  } = useAuth();

  const validateLoginForm = () => {
    const errors = {};
    if (!loginEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!loginPassword) {
      errors.password = "Password is required.";
    } else if (loginPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setLoginValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isAuthLoading) return;
    if (!validateLoginForm()) {
      showToast.error("Please enter valid credentials to sign in.");
      return;
    }

    toast.loading("Signing in...", { id: "auth-login" });
    const res = await login(loginEmail, loginPassword, rememberMe);
    if (res.success) {
      toast.success("Welcome back! Signed in successfully.", { id: "auth-login" });
      navigate(from, { replace: true });
    } else {
      toast.error(res.error || "Authentication failed. Please verify your credentials.", { id: "auth-login" });
    }
  };

  // -------------------------------------------------------------
  // RESEND OTP REGISTRATION STATE & HANDLERS
  // -------------------------------------------------------------
  const [registerStep, setRegisterStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [verificationToken, setVerificationToken] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccessNotice, setRegSuccessNotice] = useState("");
  const [regValidationErrors, setRegValidationErrors] = useState({});

  const [expirySeconds, setExpirySeconds] = useState(DEFAULT_EXPIRY_SECONDS);
  const [cooldownSeconds, setCooldownSeconds] = useState(DEFAULT_COOLDOWN_SECONDS);

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Expiry countdown timer (10 min)
  useEffect(() => {
    let interval = null;
    if (activeTab === "register" && registerStep === 2 && expirySeconds > 0) {
      interval = setInterval(() => {
        setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, registerStep, expirySeconds]);

  // Resend cooldown countdown timer (60s)
  useEffect(() => {
    let interval = null;
    if (activeTab === "register" && registerStep === 2 && cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, registerStep, cooldownSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (activeTab === "register" && registerStep === 2 && isLightOn) {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 200);
    }
  }, [activeTab, registerStep, isLightOn]);

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
    if (regError) setRegError("");

    if (index < 5 && lastChar) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const digits = pasted.split("");
    const updated = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      if (i < 6) updated[i] = d;
    });
    setOtpDigits(updated);
    if (regError) setRegError("");

    const targetIdx = Math.min(digits.length, 5);
    otpInputRefs[targetIdx].current?.focus();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (regLoading) return;
    setRegError("");
    setRegSuccessNotice("");

    const errors = {};
    if (!regName.trim() || regName.trim().length < 2) {
      errors.name = "Full name is required (at least 2 characters).";
    }
    if (!regEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setRegValidationErrors(errors);
      showToast.error(errors.email || errors.name || "Please provide valid information.");
      return;
    }

    setRegValidationErrors({});
    setRegLoading(true);
    const targetEmail = regEmail.trim().toLowerCase();
    toast.loading(`Sending verification code to ${targetEmail}...`, { id: "otp-send" });

    try {
      const res = await authApi.sendOtp(regName.trim(), targetEmail);
      if (res.success) {
        setRegisterStep(2);
        setExpirySeconds((res.expiryMinutes || 10) * 60);
        setCooldownSeconds(res.cooldownSeconds || 60);
        setOtpDigits(["", "", "", "", "", ""]);
        const notice = res.message || `A 6-digit verification code has been dispatched via Resend to ${targetEmail}.`;
        setRegSuccessNotice(notice);
        toast.success(notice, { id: "otp-send" });
      } else {
        throw new Error(res.message || "Failed to dispatch verification code via Resend.");
      }
    } catch (err) {
      if (err.status === 429 && err.data?.retryAfter) {
        setCooldownSeconds(err.data.retryAfter);
      }
      const errMsg = err.message || "Failed to dispatch verification code via Resend. Please try again.";
      setRegError(errMsg);
      toast.error(errMsg, { id: "otp-send" });
    } finally {
      setRegLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || regLoading) return;
    setRegLoading(true);
    setRegError("");
    setRegSuccessNotice("");
    const targetEmail = regEmail.trim().toLowerCase();
    toast.loading(`Resending verification code to ${targetEmail}...`, { id: "otp-resend" });

    try {
      const res = await authApi.sendOtp(regName.trim(), targetEmail);
      if (res.success) {
        setExpirySeconds((res.expiryMinutes || 10) * 60);
        setCooldownSeconds(res.cooldownSeconds || 60);
        setOtpDigits(["", "", "", "", "", ""]);
        const notice = res.message || `A new 6-digit verification code has been dispatched to ${targetEmail}.`;
        setRegSuccessNotice(notice);
        toast.success(notice, { id: "otp-resend" });
        otpInputRefs[0].current?.focus();
      }
    } catch (err) {
      if (err.status === 429 && err.data?.retryAfter) {
        setCooldownSeconds(err.data.retryAfter);
      }
      const errMsg = err.message || "Failed to resend verification code via Resend.";
      setRegError(errMsg);
      toast.error(errMsg, { id: "otp-resend" });
    } finally {
      setRegLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (regLoading) return;
    setRegError("");
    setRegSuccessNotice("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      const msg = "Please enter the complete 6-digit verification code.";
      setRegError(msg);
      showToast.error(msg);
      return;
    }

    setRegLoading(true);
    toast.loading("Verifying security code...", { id: "otp-verify" });

    try {
      const res = await authApi.verifyOtp(regEmail.trim().toLowerCase(), fullOtp);
      if (res.success && res.verificationToken) {
        setVerificationToken(res.verificationToken);
        setRegisterStep(3);
        const notice = "Identity verified successfully! Please set your admin password.";
        setRegSuccessNotice(notice);
        toast.success(notice, { id: "otp-verify" });
      } else {
        throw new Error(res.message || "Invalid verification code.");
      }
    } catch (err) {
      const errMsg = err.message || "Incorrect verification code. Please check and try again.";
      setRegError(errMsg);
      toast.error(errMsg, { id: "otp-verify" });
    } finally {
      setRegLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (regLoading) return;
    setRegError("");
    setRegSuccessNotice("");

    const errors = {};
    if (!regPassword) {
      errors.password = "Password is required.";
    } else if (regPassword.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!regConfirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (regPassword !== regConfirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setRegValidationErrors(errors);
      showToast.error(errors.password || errors.confirmPassword || "Please correct password fields.");
      return;
    }

    setRegValidationErrors({});
    setRegLoading(true);
    toast.loading("Creating admin account...", { id: "reg-complete" });

    try {
      const payload = {
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        confirmPassword: regConfirmPassword,
        verificationToken,
      };

      const res = await authApi.register(payload);
      if (res.success) {
        // Smoothly switch to login tab with prefilled credentials
        setLoginEmail(regEmail.trim().toLowerCase());
        const notice = "Registration completed successfully! Please sign in with your password.";
        setLoginNotice(notice);
        setRegSuccessNotice("");
        toast.success(notice, { id: "reg-complete" });
        switchTab("login");
      } else {
        throw new Error(res.message || "Registration failed.");
      }
    } catch (err) {
      const errMsg = err.message || "Unable to complete registration. Please try again.";
      setRegError(errMsg);
      toast.error(errMsg, { id: "reg-complete" });
    } finally {
      setRegLoading(false);
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
            id="return-to-portfolio-link"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-400 backdrop-blur-md transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>

          {/* Quick tab switch in header */}
          <button
            type="button"
            id="header-switch-tab-btn"
            onClick={() => switchTab(activeTab === "login" ? "register" : "login")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono font-medium text-zinc-400 backdrop-blur-md transition hover:border-zinc-700 hover:text-zinc-200 cursor-pointer"
          >
            {activeTab === "login" ? (
              <>
                <UserPlus size={13} />
                <span>Register with OTP</span>
              </>
            ) : (
              <>
                <LogIn size={13} />
                <span>Sign In</span>
              </>
            )}
          </button>
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

      {/* Main Content Area: Left Lamp & Right Auth Card */}
      <main className="relative z-30 flex-1 flex flex-col md:flex-row items-center justify-around px-4 sm:px-8 lg:px-16 py-6 gap-8 max-w-7xl mx-auto w-full">
        {/* Left: Interactive Desk Lamp */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <HangingLamp
            isLightOn={isLightOn}
            onToggle={handleToggleLight}
            theme={currentTheme}
          />
        </div>

        {/* Right: The Auth Panel (Revealed when light is ON) */}
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

            {/* Seamless Mode Switcher (Sign In vs Register OTP) */}
            <div className="flex rounded-xl bg-zinc-950/80 p-1 border border-zinc-800/80 mb-5 shadow-inner">
              <button
                type="button"
                id="tab-btn-login"
                onClick={() => switchTab("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-zinc-800/90 text-white shadow-md border border-zinc-700/60"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                style={
                  activeTab === "login"
                    ? { borderColor: `${currentTheme.glow}40` }
                    : undefined
                }
              >
                <LogIn size={13} style={activeTab === "login" ? { color: currentTheme.glow } : undefined} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                id="tab-btn-register"
                onClick={() => switchTab("register")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "register"
                    ? "bg-zinc-800/90 text-white shadow-md border border-zinc-700/60"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                style={
                  activeTab === "register"
                    ? { borderColor: `${currentTheme.glow}40` }
                    : undefined
                }
              >
                <UserPlus size={13} style={activeTab === "register" ? { color: currentTheme.glow } : undefined} />
                <span>Register (OTP)</span>
              </button>
            </div>

            {/* ============================================================ */}
            {/* TAB 1: LOGIN FORM                                            */}
            {/* ============================================================ */}
            {activeTab === "login" && (
              <div>
                {/* Header Badge & Title */}
                <div className="mb-5">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border ${currentTheme.badge} px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2.5 shadow-2xs`}
                  >
                    <ShieldCheck size={12} className={currentTheme.badgeIcon} />
                    <span>Security Portal • Admin Access</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Admin Console</span>
                    <Sparkles size={18} className={currentTheme.accentText} />
                  </h1>
                </div>

                {/* Already Authenticated Notice */}
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs">
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-1">
                        <CheckCircle2 size={16} />
                        <span>Already Authenticated</span>
                      </div>
                      <p className="text-zinc-400">
                        Active session detected for{" "}
                        <span className="font-mono text-zinc-200 font-bold">
                          {user?.email}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={from}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md cursor-pointer transition`}
                      >
                        <LayoutDashboard size={14} />
                        <span>Open Dashboard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Feedback Messages */}
                    {loginNotice && (
                      <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{loginNotice}</span>
                      </div>
                    )}

                    {authError && (
                      <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Email input */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                            <Mail size={15} />
                          </span>
                          <input
                            id="login-email-input"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => {
                              setLoginEmail(e.target.value);
                              if (loginValidationErrors.email) {
                                setLoginValidationErrors((prev) => ({ ...prev, email: "" }));
                              }
                              if (authError) setAuthError("");
                            }}
                            placeholder="admin@gmail.com"
                            className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                              loginValidationErrors.email
                                ? "border-red-500/70 focus:border-red-500"
                                : `border-zinc-800 ${currentTheme.inputFocus}`
                            }`}
                          />
                        </div>
                        {loginValidationErrors.email && (
                          <p className="mt-1 text-[11px] text-red-400">
                            {loginValidationErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Password input */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                            <Lock size={15} />
                          </span>
                          <input
                            id="login-password-input"
                            type={showLoginPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (loginValidationErrors.password) {
                                setLoginValidationErrors((prev) => ({ ...prev, password: "" }));
                              }
                              if (authError) setAuthError("");
                            }}
                            placeholder="••••••••"
                            className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                              loginValidationErrors.password
                                ? "border-red-500/70 focus:border-red-500"
                                : `border-zinc-800 ${currentTheme.inputFocus}`
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                          >
                            {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {loginValidationErrors.password && (
                          <p className="mt-1 text-[11px] text-red-400">
                            {loginValidationErrors.password}
                          </p>
                        )}
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500/30"
                          />
                          <span className="text-zinc-400 text-[11px]">Remember session</span>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        id="login-submit-btn"
                        disabled={isAuthLoading}
                        className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                      >
                        {isAuthLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <LogIn size={14} />
                            <span>Sign In to Console</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Bottom link to Register */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
                  <span>Need to create an admin account? </span>
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className="font-medium hover:underline transition cursor-pointer"
                    style={{ color: currentTheme.glow }}
                  >
                    Verify email & register with OTP &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: RESEND OTP REGISTRATION FORM                          */}
            {/* ============================================================ */}
            {activeTab === "register" && (
              <div>
                {/* Header Badge & Title */}
                <div className="mb-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border ${currentTheme.badge} px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider shadow-2xs`}
                    >
                      <ShieldCheck size={12} className={currentTheme.badgeIcon} />
                      <span>Enrollment • Step {registerStep} of 3</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                      <Send size={10} />
                      <span>Resend Email</span>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Admin Registration</span>
                    <UserPlus size={18} className={currentTheme.accentText} />
                  </h1>

                  {/* Progress Steps Indicator */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: registerStep >= 1 ? currentTheme.accent : "#27272a",
                      }}
                    />
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: registerStep >= 2 ? currentTheme.accent : "#27272a",
                      }}
                    />
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: registerStep >= 3 ? currentTheme.accent : "#27272a",
                      }}
                    />
                  </div>
                </div>

                {/* Feedback Notices */}
                {regSuccessNotice && (
                  <div
                    id="registration-success-banner"
                    className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{regSuccessNotice}</span>
                  </div>
                )}

                {regError && (
                  <div
                    id="registration-error-banner"
                    className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300 flex flex-col gap-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{regError}</span>
                    </div>
                    {regError.toLowerCase().includes("already exists") && (
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail(regEmail);
                          switchTab("login");
                        }}
                        className="inline-flex items-center gap-1.5 self-start ml-6 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                        style={{
                          color: currentTheme.glow,
                          border: `1px solid ${currentTheme.glow}50`,
                          backgroundColor: `${currentTheme.glow}15`,
                        }}
                      >
                        <LogIn size={13} />
                        <span>Click here to Sign In &rarr;</span>
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 1: USER DETAILS */}
                {registerStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed -mt-1">
                      Enter your administrative name and email address. A 6-digit OTP will be dispatched to your inbox via Resend.
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <User size={15} />
                        </span>
                        <input
                          id="register-name-input"
                          type="text"
                          value={regName}
                          onChange={(e) => {
                            setRegName(e.target.value);
                            if (regValidationErrors.name) {
                              setRegValidationErrors((prev) => ({ ...prev, name: "" }));
                            }
                            if (regError) setRegError("");
                          }}
                          placeholder="e.g. Ashish Sahu"
                          className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                            regValidationErrors.name
                              ? "border-red-500/70 focus:border-red-500"
                              : `border-zinc-800 ${currentTheme.inputFocus}`
                          }`}
                        />
                      </div>
                      {regValidationErrors.name && (
                        <p className="mt-1 text-[11px] text-red-400">
                          {regValidationErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Mail size={15} />
                        </span>
                        <input
                          id="register-email-input"
                          type="email"
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value);
                            if (regValidationErrors.email) {
                              setRegValidationErrors((prev) => ({ ...prev, email: "" }));
                            }
                            if (regError) setRegError("");
                          }}
                          placeholder="your-email@gmail.com"
                          className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                            regValidationErrors.email
                              ? "border-red-500/70 focus:border-red-500"
                              : `border-zinc-800 ${currentTheme.inputFocus}`
                          }`}
                        />
                      </div>
                      {regValidationErrors.email && (
                        <p className="mt-1 text-[11px] text-red-400">
                          {regValidationErrors.email}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      id="send-otp-btn"
                      disabled={regLoading}
                      className={`w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                    >
                      {regLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Sending 6-Digit OTP via Resend...</span>
                        </>
                      ) : (
                        <>
                          <Mail size={14} />
                          <span>Send 6-Digit Verification Code</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
                {registerStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-3 text-xs flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                          Dispatched via Resend to
                        </span>
                        <span className="font-mono text-zinc-200 truncate">{regEmail}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterStep(1);
                          setRegError("");
                          setRegSuccessNotice("");
                        }}
                        className="text-[11px] font-mono hover:underline shrink-0 cursor-pointer"
                        style={{ color: currentTheme.glow }}
                      >
                        Change Email
                      </button>
                    </div>

                    <div className="text-center py-2">
                      <label className="block text-xs font-medium text-zinc-300 mb-3">
                        Enter the 6-digit code sent to your inbox
                      </label>

                      <div
                        className="grid grid-cols-6 gap-2 sm:gap-2.5 max-w-[340px] mx-auto justify-center items-center"
                        onPaste={handleOtpPaste}
                      >
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            ref={otpInputRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className={`h-12 w-full text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border bg-zinc-950/90 text-white focus:outline-hidden transition shadow-inner ${
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

                      <div className="mt-4 flex items-center justify-between text-xs px-2">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                          <span>Expires in:</span>
                          <span
                            className={`font-semibold ${
                              expirySeconds < 60 ? "text-red-400" : "text-zinc-200"
                            }`}
                          >
                            {formatTime(expirySeconds)}
                          </span>
                        </div>

                        <button
                          type="button"
                          id="resend-otp-btn"
                          onClick={handleResendOtp}
                          disabled={cooldownSeconds > 0 || regLoading}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800/80 disabled:opacity-40 disabled:hover:bg-zinc-900/60 cursor-pointer transition"
                          style={{ color: cooldownSeconds === 0 ? currentTheme.glow : "#71717a" }}
                        >
                          <RotateCcw size={12} className={regLoading ? "animate-spin" : ""} />
                          <span>
                            {cooldownSeconds > 0
                              ? `Resend in ${cooldownSeconds}s`
                              : "Resend OTP"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="verify-otp-btn"
                      disabled={regLoading || otpDigits.join("").length !== 6}
                      className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                    >
                      {regLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Verifying Code via Resend...</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Verify 6-Digit OTP & Continue</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 3: PASSWORD CREATION */}
                {registerStep === 3 && (
                  <form onSubmit={handleCompleteRegistration} className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed -mt-1">
                      Create a strong password for your administrator profile. Your verified account will be persisted in MongoDB upon confirmation.
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Lock size={15} />
                        </span>
                        <input
                          id="register-password-input"
                          type={showRegPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            if (regValidationErrors.password) {
                              setRegValidationErrors((prev) => ({ ...prev, password: "" }));
                            }
                            if (regError) setRegError("");
                          }}
                          placeholder="At least 8 characters"
                          className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                            regValidationErrors.password
                              ? "border-red-500/70 focus:border-red-500"
                              : `border-zinc-800 ${currentTheme.inputFocus}`
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {regValidationErrors.password && (
                        <p className="mt-1 text-[11px] text-red-400">
                          {regValidationErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Lock size={15} />
                        </span>
                        <input
                          id="register-confirm-password-input"
                          type={showRegConfirmPassword ? "text" : "password"}
                          value={regConfirmPassword}
                          onChange={(e) => {
                            setRegConfirmPassword(e.target.value);
                            if (regValidationErrors.confirmPassword) {
                              setRegValidationErrors((prev) => ({
                                ...prev,
                                confirmPassword: "",
                              }));
                            }
                            if (regError) setRegError("");
                          }}
                          placeholder="Re-type your password"
                          className={`w-full rounded-lg border bg-zinc-950/60 pl-9 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition ${
                            regValidationErrors.confirmPassword
                              ? "border-red-500/70 focus:border-red-500"
                              : `border-zinc-800 ${currentTheme.inputFocus}`
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          {showRegConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {regValidationErrors.confirmPassword && (
                        <p className="mt-1 text-[11px] text-red-400">
                          {regValidationErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg bg-zinc-950/70 border border-zinc-800 p-2.5 space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            regPassword.length >= 8 ? "bg-emerald-400" : "bg-zinc-600"
                          }`}
                        />
                        <span
                          className={
                            regPassword.length >= 8 ? "text-emerald-300" : "text-zinc-400"
                          }
                        >
                          Minimum 8 characters length
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            regPassword && regPassword === regConfirmPassword
                              ? "bg-emerald-400"
                              : "bg-zinc-600"
                          }`}
                        />
                        <span
                          className={
                            regPassword && regPassword === regConfirmPassword
                              ? "text-emerald-300"
                              : "text-zinc-400"
                          }
                        >
                          Passwords match
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="complete-registration-btn"
                      disabled={regLoading}
                      className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                    >
                      {regLoading ? (
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

                {/* Bottom link to Sign In */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
                  <span>Already have an admin account? </span>
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="font-medium hover:underline transition cursor-pointer"
                    style={{ color: currentTheme.glow }}
                  >
                    Sign In to Console &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Security Note at bottom of card */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Bcrypt 10-Salt • JWT Session</span>
              <span>Resend 6-Digit OTP</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-30 p-4 text-center text-xs font-mono text-zinc-600">
        <span>
          Admin Console • Pull cord to illuminate • Normal tab switching enabled
        </span>
      </footer>
    </div>
  );
}

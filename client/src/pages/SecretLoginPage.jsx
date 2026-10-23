import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";
import HangingLamp from "../components/HangingLamp";
import { LOGIN_THEMES } from "../components/loginThemes";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(() => {
    return localStorage.getItem("secret_login_theme") || "amber";
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const from = location.state?.from?.pathname || "/admin";

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setError,
    login,
    logout,
  } = useAuth();

  const currentTheme =
    LOGIN_THEMES.find((t) => t.id === selectedThemeId) || LOGIN_THEMES[0];

  const handleThemeChange = (id) => {
    setSelectedThemeId(id);
    localStorage.setItem("secret_login_theme", id);
  };

  // Client-side form validation
  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await login(email, password, rememberMe);
    if (res.success) {
      navigate(from, { replace: true });
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

      {/* Top Bar: Return Link, 5-Color Theme Switcher, & Light Status indicator */}
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
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono font-medium text-zinc-400 backdrop-blur-md transition hover:border-zinc-700 hover:text-zinc-200"
          >
            <UserPlus size={13} />
            <span className="hidden sm:inline">Register Admin</span>
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

        {/* Ambient status pill */}
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

      {/* Main Content Area: Left Lamp & Right Login Panel */}
      <main className="relative z-30 flex-1 flex flex-col md:flex-row items-center md:items-center justify-around px-4 sm:px-8 lg:px-16 py-6 gap-8 max-w-7xl mx-auto w-full">
        {/* Left: The Interactive Desk Lamp with Freeform Drag & Auto-Snap */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <HangingLamp
            isLightOn={isLightOn}
            onToggle={() => setIsLightOn((prev) => !prev)}
            theme={currentTheme}
          />
        </div>

        {/* Right: The Secret Login Panel (Smoothly revealed when light is ON) */}
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out transform ${
            isLightOn
              ? "opacity-100 translate-y-0 scale-100 filter-none pointer-events-auto"
              : "opacity-0 translate-y-6 scale-95 blur-md pointer-events-none"
          }`}
        >
          {/* Main Card Surface with Dynamic Theme Glow */}
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

            {!isAuthenticated ? (
              /* ============================================================ */
              /* STATE 1: LOGIN FORM                                          */
              /* ============================================================ */
              <div>
                {/* Header Badge & Title */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border ${currentTheme.badge} px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider mb-3 shadow-2xs`}
                  >
                    <ShieldCheck size={12} className={currentTheme.badgeIcon} />
                    <span>Restricted • Portfolio Console</span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Admin Sign In</span>
                    <KeyRound size={18} className={currentTheme.accentText} />
                  </h1>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Authenticate to access the administrative dashboard, project
                    telemetry, and private builder presets.
                  </p>
                </div>

                {/* Registration Success Banner */}
                {location.state?.message && (
                  <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{location.state.message}</span>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                    <p>{error}</p>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
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
                            setValidationErrors((prev) => ({
                              ...prev,
                              email: "",
                            }));
                          }
                          if (error) setError("");
                        }}
                        placeholder="Enter your email address"
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
                            setValidationErrors((prev) => ({
                              ...prev,
                              password: "",
                            }));
                          }
                          if (error) setError("");
                        }}
                        placeholder="••••••••••••"
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
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Register Quick Link */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="size-3.5 rounded border-zinc-800 bg-zinc-950 focus:ring-1"
                        style={{ accentColor: currentTheme.accent }}
                      />
                      <span>Keep session active</span>
                    </label>

                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1 font-mono text-[11px] hover:underline cursor-pointer"
                      style={{ color: currentTheme.glow }}
                      title="Register a new administrator account"
                    >
                      <UserPlus size={11} />
                      <span>Register new account</span>
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} px-4 py-2.5 text-xs font-bold shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer transition`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={14} />
                        <span>Sign In to Console</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Register Callout */}
                <div className="mt-4 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
                  <span>First time setting up? </span>
                  <Link
                    to="/register"
                    className="font-medium hover:underline transition"
                    style={{ color: currentTheme.glow }}
                  >
                    Verify email & register with OTP &rarr;
                  </Link>
                </div>

                {/* Footer security note */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>AES-256 Auth</span>
                  <span>IP Logged</span>
                </div>
              </div>
            ) : (
              /* ============================================================ */
              /* STATE 2: AUTHENTICATED ADMIN DASHBOARD VIEW                  */
              /* ============================================================ */
              <div>
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-4">
                  <div className="size-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{user?.name || "Ashish Sahu"}</span>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                        Admin Active
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      {user?.role || "Portfolio Owner"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 text-xs">
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Session Token:</span>
                      <span
                        className="font-mono text-[10px]"
                        style={{ color: currentTheme.glow }}
                      >
                        {user?.token
                          ? `${user.token.slice(0, 16)}...`
                          : "Active"}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Access Level:</span>
                      <span className="font-mono text-zinc-300">
                        Root / Full Stack Engineer
                      </span>
                    </div>
                  </div>

                  {/* Primary Enter Admin Dashboard Button */}
                  <Link
                    to="/admin/home"
                    className={`w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.buttonBg} ${currentTheme.buttonShadow} p-2.5 text-xs font-bold shadow-md transition`}
                  >
                    <LayoutDashboard size={14} />
                    <span>Enter Admin Dashboard</span>
                  </Link>

                  {/* Quick Admin Actions */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      to="/resume-builder"
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850 transition"
                    >
                      <FileText
                        size={14}
                        style={{ color: currentTheme.glow }}
                      />
                      <span>Resume Builder</span>
                    </Link>

                    <Link
                      to="/"
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850 transition"
                    >
                      <ExternalLink size={14} className="text-blue-400" />
                      <span>Live Site</span>
                    </Link>
                  </div>
                </div>

                {/* Lock / Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 p-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:border-red-500/50 cursor-pointer transition"
                >
                  <Lock size={14} />
                  <span>Lock & Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="relative z-30 p-4 text-center text-xs font-mono text-zinc-600">
        <span>
          Hidden Admin Terminal • Drag unlit lamp anywhere • Pull cord to illuminate
        </span>
      </footer>
    </div>
  );
}

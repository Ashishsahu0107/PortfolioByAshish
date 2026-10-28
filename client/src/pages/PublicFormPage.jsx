import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  Upload,
  AlertCircle,
  Clock,
  Sparkles,
  Paperclip,
  X,
} from "lucide-react";
import { formsApi } from "../services/api";
import { showToast, toast } from "../utils/toast";

export default function PublicFormPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form values state
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const fileInputRefs = useRef({});

  const loadForm = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    try {
      const data = await formsApi.getById(slug);
      if (data) {
        setForm(data);
        // Initialize default empty values
        const initial = {};
        (data.fields || []).forEach((f) => {
          if (f.type === "checkbox") {
            initial[f.name] = false;
          } else {
            initial[f.name] = "";
          }
        });
        setValues(initial);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const handleInputChange = (fieldName, val) => {
    setValues((prev) => ({ ...prev, [fieldName]: val }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleFileChange = (fieldName, file) => {
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].value = "";
    }
  };

  const validate = () => {
    if (!form || !form.fields) return {};
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const f of form.fields) {
      const val = values[f.name];
      const file = files[f.name];

      if (f.required) {
        if (f.type === "file") {
          if (!file) {
            errors[f.name] = `${f.label || f.name} is required. Please attach a file.`;
          }
        } else if (f.type === "checkbox") {
          if (!val) {
            errors[f.name] = `${f.label || f.name} must be accepted.`;
          }
        } else if (val === undefined || val === null || !String(val).trim()) {
          errors[f.name] = `${f.label || f.name} is required.`;
        }
      }

      // Format validations
      if (val && typeof val === "string" && val.trim()) {
        if (f.type === "email" && !emailRegex.test(val.trim())) {
          errors[f.name] = "Please enter a valid email address.";
        }
        if (f.type === "phone") {
          const digits = val.replace(/\D/g, "");
          if (digits.length < 7) {
            errors[f.name] = "Please enter a valid phone number (at least 7 digits).";
          }
        }
        if (f.type === "date") {
          if (isNaN(Date.parse(val))) {
            errors[f.name] = "Please select a valid date.";
          }
        }
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !form) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      showToast.error(firstError);
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your response...", { id: "form-submit" });

    try {
      // Check if we need multipart form data (if files exist)
      const hasFiles = Object.keys(files).length > 0;
      let payload;

      if (hasFiles) {
        payload = new FormData();
        Object.entries(values).forEach(([k, v]) => {
          payload.append(k, typeof v === "boolean" ? String(v) : v || "");
        });
        Object.entries(files).forEach(([k, file]) => {
          if (file) {
            payload.append(k, file);
          }
        });
      } else {
        payload = { ...values };
      }

      const res = await formsApi.submit(form.slug || form.id, payload);

      // Reset form only on successful submission
      const reset = {};
      (form.fields || []).forEach((f) => {
        reset[f.name] = f.type === "checkbox" ? false : "";
      });
      setValues(reset);
      setFiles({});
      setFieldErrors({});
      setSubmitted(true);
      setSubmissionId(res?.submissionId || "");

      toast.success(
        res?.message || form.successMessage || "Your submission has been received successfully!",
        { id: toastId }
      );
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Failed to submit form. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#00f0ff]" />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Loading Form...</span>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !form) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-800 bg-[#121217] text-center shadow-2xl">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle size={22} />
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Form Not Found</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            The requested form &quot;{slug}&quot; could not be found or may have been deleted.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-sm border border-[#00f0ff] bg-[#00f0ff]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#09090b] transition-all no-underline"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  // Unpublished / Closed state
  if (!form.enabled) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-800 bg-[#121217] text-center shadow-2xl">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={22} />
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">{form.name}</h2>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
            Submissions Closed
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            This form is currently paused and not accepting new responses. Please check back later or reach out directly.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 rounded-sm border border-[#00f0ff] bg-[#00f0ff]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#09090b] transition-all no-underline"
          >
            <ArrowLeft size={14} />
            <span>Contact Ashish Directly</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#09090b] text-[#f4f4f5] ${isEmbed ? "p-4" : "py-12 sm:py-16 px-4 sm:px-6 lg:px-8"}`}>
      <div className="max-w-2xl mx-auto">
        {/* Back navigation header (hidden in embed mode) */}
        {!isEmbed && (
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[#00f0ff] transition-colors no-underline"
            >
              <ArrowLeft size={14} />
              <span>Back to Portfolio</span>
            </Link>
            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#00f0ff]" />
              <span>Interactive Portfolio Form</span>
            </span>
          </div>
        )}

        {/* Main Form Card Container */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121217] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-80" />

          {submitted ? (
            /* Success confirmation screen */
            <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-200">
              <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={32} />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                Response Received
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto mb-6">
                {form.successMessage || "Thank you! Your response has been securely saved to the database."}
              </p>
              {submissionId && (
                <div className="font-mono text-[11px] text-zinc-500 mb-8">
                  Submission ID: <span className="text-zinc-300">{submissionId}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmissionId("");
                  }}
                  className="inline-flex items-center gap-2 rounded-sm border border-[#00f0ff] bg-[#00f0ff]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#09090b] transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>Submit Another Response</span>
                </button>
                {!isEmbed && (
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-800/80 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition-all no-underline"
                  >
                    <span>Return to Home</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Active Form Inputs */
            <div>
              {/* Header */}
              <div className="mb-8 border-b border-zinc-800/80 pb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  {form.name}
                </h1>
                {form.description && (
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                    {form.description}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {(form.fields || []).map((f) => {
                  const error = fieldErrors[f.name];
                  const val = values[f.name];

                  return (
                    <div key={f.id || f.name} className="space-y-1.5">
                      {/* Label & Required indicator */}
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`field_${f.name}`}
                          className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-300"
                        >
                          {f.label || f.name} {f.required && <span className="text-[#00f0ff]">*</span>}
                        </label>
                        {error && (
                          <span className="font-mono text-[10px] text-red-400 flex items-center gap-1">
                            <AlertCircle size={10} />
                            {error}
                          </span>
                        )}
                      </div>

                      {/* Helper hint */}
                      {f.helpText && (
                        <p className="text-[11px] text-zinc-400 font-sans leading-normal">
                          {f.helpText}
                        </p>
                      )}

                      {/* Field Renderers by Type */}

                      {/* 1. TEXT, PHONE, NUMBER */}
                      {(f.type === "text" || f.type === "phone" || f.type === "tel" || f.type === "number") && (
                        <input
                          id={`field_${f.name}`}
                          type={f.type === "phone" || f.type === "tel" ? "tel" : f.type === "number" ? "number" : "text"}
                          placeholder={f.placeholder || `Enter your ${f.label.toLowerCase()}...`}
                          value={val || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          disabled={submitting}
                          className={`w-full rounded-md border bg-[#09090b] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors ${
                            error
                              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                              : "border-zinc-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        />
                      )}

                      {/* 2. EMAIL */}
                      {f.type === "email" && (
                        <input
                          id={`field_${f.name}`}
                          type="email"
                          autoComplete="email"
                          placeholder={f.placeholder || "jane@example.com"}
                          value={val || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          disabled={submitting}
                          className={`w-full rounded-md border bg-[#09090b] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors ${
                            error
                              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                              : "border-zinc-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        />
                      )}

                      {/* 3. TEXTAREA */}
                      {f.type === "textarea" && (
                        <textarea
                          id={`field_${f.name}`}
                          rows={4}
                          placeholder={f.placeholder || "Type your detailed message or project brief..."}
                          value={val || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          disabled={submitting}
                          className={`w-full rounded-md border bg-[#09090b] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-colors resize-y ${
                            error
                              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                              : "border-zinc-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        />
                      )}

                      {/* 4. DATE */}
                      {f.type === "date" && (
                        <input
                          id={`field_${f.name}`}
                          type="date"
                          value={val || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          disabled={submitting}
                          className={`w-full rounded-md border bg-[#09090b] px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors ${
                            error
                              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                              : "border-zinc-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        />
                      )}

                      {/* 5. DROPDOWN (SELECT) */}
                      {f.type === "dropdown" && (
                        <select
                          id={`field_${f.name}`}
                          value={val || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          disabled={submitting}
                          className={`w-full rounded-md border bg-[#09090b] px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors ${
                            error
                              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                              : "border-zinc-800 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <option value="" className="text-zinc-500">
                            {f.placeholder || "-- Select an option --"}
                          </option>
                          {(f.options || []).map((opt, i) => (
                            <option key={i} value={typeof opt === "object" ? opt.value : opt}>
                              {typeof opt === "object" ? opt.label : opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* 6. RADIO GROUP */}
                      {f.type === "radio" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {(f.options || []).map((opt, i) => {
                            const optVal = typeof opt === "object" ? opt.value : opt;
                            const optLabel = typeof opt === "object" ? opt.label : opt;
                            const isChecked = val === optVal;
                            return (
                              <label
                                key={i}
                                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-[#00f0ff]/10 border-[#00f0ff] text-white"
                                    : "bg-[#09090b] border-zinc-800 text-zinc-300 hover:border-zinc-700"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`radio_${f.name}`}
                                  value={optVal}
                                  checked={isChecked}
                                  onChange={() => handleInputChange(f.name, optVal)}
                                  disabled={submitting}
                                  className="w-4 h-4 accent-[#00f0ff]"
                                />
                                <span className="text-xs font-medium">{optLabel}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* 7. CHECKBOX */}
                      {f.type === "checkbox" && (
                        <label className="flex items-start gap-3 p-3.5 rounded-lg border border-zinc-800 bg-[#09090b] cursor-pointer hover:border-zinc-700 transition-colors">
                          <input
                            id={`field_${f.name}`}
                            type="checkbox"
                            checked={Boolean(val)}
                            onChange={(e) => handleInputChange(f.name, e.target.checked)}
                            disabled={submitting}
                            className="mt-0.5 w-4 h-4 rounded accent-[#00f0ff] cursor-pointer"
                          />
                          <div className="flex-1 text-xs text-zinc-300 font-medium select-none">
                            {f.placeholder || f.label || "I confirm and agree."}
                          </div>
                        </label>
                      )}

                      {/* 8. FILE UPLOAD */}
                      {f.type === "file" && (
                        <div>
                          <input
                            ref={(el) => (fileInputRefs.current[f.name] = el)}
                            id={`field_${f.name}`}
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 10 * 1024 * 1024) {
                                  showToast.error("File size cannot exceed 10MB.");
                                  e.target.value = "";
                                  return;
                                }
                                handleFileChange(f.name, file);
                              }
                            }}
                            disabled={submitting}
                            className="hidden"
                          />

                          {files[f.name] ? (
                            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Paperclip size={16} className="text-emerald-400 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-mono font-semibold text-zinc-200 truncate m-0">
                                    {files[f.name].name}
                                  </p>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    {(files[f.name].size / (1024 * 1024)).toFixed(2)} MB
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(f.name)}
                                disabled={submitting}
                                className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Remove file"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor={`field_${f.name}`}
                              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed bg-[#09090b] hover:bg-zinc-900/50 cursor-pointer transition-all ${
                                error ? "border-red-500/80" : "border-zinc-800 hover:border-[#00f0ff]/60"
                              }`}
                            >
                              <Upload size={20} className="text-zinc-400" />
                              <div className="text-center">
                                <span className="text-xs font-mono font-medium text-[#00f0ff]">
                                  Choose file to upload
                                </span>
                                <span className="text-xs text-zinc-500 block mt-0.5">
                                  PDF, DOC, Images, Zip (Max 10MB)
                                </span>
                              </div>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Submit Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-sm border border-[#00f0ff] bg-[#00f0ff] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#09090b] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-[#00f0ff]/90 hover:shadow-[0_0_28px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#09090b]" />
                        <span>Submitting Response...</span>
                      </>
                    ) : (
                      <>
                        <span>{form.submitButtonText || "Submit Inquiry"}</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        {!isEmbed && (
          <div className="mt-8 text-center text-[11px] font-mono text-zinc-500">
            Secure submission managed by Ashish Sahu Portfolio Platform &bull; All responses saved directly to database
          </div>
        )}
      </div>
    </div>
  );
}

import { toast as sonnerToast } from "sonner";

/**
 * Re-export native Sonner toast alongside helper utilities
 */
export const toast = sonnerToast;

/**
 * Standardized, robust toast dispatcher that extracts API error details
 */
export const showToast = {
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      duration: 4000,
      ...options,
    });
  },

  error: (error, fallback = "An unexpected error occurred.", options = {}) => {
    let message = fallback;
    if (typeof error === "string") {
      message = error;
    } else if (error?.data?.message) {
      message = error.data.message;
    } else if (error?.message) {
      message = error.message;
    }
    return sonnerToast.error(message, {
      duration: 5000,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return sonnerToast.loading(message, options);
  },

  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      duration: 4000,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      duration: 4500,
      ...options,
    });
  },

  promise: (promise, { loading, success, error }) => {
    return sonnerToast.promise(promise, {
      loading: loading || "Processing request...",
      success: (data) => {
        if (typeof success === "function") return success(data);
        return success || "Operation completed successfully.";
      },
      error: (err) => {
        if (typeof error === "function") return error(err);
        return err?.data?.message || err?.message || error || "Operation failed.";
      },
    });
  },

  dismiss: (id) => sonnerToast.dismiss(id),
};

export default showToast;

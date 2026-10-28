const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const API_BASE = isLocalHost
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "https://portfoliobyashish.onrender.com/api");
const AUTH_STORAGE_KEY = "portfolio_admin_session_v1";

/**
 * Get active auth token from storage
 */
export function getStoredToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || data?.errors?.join(", ") || `HTTP ${response.status}: Request failed`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    // Trigger instant real-time synchronization across all portfolio components & tabs
    const method = (options.method || "GET").toUpperCase();
    if (method !== "GET" && typeof window !== "undefined") {
      const eventDetail = { endpoint, method, timestamp: Date.now() };
      window.dispatchEvent(new CustomEvent("portfolio_updated", { detail: eventDetail }));
      try {
        localStorage.setItem("portfolio_sync_timestamp", String(Date.now()));
      } catch {}
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      console.warn(`[API] Unable to reach backend server at ${url}. Is it running on port 5000?`);
      const networkErr = new Error("Unable to connect to backend server. Please verify your network connection or server status.");
      networkErr.status = 0;
      throw networkErr;
    }
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
export const authApi = {
  sendOtp: async (nameOrPayload, maybeEmail) => {
    let name = "";
    let email = "";
    if (typeof nameOrPayload === "object" && nameOrPayload !== null) {
      name = nameOrPayload.name || "";
      email = nameOrPayload.email || "";
    } else if (typeof maybeEmail === "string") {
      name = nameOrPayload;
      email = maybeEmail;
    } else {
      email = nameOrPayload;
    }
    return request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        name: typeof name === "string" ? name.trim() : "",
        email: typeof email === "string" ? email.trim().toLowerCase() : "",
      }),
    });
  },
  verifyOtp: async (emailOrPayload, maybeOtp) => {
    let email = "";
    let otp = "";
    if (typeof emailOrPayload === "object" && emailOrPayload !== null) {
      email = emailOrPayload.email || "";
      otp = emailOrPayload.otp || "";
    } else {
      email = emailOrPayload;
      otp = maybeOtp;
    }
    return request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: typeof email === "string" ? email.trim().toLowerCase() : "",
        otp: String(otp || "").trim(),
      }),
    });
  },
  register: async (payload) => {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        email: payload.email ? String(payload.email).trim().toLowerCase() : "",
      }),
    });
  },
  login: async (email, password) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  me: async () => {
    return request("/auth/me");
  },
  changePassword: async (currentPassword, newPassword) => {
    return request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// -------------------------------------------------------------
// Developer / Hero API
// -------------------------------------------------------------
export const developerApi = {
  get: async () => {
    const res = await request("/developer");
    return res.data;
  },
  update: async (payload) => {
    const res = await request("/developer", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
};

// -------------------------------------------------------------
// About API
// -------------------------------------------------------------
export const aboutApi = {
  get: async () => {
    const res = await request("/about");
    return res.data;
  },
  update: async (payload) => {
    const res = await request("/about", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
};

// -------------------------------------------------------------
// Skills API
// -------------------------------------------------------------
export const skillsApi = {
  get: async () => {
    const res = await request("/skills");
    return res.data;
  },
  update: async (categories) => {
    const res = await request("/skills", {
      method: "PUT",
      body: JSON.stringify(categories),
    });
    return res;
  },
};

// -------------------------------------------------------------
// Projects API
// -------------------------------------------------------------
export const projectsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/projects${query ? `?${query}` : ""}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await request(`/projects/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await request("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  update: async (id, payload) => {
    const res = await request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  bulkSave: async (projects) => {
    const res = await request("/projects", {
      method: "PUT",
      body: JSON.stringify(projects),
    });
    return res;
  },
  delete: async (id) => {
    const res = await request(`/projects/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};

// -------------------------------------------------------------
// Experience API
// -------------------------------------------------------------
export const experienceApi = {
  getAll: async (type) => {
    const endpoint = type ? `/experience?type=${encodeURIComponent(type)}` : "/experience";
    const res = await request(endpoint);
    return res.data;
  },
  getById: async (id) => {
    const res = await request(`/experience/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await request("/experience", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  update: async (id, payload) => {
    const res = await request(`/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  bulkSave: async (list) => {
    const res = await request("/experience", {
      method: "PUT",
      body: JSON.stringify(list),
    });
    return res;
  },
  delete: async (id) => {
    const res = await request(`/experience/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};

// -------------------------------------------------------------
// Dynamic Sections API
// -------------------------------------------------------------
export const sectionsApi = {
  getAll: async (all = false) => {
    const res = await request(`/sections${all ? "?all=true" : ""}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await request(`/sections/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await request("/sections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  update: async (id, payload) => {
    const res = await request(`/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  bulkSave: async (sections) => {
    const res = await request("/sections", {
      method: "PUT",
      body: JSON.stringify(sections),
    });
    return res;
  },
  delete: async (id) => {
    const res = await request(`/sections/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};

// -------------------------------------------------------------
// Form Builder & Submissions API
// -------------------------------------------------------------
export const formsApi = {
  getAll: async () => {
    const res = await request("/forms");
    return res.data;
  },
  getById: async (id) => {
    const res = await request(`/forms/${id}`);
    return res.data;
  },
  create: async (payload) => {
    const res = await request("/forms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  duplicate: async (id) => {
    const res = await request(`/forms/${id}/duplicate`, {
      method: "POST",
    });
    return res;
  },
  update: async (id, payload) => {
    const res = await request(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  delete: async (id) => {
    const res = await request(`/forms/${id}`, {
      method: "DELETE",
    });
    return res;
  },
  submit: async (idOrSlug, formData) => {
    const isFormData = typeof FormData !== "undefined" && formData instanceof FormData;
    const res = await request(`/forms/${idOrSlug}/submit`, {
      method: "POST",
      body: isFormData ? formData : JSON.stringify(formData),
    });
    return res;
  },
  getSubmissions: async (formId) => {
    const res = await request(`/forms/${formId}/submissions`);
    return res.data;
  },
  getAllSubmissions: async () => {
    const res = await request("/forms/submissions/all");
    return res.data;
  },
  deleteSubmission: async (submissionId) => {
    const res = await request(`/forms/submissions/${submissionId}`, {
      method: "DELETE",
    });
    return res;
  },
};

// -------------------------------------------------------------
// Contact & Messages API
// -------------------------------------------------------------
export const contactApi = {
  getInfo: async () => {
    const res = await request("/contact");
    return res.data;
  },
  updateInfo: async (payload) => {
    const res = await request("/contact", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  sendMessage: async (payload) => {
    const res = await request("/contact/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  getMessages: async () => {
    const res = await request("/contact/messages");
    return res;
  },
  markRead: async (id, read = true) => {
    const res = await request(`/contact/messages/${id}/read`, {
      method: "PUT",
      body: JSON.stringify({ read }),
    });
    return res;
  },
  deleteMessage: async (id) => {
    const res = await request(`/contact/messages/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};

// -------------------------------------------------------------
// Overview Telemetry API
// -------------------------------------------------------------
export const overviewApi = {
  get: async () => {
    const res = await request("/overview");
    return res.data;
  },
};

// -------------------------------------------------------------
// Resume Templates & Approved Portfolio Resume API
// -------------------------------------------------------------
export const resumeApi = {
  getApproved: async () => {
    const res = await request("/resumes/approved");
    return res.data;
  },
  getAll: async () => {
    const res = await request("/resumes");
    return res.data;
  },
  getById: async (templateId) => {
    const res = await request(`/resumes/${templateId}`);
    return res.data;
  },
  approve: async (templateId, resumeData) => {
    const res = await request("/resumes/approve", {
      method: "POST",
      body: JSON.stringify({ templateId, resumeData }),
    });
    return res;
  },
  update: async (templateId, updates) => {
    const res = await request(`/resumes/${templateId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return res;
  },
  validateDownload: async (templateId) => {
    const res = await request(
      `/resumes/download${templateId ? `?templateId=${encodeURIComponent(templateId)}` : ""}`
    );
    return res.data;
  },
  getDownloadUrl: (templateId) => {
    return `${API_BASE}/resumes/download${templateId ? `?templateId=${encodeURIComponent(templateId)}` : ""}`;
  },
};


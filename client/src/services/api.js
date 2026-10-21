const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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

  const headers = {
    "Content-Type": "application/json",
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

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      console.warn(`[API] Unable to reach backend server at ${url}. Is it running on port 5000?`);
    }
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
export const authApi = {
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
    const res = await request(`/forms/${idOrSlug}/submit`, {
      method: "POST",
      body: JSON.stringify(formData),
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

// js/adminApi.js

const getAdminBaseUrl = () => {
  const root = (typeof CONFIG !== "undefined" && (CONFIG.API_URL || CONFIG.BASE_URL))
    ? (CONFIG.API_URL || CONFIG.BASE_URL)
    : "https://ayax-data-xpress-server.vercel.app/api/v1";
  return `${root}/admin`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken") || localStorage.getItem("token") || "";
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "index.html";
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

// 1. Track Transaction
export const trackTx = async (id) => {
  const response = await fetch(`${getAdminBaseUrl()}/track/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// 2. Debit User
export const debitUser = async (payload) => {
  const response = await fetch(`${getAdminBaseUrl()}/debit-user`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

// 3. Resolve Dispute / Issue
export const resolveIssue = async (payload) => {
  const response = await fetch(`${getAdminBaseUrl()}/handle-report`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
};

// 4. Get All Support Reports
export const getAllReports = async () => {
  const response = await fetch(`${getAdminBaseUrl()}/all-reports`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// Haɗawa kai tsaye a window don kowane shafin HTML ya samu dama
const AdminAPI = {
  trackTx,
  debitUser,
  resolveIssue,
  getAllReports
};

if (typeof window !== "undefined") {
  window.AdminAPI = AdminAPI;
  window.trackTx = trackTx;
  window.debitUser = debitUser;
  window.resolveIssue = resolveIssue;
  window.getAllReports = getAllReports;
}

export default AdminAPI;
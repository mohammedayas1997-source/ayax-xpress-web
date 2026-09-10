// js/config.js

const API_CONFIG = {
  API_URL: "https://ayax-data-xpress-server.vercel.app/api/v1",
  BASE_URL: "https://ayax-data-xpress-server.vercel.app/api/v1",
  FALLBACK_URL: "https://ayax-data-xpress-server.onrender.com/api/v1",
  TIMEOUT: 20000,
};

// 1. Bayar da dama kai tsaye a Browser (Global Scope)
if (typeof window !== "undefined") {
  window.CONFIG = API_CONFIG;
  window.API_URL = API_CONFIG.API_URL;
  window.BASE_URL = API_CONFIG.BASE_URL;
}

// 2. Tallafi ga ES Modules (idan ana amfani da type="module" ko bundlers)
export const API_URL = API_CONFIG.API_URL;
export const BASE_URL = API_CONFIG.BASE_URL;
export default API_CONFIG;
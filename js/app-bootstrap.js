/**
 * Ayax Xpress Web Ecosystem Bootstrap
 * Mirrors React Native App.js Navigation Container, Stack & Drawer Hierarchy
 */

(function (window, document) {
  "use strict";

  const APP_CONFIG = {
    appName: "Ayax Xpress",
    version: "2.0.1",
    defaultPublicRoute: "index.html",
    defaultUserRoute: "home.html",
  };

  // Complete registry mirroring Stack & Drawer Navigators
  const APP_ROUTES = {
    // Auth & Onboarding
    Onboarding: "onboarding.html",
    Login: "index.html",
    Signup: "signup.html",
    ForgotPassword: "forgot-password.html",
    Success: "success.html",

    // Drawer / Primary Screens
    Dashboard: "home.html",
    HomeScreen: "home.html",
    AgentDashboard: "agent-dashboard.html",
    "Wallet History": "wallet-history.html",
    History: "wallet-history.html",
    "BVN History": "bvn-history.html",
    BVNHistory: "bvn-history.html",
    "NIMC History": "nimc-history.html",
    NIMCHistory: "nimc-history.html",
    Settings: "settings.html",

    // Administrative & Hierarchy Dashboards
    SuperAdminDashboard: "superadmin-dashboard.html",
    SuperAdminUsers: "manage-roles.html",
    AdminDashboard: "admin-dashboard.html",
    AdminControl: "admin-control.html",
    NsdDashboard: "nsd-dashboard.html",
    LeaderDashboard: "leader-dashboard.html",
    SupervisorDashboard: "supervisor-dashboard.html",
    SupportDashboard: "support-dashboard.html",

    // Team, Agents & Targets
    AssignTarget: "assign-target.html",
    CreateSupervisor: "create-supervisor.html",
    ManageAgents: "manage-agents.html",
    AgentTransfer: "agent-transfer.html",

    // Financial & Utility Services
    BuyAirtime: "buy-airtime.html",
    FundWallet: "fund-wallet.html",
    BuyData: "buy-data.html",
    Electricity: "electricity.html",
    Cable: "cable.html",

    // Identity Verification & NIMC Suite
    NIMC: "nimc-screen.html",
    BVNScreen: "bvn-screen.html",
    NIMCRequests: "nimc-requests.html",
    NIMCModification: "nimc-modification.html",
    NINValidation: "nin-verification-service.html",

    // System Utilities & Policy
    Profile: "profile.html",
    Contact: "contact.html",
    Notifications: "notifications.html",
    UpdatePin: "update-pin.html",
    About: "about.html",
    PrivacyPolicy: "privacy-policy.html",
    Terms: "terms.html",
  };

  // Role hierarchies defining access clearance
  const ROUTE_PERMISSIONS = {
    "superadmin-dashboard.html": ["superadmin"],
    "manage-roles.html": ["superadmin"],
    "admin-dashboard.html": ["superadmin", "admin"],
    "admin-control.html": ["superadmin", "admin"],
    "nimc-requests.html": ["superadmin", "admin"],
    "nsd-dashboard.html": ["superadmin", "nsd", "national_sales_director"],
    "leader-dashboard.html": ["superadmin", "leader", "state_manager"],
    "supervisor-dashboard.html": ["superadmin", "supervisor", "field_supervisor"],
    "support-dashboard.html": ["superadmin", "admin", "support", "support_desk"],
    "agent-dashboard.html": ["superadmin", "agent"],
    "manage-agents.html": ["superadmin", "supervisor", "leader", "nsd"],
    "create-supervisor.html": ["superadmin", "nsd", "leader"],
    "assign-target.html": ["superadmin", "nsd", "leader"],
  };

  const PUBLIC_PAGES = [
    "index.html",
    "signup.html",
    "onboarding.html",
    "forgot-password.html",
    "terms.html",
    "privacy-policy.html",
    "about.html",
  ];

  const AppBootstrap = {
    // 1. Initialize core system on DOMContentLoaded
    init() {
      this.syncTheme();
      this.enforceAccessControl();
      this.setupGlobalNavigationListeners();
    },

    // 2. Synchronize Theme from LocalStorage matching ThemeProvider
    syncTheme() {
      const savedTheme = localStorage.getItem("ayax_theme") || "dark";
      const isDark = savedTheme === "dark";

      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
    },

    // 3. User Role & Auth Validation Guard
    getCurrentUser() {
      try {
        const raw = localStorage.getItem("userData");
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    getToken() {
      return localStorage.getItem("userToken") || localStorage.getItem("token") || "";
    },

    enforceAccessControl() {
      const path = window.location.pathname;
      const currentPage = path.substring(path.lastIndexOf("/") + 1) || "index.html";

      // If viewing public screens, allow passage
      if (PUBLIC_PAGES.includes(currentPage)) {
        return;
      }

      const token = this.getToken();
      if (!token) {
        window.location.replace("index.html");
        return;
      }

      const user = this.getCurrentUser();
      const role = String(user?.role || "user").toLowerCase().trim();

      // Check role permissions on restricted screens
      const requiredRoles = ROUTE_PERMISSIONS[currentPage];
      if (requiredRoles && !requiredRoles.includes(role)) {
        alert("Access Clearance Denied: Your account role lacks permission for this console.");
        this.redirectToRoleHome(role);
      }
    },

    // 4. Redirect helper based on hierarchy role
    redirectToRoleHome(role) {
      const normalizedRole = String(role || "").toLowerCase().trim();
      switch (normalizedRole) {
        case "superadmin":
          window.location.replace("superadmin-dashboard.html");
          break;
        case "admin":
          window.location.replace("admin-dashboard.html");
          break;
        case "nsd":
        case "national_sales_director":
          window.location.replace("nsd-dashboard.html");
          break;
        case "leader":
        case "state_manager":
          window.location.replace("leader-dashboard.html");
          break;
        case "supervisor":
        case "field_supervisor":
          window.location.replace("supervisor-dashboard.html");
          break;
        case "support":
          window.location.replace("support-dashboard.html");
          break;
        case "agent":
          window.location.replace("agent-dashboard.html");
          break;
        default:
          window.location.replace("home.html");
          break;
      }
    },

    // 5. Native Navigation Methods mirroring React Navigation
    navigate(routeName, params = {}) {
      const targetHtml = APP_ROUTES[routeName] || routeName;
      if (!targetHtml) {
        console.error(`Route "${routeName}" not registered in APP_ROUTES.`);
        return;
      }

      const query = new URLSearchParams(params).toString();
      const finalUrl = query ? `${targetHtml}?${query}` : targetHtml;
      window.location.href = finalUrl;
    },

    replace(routeName, params = {}) {
      const targetHtml = APP_ROUTES[routeName] || routeName;
      if (!targetHtml) return;

      const query = new URLSearchParams(params).toString();
      const finalUrl = query ? `${targetHtml}?${query}` : targetHtml;
      window.location.replace(finalUrl);
    },

    goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const user = this.getCurrentUser();
        this.redirectToRoleHome(user?.role);
      }
    },

    getRouteParams() {
      const searchParams = new URLSearchParams(window.location.search);
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
      return params;
    },

    setupGlobalNavigationListeners() {
      window.addEventListener("storage", (e) => {
        if (e.key === "ayax_theme") {
          this.syncTheme();
        }
        if (e.key === "userToken" && !e.newValue) {
          window.location.replace("index.html");
        }
      });
    },
  };

  // Expose to window global scope
  window.AppBootstrap = AppBootstrap;
  window.APP_ROUTES = APP_ROUTES;
  window.navigate = (name, params) => AppBootstrap.navigate(name, params);
  window.getRouteParams = () => AppBootstrap.getRouteParams();

  document.addEventListener("DOMContentLoaded", () => {
    AppBootstrap.init();
  });
})(window, document);
// js/router.js

const ROUTES = {
  // Authentication & Public Pages
  Login: "index.html",
  Signup: "signup.html",
  Success: "success.html",
  Terms: "terms.html",
  PrivacyPolicy: "privacy-policy.html",
  About: "about.html",

  // Core Dashboards
  SuperAdminDashboard: "superadmin-dashboard.html",
  AdminDashboard: "admin-dashboard.html",
  SupervisorDashboard: "supervisor-dashboard.html",
  CustomerDashboard: "customer-dashboard.html",
  AgentDashboard: "agent-dashboard.html",
  NsdDashboard: "nsd-dashboard.html",
  SupportDashboard: "support-dashboard.html",

  // NIMC & Identity Verification Services
  UserNIMCHistory: "nimc-history.html",
  IdentityApplicationLogs: "identity-application-logs.html",
  NIMCVerification: "nimc-verification.html",
  NINValidation: "nin-validation.html",
  NINVerificationService: "nin-verification-service.html",
  NIMCModification: "nimc-modification.html",

  // Management & Audit
  ManageRoles: "manage-roles.html",
  ReassignAgents: "reassign-agents.html",
  SystemAudit: "system-audit.html",
  ServiceTracker: "service-tracker.html",
  Notifications: "notifications.html",
  Profile: "profile.html",
  UpdatePin: "update-pin.html",
};

const Router = {
  navigate(routeName, params = {}) {
    const targetFile = ROUTES[routeName];
    if (!targetFile) {
      console.error(`Route "${routeName}" not recognized.`);
      return;
    }

    const queryString = new URLSearchParams(params).toString();
    const finalUrl = queryString ? `${targetFile}?${queryString}` : targetFile;
    window.location.href = finalUrl;
  },

  replace(routeName, params = {}) {
    const targetFile = ROUTES[routeName];
    if (!targetFile) return;

    const queryString = new URLSearchParams(params).toString();
    const finalUrl = queryString ? `${targetFile}?${queryString}` : targetFile;
    window.location.replace(finalUrl);
  },

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = ROUTES.Login;
    }
  },

  // Directs users to their respective home dashboard based on role
  redirectToDashboard(role) {
    const normalizedRole = String(role || "").toLowerCase().trim();

    switch (normalizedRole) {
      case "superadmin":
        this.replace("SuperAdminDashboard");
        break;
      case "admin":
        this.replace("AdminDashboard");
        break;
      case "supervisor":
      case "field_supervisor":
        this.replace("SupervisorDashboard");
        break;
      case "national_sales_director":
      case "super_leader":
        this.replace("NsdDashboard");
        break;
      case "support":
      case "support_desk":
        this.replace("SupportDashboard");
        break;
      case "agent":
      case "reseller":
        this.replace("AgentDashboard");
        break;
      default:
        this.replace("CustomerDashboard");
        break;
    }
  },

  // Guard to ensure unauthorized users cannot access restricted pages
  requireAuth(allowedRoles = []) {
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      this.replace("Login");
      return false;
    }

    if (allowedRoles.length > 0) {
      let userRole = "user";
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
        userRole = String(storedUser.role || "user").toLowerCase();
      } catch (_) {}

      const isPermitted = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);
      if (!isPermitted) {
        alert("Access Denied: You do not have privilege to view this command console.");
        this.redirectToDashboard(userRole);
        return false;
      }
    }

    return true;
  },
};

// Global browser attachment
if (typeof window !== "undefined") {
  window.Router = Router;
  window.ROUTES = ROUTES;
}

export { Router, ROUTES };
export default Router;
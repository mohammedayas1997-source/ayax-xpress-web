// js/app.js

function openLogin() {
  var modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Cire duk wani jan layi na kuskuren rubutu
  var userInput = document.getElementById("userInput");
  var passInput = document.getElementById("passInput");
  if (userInput) {
    userInput.setAttribute("spellcheck", "false");
    userInput.setAttribute("autocorrect", "off");
    userInput.setAttribute("autocapitalize", "off");
  }
  if (passInput) {
    passInput.setAttribute("spellcheck", "false");
    passInput.setAttribute("autocorrect", "off");
    passInput.setAttribute("autocapitalize", "off");
  }
}

function closeLogin() {
  var modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

window.onclick = function (event) {
  var modal = document.getElementById("loginModal");
  if (event.target === modal) {
    closeLogin();
  }
};

async function doLogin() {
  var userInput = document.getElementById("userInput");
  var passInput = document.getElementById("passInput");
  var errEl = document.getElementById("loginError");
  var btn = document.getElementById("btnSubmit");

  var id = userInput ? userInput.value.trim() : "";
  var pass = passInput ? passInput.value.trim() : "";

  if (errEl) {
    errEl.style.display = "none";
    errEl.textContent = "";
  }

  if (!id || !pass) {
    if (errEl) {
      errEl.textContent = "Please enter your email/phone and password.";
      errEl.style.display = "block";
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Authenticating...";
  }

  try {
    var baseUrl = "https://ayax-data-xpress-server.onrender.com/api/v1";
    if (typeof CONFIG !== "undefined" && CONFIG.BASE_URL) {
      baseUrl = CONFIG.BASE_URL;
    }

    var payload = {
      identifier: id,
      email: id,
      phone: id,
      username: id,
      password: pass
    };

    var response = await fetch(baseUrl + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    var data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email/phone or password.");
    }

    var token = data.token || data.accessToken || (data.data && data.data.token) || "";
    var user = data.user || (data.data && data.data.user) || data;

    if (token) {
      localStorage.setItem("userToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      // Tura mutum zuwa dashboard gwargwadon matsayinsa
      var role = (user.role || (user.data && user.data.role) || "user").toLowerCase();
      if (role === "agent") {
        window.location.href = "agent-dashboard.html";
      } else if (role === "leader" || role === "state_manager") {
        window.location.href = "leader-dashboard.html";
      } else if (role === "supervisor") {
        window.location.href = "admin-control.html";
      } else if (role === "admin" || role === "superadmin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "customer-dashboard.html";
      }
    } else {
      throw new Error("No token returned from server.");
    }
  } catch (err) {
    if (errEl) {
      errEl.textContent = err.message || "Login failed. Please check your internet connection.";
      errEl.style.display = "block";
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Login to Dashboard";
    }
  }
}
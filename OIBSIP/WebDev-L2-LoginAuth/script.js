// Password Hashing via Web Crypto API (SHA-256)
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const regCard = document.getElementById("register-card");
const loginCard = document.getElementById("login-card");
const dashCard = document.getElementById("dashboard-card");

document.getElementById("to-login").onclick = () => { regCard.classList.add("hidden"); loginCard.classList.remove("hidden"); };
document.getElementById("to-reg").onclick = () => { loginCard.classList.add("hidden"); regCard.classList.remove("hidden"); };

// Check Active Session
const activeUser = sessionStorage.getItem("oibsip_session");
if (activeUser) {
  showDashboard(activeUser);
}

// Registration Logic
document.getElementById("reg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const errorEl = document.getElementById("reg-error");

  // Validate password (min 8 chars, at least 1 number)
  if (password.length < 8 || !/\d/.test(password)) {
    errorEl.innerText = "Password must be >= 8 chars and contain 1+ number.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("oibsip_users")) || {};
  if (users[username]) {
    errorEl.innerText = "Username/Email already exists.";
    return;
  }

  const hashedPassword = await hashPassword(password);
  users[username] = hashedPassword;
  localStorage.setItem("oibsip_users", JSON.stringify(users));

  errorEl.innerText = "";
  alert("Registration successful! Please login.");
  regCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
});

// Login Logic
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");

  const users = JSON.parse(localStorage.getItem("oibsip_users")) || {};
  const hashedPassword = await hashPassword(password);

  if (!users[username] || users[username] !== hashedPassword) {
    errorEl.innerText = "Invalid credentials entered.";
    return;
  }

  errorEl.innerText = "";
  sessionStorage.setItem("oibsip_session", username);
  showDashboard(username);
});

function showDashboard(username) {
  regCard.classList.add("hidden");
  loginCard.classList.add("hidden");
  dashCard.classList.remove("hidden");
  document.getElementById("user-display").innerText = username;
}

// Logout Logic
document.getElementById("logout-btn").onclick = () => {
  sessionStorage.removeItem("oibsip_session");
  dashCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
};

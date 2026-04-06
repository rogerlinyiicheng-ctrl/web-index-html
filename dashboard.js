const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  window.location.href = "login.html";
}

if (welcomeMessage && currentUser) {
  welcomeMessage.textContent = "Welcome, " + currentUser;
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}

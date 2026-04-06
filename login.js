const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(function (user) {
      return user.username === username && user.password === password;
    });

    if (matchedUser) {
      localStorage.setItem("currentUser", matchedUser.username);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid username or password");
    }
  });
}

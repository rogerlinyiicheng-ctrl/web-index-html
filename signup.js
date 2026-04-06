const signupForm = document.getElementById("signupForm");
const signupUsernameInput = document.getElementById("signupUsername");
const signupPasswordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (username === "") {
      alert("Username cannot be empty");
      return;
    }

    if (password === "") {
      alert("Password cannot be empty");
      return;
    }

    if (confirmPassword !== password) {
      alert("Confirm password must match password");
      return;
    }

    const existingUser = users.find(function (user) {
      return user.username === username;
    });

    if (existingUser) {
      alert("Username already exists");
      return;
    }

    users.push({
      username: username,
      password: password,
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Sign up successful");
    window.location.href = "index.html";
  });
}

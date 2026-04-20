const signupForm = document.getElementById("signupForm");
const signupUsernameInput = document.getElementById("signupUsername");
const signupPasswordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

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

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign up successful! Please login.");
        window.location.href = "index.html";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Cannot connect to server. Make sure backend is running on port 3000");
    }
  });
}

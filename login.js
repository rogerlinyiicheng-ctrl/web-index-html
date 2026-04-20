const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", data.username);
        localStorage.setItem("userId", data.userId);
        window.location.href = "dashboard.html";
      } else {
        alert(data.error || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to server. Make sure backend is running on port 3000");
    }
  });
}

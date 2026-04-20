const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");
const currentUser = localStorage.getItem("currentUser");
const userId = localStorage.getItem("userId");

// 如果没有登录，跳回登录页
if (!currentUser || !userId) {
  window.location.href = "index.html";
}

// 显示欢迎信息
if (welcomeMessage && currentUser) {
  welcomeMessage.textContent = "Welcome, " + currentUser;
}

// 从数据库加载真实进度
async function loadProgress() {
  try {
    const response = await fetch(`http://localhost:3000/api/progress/${userId}`);
    
    if (!response.ok) {
      throw new Error("Failed to load progress");
    }
    
    const progress = await response.json();
    
    // 更新页面上的进度数据
    const lessonsElement = document.querySelector(".content p");
    if (lessonsElement && lessonsElement.innerText.includes("You completed")) {
      lessonsElement.innerText = `You completed ${progress.lessons_completed} lessons this week and ${progress.quizzes_completed} quizzes.`;
    }
    
    const weakSubjectElement = document.querySelector(".content p:nth-of-type(2)");
    if (weakSubjectElement && weakSubjectElement.innerText.includes("Math:")) {
      weakSubjectElement.innerText = `Math: ${progress.weak_topic} need more revision.`;
    }
    
  } catch (error) {
    console.error("Error loading progress:", error);
  }
}

// 退出登录
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
  });
}

// 页面加载时获取进度
loadProgress();

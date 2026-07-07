// ========================================
// 英语默写本 — 用户认证模块（本地后端版）
// 依赖: api-config.js
// ========================================

var currentUser = null;  // { id, username, role, display_name, token }

// ========== 会话管理 ==========

async function checkSession() {
  try {
    var session = JSON.parse(localStorage.getItem("dictation_session"));
    if (session && session.token) {
      window.API_TOKEN = session.token;
      var userInfo = await apiGet('/api/me');
      currentUser = userInfo;
      saveSession();
      return true;
    }
  } catch(e) {
    localStorage.removeItem("dictation_session");
    window.API_TOKEN = null;
  }
  return false;
}

function saveSession() {
  if (currentUser) {
    localStorage.setItem("dictation_session", JSON.stringify({
      userId: currentUser.id,
      token: currentUser.token || window.API_TOKEN,
      username: currentUser.username,
      role: currentUser.role,
      displayName: currentUser.display_name
    }));
  }
}

// ========== 登录 ==========

async function login(username, password) {
  try {
    var result = await apiPost('/api/login', {
      username: username,
      password: password
    });
    currentUser = result;
    window.API_TOKEN = result.token;
    saveSession();
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message || "登录失败" };
  }
}

// ========== 老师首次注册 ==========

async function registerTeacher(username, password, displayName) {
  try {
    var result = await apiPost('/api/register', {
      username: username,
      password: password,
      display_name: displayName || username,
      role: "teacher"
    });
    currentUser = result;
    window.API_TOKEN = result.token;
    saveSession();
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message || "注册失败" };
  }
}

// ========== 老师创建学生账号 ==========

async function createStudent(username, password, displayName) {
  if (!currentUser || currentUser.role !== "teacher") {
    return { success: false, error: "只有老师可以创建学生账号" };
  }
  try {
    var result = await apiPost('/api/students', {
      username: username,
      password: password,
      display_name: displayName || username
    });
    return { success: true, userId: result.id };
  } catch(e) {
    return { success: false, error: e.message || "创建失败" };
  }
}

// ========== 退出登录 ==========

async function logout() {
  if (typeof flushToCloud === "function") {
    try { await flushToCloud(); } catch(e) {}
  }
  currentUser = null;
  window.API_TOKEN = null;
  localStorage.removeItem("dictation_session");
}

// ========== 工具函数 ==========

function getUserRole() { return currentUser ? currentUser.role : null; }
function getUserName() { return currentUser ? currentUser.display_name || currentUser.username : null; }
function isTeacher() { return getUserRole() === "teacher"; }
function isStudent() { return getUserRole() === "student"; }

// ========== 登录界面交互 ==========

var authMode = "login"; // "login" | "register"

async function handleAuth() {
  var username = document.getElementById("authUsername").value.trim();
  var password = document.getElementById("authPassword").value.trim();
  var displayName = document.getElementById("authDisplayName").value.trim();
  var errorEl = document.getElementById("authError");

  if (!username || !password) {
    errorEl.textContent = "请填写用户名和密码";
    errorEl.classList.add("show");
    return;
  }

  if (authMode === "register" && !displayName) {
    errorEl.textContent = "请填写显示名称";
    errorEl.classList.add("show");
    return;
  }

  var result;
  if (authMode === "register") {
    result = await registerTeacher(username, password, displayName);
  } else {
    result = await login(username, password);
  }

  if (result.success) {
    errorEl.classList.remove("show");
    onLoginSuccess();
  } else {
    errorEl.textContent = result.error || "操作失败";
    errorEl.classList.add("show");
  }
}

function toggleAuthMode() {
  var errorEl = document.getElementById("authError");
  errorEl.classList.remove("show");

  if (authMode === "login") {
    authMode = "register";
    document.getElementById("authTitle").textContent = "👨‍🏫 老师注册";
    document.getElementById("authSub").textContent = "首次使用请注册管理员账号";
    document.getElementById("authBtn").textContent = "注 册";
    document.getElementById("authToggle").textContent = "已有账号？点此登录";
    document.getElementById("authNameRow").style.display = "flex";
    document.getElementById("authRemember").parentElement.style.display = "none";
  } else {
    authMode = "login";
    document.getElementById("authTitle").textContent = "📝 英语默写本";
    document.getElementById("authSub").textContent = "登录以开始练习";
    document.getElementById("authBtn").textContent = "登 录";
    document.getElementById("authToggle").textContent = "老师首次使用？点此注册";
    document.getElementById("authNameRow").style.display = "none";
    document.getElementById("authRemember").parentElement.style.display = "flex";
  }
}

function onLoginSuccess() {
  document.getElementById("authOverlay").classList.add("hide");
  document.getElementById("btnLogout").classList.add("show");
  document.getElementById("userTag").classList.add("show");
  document.getElementById("userTag").textContent = "👤 " + getUserName();
  init();
}

async function handleLogout() {
  if (confirm("确定要退出登录吗？未同步的数据可能丢失。")) {
    await logout();
    document.getElementById("authOverlay").classList.remove("hide");
    document.getElementById("btnLogout").classList.remove("show");
    document.getElementById("userTag").classList.remove("show");
    document.getElementById("authUsername").value = "";
    document.getElementById("authPassword").value = "";
    window.location.reload();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var pwdInput = document.getElementById("authPassword");
  if (pwdInput) {
    pwdInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") { handleAuth(); }
    });
  }
  var nameInput = document.getElementById("authDisplayName");
  if (nameInput) {
    nameInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") { handleAuth(); }
    });
  }
});

// ========================================
// 本地后端配置 — 替换了原有的 LeanCloud
// 后端: FastAPI + SQLite
// 启动: cd backend && uvicorn main:app --reload
// ========================================

window.API_BASE = 'http://127.0.0.1:8000';
window.API_TOKEN = null;  // 登录后设置

// 获取带认证的 headers
function apiHeaders() {
  var h = { 'Content-Type': 'application/json' };
  if (window.API_TOKEN) {
    h['Authorization'] = 'Bearer ' + window.API_TOKEN;
  }
  return h;
}

// 封装的 fetch 方法
async function apiGet(path) {
  var r = await fetch(window.API_BASE + path, { headers: apiHeaders() });
  if (!r.ok) {
    var err = await r.json().catch(function() { return {}; });
    throw new Error(err.detail || r.statusText);
  }
  return r.json();
}

async function apiPost(path, data) {
  var r = await fetch(window.API_BASE + path, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(data)
  });
  if (!r.ok) {
    var err = await r.json().catch(function() { return {}; });
    throw new Error(err.detail || r.statusText);
  }
  return r.json();
}

async function apiPut(path, data) {
  var r = await fetch(window.API_BASE + path, {
    method: 'PUT',
    headers: apiHeaders(),
    body: JSON.stringify(data)
  });
  if (!r.ok) {
    var err = await r.json().catch(function() { return {}; });
    throw new Error(err.detail || r.statusText);
  }
  return r.json();
}

async function apiDelete(path) {
  var r = await fetch(window.API_BASE + path, {
    method: 'DELETE',
    headers: apiHeaders()
  });
  if (!r.ok) {
    var err = await r.json().catch(function() { return {}; });
    throw new Error(err.detail || r.statusText);
  }
  return r.json();
}

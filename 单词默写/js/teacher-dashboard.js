// ========================================
// 英语默写本 — 教师仪表盘（本地后端版）
// 依赖: api-config.js, auth.js, wordbanks.js
// ========================================

var currentTab = 'students';
var allStudents = [];
var allProgress = {};   // uid -> { bankId -> progress_obj }
var studentStats = {};  // uid -> { answer_count, correct_rate }
var currentItemData = [];
var currentTimelineData = [];

// ========== 启动 ==========
async function initDashboard() {
  // 检查登录
  var hasSession = false;
  try { hasSession = await checkSession(); } catch(e) {}
  if (!hasSession || !currentUser || getUserRole() !== 'teacher') {
    // 显示教师登录框，不跳转
    document.getElementById('teacherAuthOverlay').style.display = 'flex';
    // 回车登录
    document.getElementById('teacherAuthPassword').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { handleTeacherLogin(); }
    });
    return;
  }

  document.getElementById('teacherName').textContent = '👨‍🏫 ' + getUserName();

  populateBankSelects();
  await loadAllData();
}

function populateBankSelects() {
  var bankIds = Object.keys(wordBanks);
  var opts = '<option value="">全部词库</option>';
  for (var i = 0; i < bankIds.length; i++) {
    var b = wordBanks[bankIds[i]];
    opts += '<option value="' + bankIds[i] + '">' + b.icon + ' ' + b.name + '</option>';
  }
  var selects = ['overviewBankFilter', 'itemBankFilter', 'tlBankFilter'];
  for (var j = 0; j < selects.length; j++) {
    var el = document.getElementById(selects[j]);
    if (el) el.innerHTML = opts;
  }
}

// ========== Tab 切换 ==========
function switchTab(tab) {
  currentTab = tab;
  var btns = document.querySelectorAll('.tab-btn');
  for (var i = 0; i < btns.length; i++) { btns[i].classList.remove('active'); }
  event.target.classList.add('active');
  var contents = document.querySelectorAll('.tab-content');
  for (var j = 0; j < contents.length; j++) { contents[j].classList.remove('active'); }
  document.getElementById('tab-' + tab).classList.add('active');
  if (tab === 'students') loadStudentOverview();
  if (tab === 'items') loadItemDetail();
  if (tab === 'timeline') loadTimeline();
  if (tab === 'manage') loadStudentManage();
}

// ========== 数据加载 ==========
async function loadAllData() {
  await loadDashboardData();
  updateStats();
  await loadStudentOverview();
  await loadTimeline();
  await loadStudentManage();
}

// 从后端加载教师仪表盘总览
async function loadDashboardData() {
  try {
    var dashboard = await apiGet('/api/teacher/dashboard');
    allStudents = [];
    allProgress = {};
    studentStats = {};

    for (var i = 0; i < dashboard.length; i++) {
      var s = dashboard[i];
      allStudents.push({
        id: s.student_id,
        username: s.username,
        display_name: s.display_name
      });
      studentStats[s.student_id] = {
        answer_count: s.answer_count,
        correct_rate: s.correct_rate
      };
      allProgress[s.student_id] = {};
      for (var j = 0; j < s.progress.length; j++) {
        var p = s.progress[j];
        allProgress[s.student_id][p.bank_id] = p;
      }
    }
  } catch(e) {
    allStudents = [];
    allProgress = {};
    studentStats = {};
  }
  document.getElementById('statStudents').textContent = allStudents.length;
}

function updateStats() {
  var totalAnswered = 0, totalCorrect = 0, totalWrong = 0;
  for (var uid in allProgress) {
    for (var bid in allProgress[uid]) {
      var p = allProgress[uid][bid];
      totalAnswered += ((p.completed_count || 0) + (p.wrong_count || 0));
      totalCorrect += (p.completed_count || 0);
      totalWrong += (p.wrong_count || 0);
    }
  }
  document.getElementById('statToday').textContent = totalAnswered + '题';
  var total = totalCorrect + totalWrong;
  var acc = total > 0 ? Math.round(totalCorrect / total * 100) + '%' : '-';
  document.getElementById('statAccuracy').textContent = acc;
  document.getElementById('statWrong').textContent = totalWrong + '题';
}

// ========== Tab 1: 学生概览 ==========
async function loadStudentOverview() {
  var bankFilter = document.getElementById('overviewBankFilter').value;
  var container = document.getElementById('overviewContent');

  if (allStudents.length === 0) {
    container.innerHTML = '<div class="empty-msg">暂无学生数据</div>';
    return;
  }

  // 为学生填充学生下拉
  var itemStudentEl = document.getElementById('itemStudentFilter');
  if (itemStudentEl.options.length <= 1) {
    for (var i = 0; i < allStudents.length; i++) {
      var s = allStudents[i];
      itemStudentEl.innerHTML += '<option value="' + s.id + '">' + (s.display_name || s.username) + '</option>';
    }
  }

  var bankIds = bankFilter ? [bankFilter] : Object.keys(wordBanks);

  var html = '<table class="student-table"><thead><tr><th>学生</th>';
  for (var b = 0; b < bankIds.length; b++) {
    var bn = wordBanks[bankIds[b]];
    html += '<th>' + (bn ? bn.icon + ' ' + bn.name : bankIds[b]) + '<br><small>进度 / 正确率</small></th>';
  }
  html += '<th>最后练习</th></tr></thead><tbody>';

  for (var si = 0; si < allStudents.length; si++) {
    var stu = allStudents[si];
    var dn = stu.display_name || stu.username;
    html += '<tr><td><strong>' + dn + '</strong></td>';
    for (var bi = 0; bi < bankIds.length; bi++) {
      var bid = bankIds[bi];
      var sp = allProgress[stu.id] ? allProgress[stu.id][bid] : null;
      if (sp) {
        var done = sp.completed_count || 0;
        var wrongCount = sp.wrong_count || 0;
        var totalItems = wordBanks[bid] ? wordBanks[bid].items.length : '?';
        var accRate = (done + wrongCount) > 0 ? Math.round(done / (done + wrongCount) * 100) + '%' : '-';
        html += '<td>' + done + '/' + totalItems + ' <small style="color:#4a8c5c">(' + accRate + ')</small></td>';
      } else {
        html += '<td><small style="color:#999">未开始</small></td>';
      }
    }
    // 最后练习时间
    var lastTime = '-';
    for (var bid2 in (allProgress[stu.id] || {})) {
      var u = allProgress[stu.id][bid2].updated_at;
      if (u && (!lastTime || u > lastTime)) lastTime = u;
    }
    if (lastTime !== '-') {
      lastTime = fmtLocal(lastTime);
    }
    html += '<td><small>' + lastTime + '</small></td></tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

// ========== Tab 2: 词条明细 ==========
var cachedItemStatuses = {};
async function loadItemDetail() {
  var studentId = document.getElementById('itemStudentFilter').value;
  var bankId = document.getElementById('itemBankFilter').value;
  if (!studentId || !bankId) {
    document.getElementById('itemDetailContent').innerHTML = '<div class="empty-msg">请选择学生和词库</div>';
    return;
  }

  document.getElementById('itemDetailContent').innerHTML = '<div class="loading-msg">加载中...</div>';

  var cacheKey = studentId + '|' + bankId;
  if (cachedItemStatuses[cacheKey]) {
    currentItemData = cachedItemStatuses[cacheKey];
    renderItemDetail();
    return;
  }

  try {
    var details = await apiGet('/api/teacher/student/' + studentId + '/progress');
    var statuses = details.item_statuses || [];
    var statusMap = {};
    for (var i = 0; i < statuses.length; i++) {
      var r = statuses[i];
      if (r.bank_id === bankId) {
        statusMap[r.item_index] = {
          status: r.status,
          wrongCount: r.wrong_count || 0,
          lastAnswer: r.last_answer || '',
          lastAnswerAt: r.last_answer_at
        };
      }
    }
    cachedItemStatuses[cacheKey] = statusMap;
    currentItemData = statusMap;
  } catch(e) { currentItemData = {}; }
  renderItemDetail();
}

function renderItemDetail() {
  var bankId = document.getElementById('itemBankFilter').value;
  var statusFilter = document.getElementById('itemStatusFilter').value;
  var items = wordBanks[bankId] ? wordBanks[bankId].items : [];

  var html = '<div class="item-grid"><table><thead><tr><th>#</th><th>单元</th><th>中文</th><th>英文</th><th>状态</th><th>错误次数</th><th>最后答案</th><th>最后答题</th></tr></thead><tbody>';
  var counts = { correct: 0, wrong: 0, not_attempted: 0 };

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var st = currentItemData[i];
    var status = st ? st.status : 'not_attempted';
    if (statusFilter && status !== statusFilter) continue;

    counts[status] = (counts[status] || 0) + 1;

    var dot = '<span class="status-dot ' + status.replace('not_attempted','untouched') + '"></span>';
    var statusText = status === 'correct' ? '🟢 正确' : (status === 'wrong' ? '🔴 错误' : '⬜ 未做');
    var wrongCount = st ? st.wrongCount : 0;
    var lastAns = st ? st.lastAnswer : '-';
    var lastAt = st ? fmtLocal(st.lastAnswerAt) : '-';

    html += '<tr><td>' + (i+1) + '</td><td>' + (it.cat || '-') + '</td><td>' + it.cn + '</td><td>' + it.en + '</td><td>' + dot + statusText + '</td><td>' + wrongCount + '</td><td>' + esc(lastAns) + '</td><td><small>' + lastAt + '</small></td></tr>';
  }
  html += '</tbody></table></div>';
  html += '<div class="page-info">共 ' + items.length + ' 词 | 🟢 ' + counts.correct + ' 🔴 ' + counts.wrong + ' ⬜ ' + counts.not_attempted + '</div>';
  document.getElementById('itemDetailContent').innerHTML = html;
}

// ========== Tab 3: 答题时间线 ==========
async function loadTimeline() {
  var studentId = document.getElementById('tlStudentFilter').value;
  var bankId = document.getElementById('tlBankFilter').value;
  var days = parseInt(document.getElementById('tlDaysFilter').value);
  var container = document.getElementById('timelineContent');

  container.innerHTML = '<div class="loading-msg">加载中...</div>';

  // 填充学生下拉
  var tlStudentEl = document.getElementById('tlStudentFilter');
  if (tlStudentEl.options.length <= 1 && allStudents.length > 0) {
    for (var i = 0; i < allStudents.length; i++) {
      var s = allStudents[i];
      tlStudentEl.innerHTML += '<option value="' + s.id + '">' + (s.display_name || s.username) + '</option>';
    }
  }

  try {
    var params = '?limit=200';
    if (bankId) params += '&bank_id=' + bankId;
    var url;
    if (studentId) {
      url = '/api/teacher/student/' + studentId + '/answers' + params;
    } else {
      // 遍历所有学生汇总
      currentTimelineData = [];
      var fetchList = studentId ? [studentId] : [];
      if (!studentId) {
        for (var j = 0; j < allStudents.length; j++) {
          fetchList.push(allStudents[j].id);
        }
      }
      for (var k = 0; k < fetchList.length; k++) {
        try {
          var answers = await apiGet('/api/teacher/student/' + fetchList[k] + '/answers' + params);
          for (var a = 0; a < answers.length; a++) {
            answers[a]._student_id = fetchList[k];
            currentTimelineData.push(answers[a]);
          }
        } catch(e) {}
      }
      // 按时间排序
      currentTimelineData.sort(function(a, b) {
        return (b.created_at || '') > (a.created_at || '') ? 1 : -1;
      });
      currentTimelineData = currentTimelineData.slice(0, 200);
      renderTimeline();
      return;
    }
    currentTimelineData = await apiGet(url);
  } catch(e) { currentTimelineData = []; }

  renderTimeline();
}

function renderTimeline() {
  var container = document.getElementById('timelineContent');
  if (currentTimelineData.length === 0) {
    container.innerHTML = '<div class="empty-msg">暂无答题记录</div>';
    return;
  }

  var html = '<table class="timeline-table"><thead><tr><th>时间</th><th>学生</th><th>词库</th><th>中文</th><th>输入</th><th>正确答案</th><th>对错</th></tr></thead><tbody>';
  for (var i = 0; i < currentTimelineData.length; i++) {
    var r = currentTimelineData[i];
    var timeStr = fmtLocalSec(r.created_at);
    var bank = wordBanks[r.bank_id];
    var bankName = bank ? bank.name : r.bank_id;
    var isOk = r.is_correct;

    // 查找学生名称
    var sname = '';
    var sid = r.user_id || r._student_id;
    if (sid) {
      for (var si = 0; si < allStudents.length; si++) {
        if (allStudents[si].id === sid) {
          sname = allStudents[si].display_name || allStudents[si].username;
          break;
        }
      }
    }
    if (!sname) sname = (sid || '').toString().substring(0, 8);

    html += '<tr><td><small>' + timeStr + '</small></td>' +
      '<td>' + sname + '</td>' +
      '<td>' + bankName + '</td>' +
      '<td>' + esc(r.item_cn || '') + '</td>' +
      '<td>' + esc(r.user_answer || '') + '</td>' +
      '<td>' + esc(r.item_en || '') + '</td>' +
      '<td>' + (isOk ? '✅' : '❌') + '</td></tr>';
  }
  html += '</tbody></table>';
  html += '<div class="page-info">共 ' + currentTimelineData.length + ' 条记录（最多显示 200 条）</div>';
  container.innerHTML = html;
}

// ========== Tab 4: 学生管理 ==========
async function loadStudentManage() {
  var container = document.getElementById('studentManageContent');
  if (allStudents.length === 0) {
    container.innerHTML = '<div class="empty-msg">暂无学生，请先添加</div>';
    return;
  }
  var html = '<table class="student-table"><thead><tr><th>姓名</th><th>账号</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';
  for (var i = 0; i < allStudents.length; i++) {
    var s = allStudents[i];
    var dn = s.display_name || s.username;
    var cdateStr = s.created_at ? s.created_at.replace('T', ' ').substring(0, 10) : '-';
    html += '<tr><td>' + dn + '</td><td><code>' + s.username + '</code></td><td>' + cdateStr + '</td>' +
      '<td><span class="action-link" onclick="resetStudentPwd(\'' + s.id + '\',\'' + dn + '\')">重置密码</span>' +
      '<span class="action-link" onclick="deleteStudent(\'' + s.id + '\',\'' + dn + '\')">删除</span></td></tr>';
  }
  html += '</tbody></table>';
  container.innerHTML = html;
}

// 添加学生
async function addStudent() {
  var name = document.getElementById('newStudentName').value.trim();
  var user = document.getElementById('newStudentUser').value.trim();
  var pwd = document.getElementById('newStudentPwd').value.trim();
  var msgEl = document.getElementById('addStudentMsg');

  if (!name || !user) { msgEl.textContent = '请填写姓名和账号'; return; }
  if (!pwd) { msgEl.textContent = '请填写密码'; return; }

  msgEl.textContent = '正在创建...';
  var result = await createStudent(user, pwd, name);
  if (result.success) {
    msgEl.textContent = '✅ ' + name + ' 创建成功！初始密码：' + pwd;
    msgEl.style.color = '#4a8c5c';
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentUser').value = '';
    document.getElementById('newStudentPwd').value = '123456';
    await loadDashboardData();
    await loadStudentManage();
    await loadStudentOverview();
    populateStudentSelects();
  } else {
    msgEl.textContent = '❌ ' + (result.error || '创建失败');
    msgEl.style.color = '#a03a20';
  }
}

function populateStudentSelects() {
  var selects = ['itemStudentFilter', 'tlStudentFilter'];
  for (var j = 0; j < selects.length; j++) {
    var el = document.getElementById(selects[j]);
    el.innerHTML = '<option value="">' + (j === 1 ? '全部学生' : '选择学生...') + '</option>';
    for (var i = 0; i < allStudents.length; i++) {
      var s = allStudents[i];
      el.innerHTML += '<option value="' + s.id + '">' + (s.display_name || s.username) + '</option>';
    }
  }
}

// 重置学生密码
async function resetStudentPwd(id, name) {
  var npwd = prompt('请输入 ' + name + ' 的新密码：', '123456');
  if (!npwd) return;
  try {
    await apiPut('/api/students/' + id + '/reset-password', { password: npwd });
    alert(name + ' 的密码已重置为：' + npwd);
  } catch(e) {
    alert('重置失败：' + (e.message || e));
  }
}

// 删除学生
async function deleteStudent(id, name) {
  if (!confirm('确定要删除学生「' + name + '」吗？\n\n⚠ 该学生的所有答题记录将被永久删除，不可恢复！')) return;
  if (!confirm('再次确认：永久删除「' + name + '」？')) return;
  try {
    await apiDelete('/api/students/' + id);
    alert(name + ' 已删除');
    cachedItemStatuses = {};
    await loadDashboardData();
    updateStats();
    await loadStudentManage();
    await loadStudentOverview();
    populateStudentSelects();
  } catch(e) {
    alert('删除失败：' + (e.message || e));
  }
}

// ========== 退出 ==========
async function handleTeacherLogout() {
  if (confirm('确定要退出教师工作台吗？')) {
    // 隐藏仪表盘内容
    document.querySelector('.stats-row').style.display = 'none';
    document.querySelector('.tab-nav').style.display = 'none';
    var contents = document.querySelectorAll('.tab-content');
    for (var i = 0; i < contents.length; i++) { contents[i].classList.remove('active'); }
    document.getElementById('teacherName').textContent = '';
    await logout();
    // 显示教师登录框
    document.getElementById('teacherAuthOverlay').style.display = 'flex';
    document.getElementById('teacherAuthUsername').value = '';
    document.getElementById('teacherAuthPassword').value = '';
  }
}

// ========== 教师登录（独立于学生端） ==========
async function handleTeacherLogin() {
  var username = document.getElementById('teacherAuthUsername').value.trim();
  var password = document.getElementById('teacherAuthPassword').value.trim();
  var errorEl = document.getElementById('teacherAuthError');

  if (!username || !password) {
    errorEl.textContent = '请填写用户名和密码';
    errorEl.classList.add('show');
    return;
  }

  errorEl.classList.remove('show');
  var result = await login(username, password);
  if (result.success && currentUser.role === 'teacher') {
    document.getElementById('teacherAuthOverlay').style.display = 'none';
    document.querySelector('.stats-row').style.display = '';
    document.querySelector('.tab-nav').style.display = '';
    document.getElementById('teacherName').textContent = '👨‍🏫 ' + getUserName();
    allStudents = [];
    allProgress = {};
    cachedItemStatuses = {};
    await loadAllData();
  } else {
    errorEl.textContent = '登录失败或该账号不是教师';
    errorEl.classList.add('show');
    if (result.success) await logout(); // 清除学生 session
  }
}

// ========== 工具函数 ==========
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function esc(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
// UTC ISO 时间 → 本地时间字符串
function fmtLocal(isoStr) {
  if (!isoStr) return '-';
  var d = new Date(isoStr + (isoStr.endsWith('Z') ? '' : 'Z'));
  if (isNaN(d.getTime())) return isoStr.substring(0, 16);
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function fmtLocalSec(isoStr) {
  if (!isoStr) return '-';
  var d = new Date(isoStr + (isoStr.endsWith('Z') ? '' : 'Z'));
  if (isNaN(d.getTime())) return isoStr.substring(0, 19);
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

// ========== 启动 ==========
initDashboard();

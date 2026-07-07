// ========================================
// 英语默写本 — 本地后端同步引擎
// 依赖: api-config.js, auth.js, dictation-core.js
// 策略: 本地优先 + 后台异步批量同步
// ========================================

var syncQueue = [];
var syncTimer = null;
var SYNC_DEBOUNCE_MS = 5000;

// 将答题记录加入同步队列
function queueAnswerSync(bankId, itemIndex, itemEn, itemCn, userAnswer, isCorrect, timeSpentMs) {
  if (!currentUser) return;
  syncQueue.push({
    bank_id: bankId,
    item_index: itemIndex,
    item_en: itemEn,
    item_cn: itemCn,
    user_answer: userAnswer,
    is_correct: isCorrect,
    time_spent_ms: timeSpentMs || 0
  });
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(flushToCloud, SYNC_DEBOUNCE_MS);
}

// 标记进度变更（防抖同步）
function queueProgressSync() {
  if (!currentUser) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(flushToCloud, SYNC_DEBOUNCE_MS);
}

// 批量同步到本地后端
async function flushToCloud() {
  if (!currentUser) return;
  syncTimer = null;
  var batch = syncQueue.splice(0);

  try {
    // 1. 保存答题记录
    var answers = [];
    for (var i = 0; i < batch.length; i++) {
      answers.push(batch[i]);
    }
    if (answers.length > 0) {
      await apiPost('/api/sync/answers', { answers: answers });
    }

    // 2. 构建 wrong_set 对象
    var wrongObj = {};
    wrongSet.forEach(function(ts, idx) { wrongObj[idx] = ts; });

    // 3. 同步学习进度
    await apiPost('/api/sync/progress', {
      bank_id: currentBankId,
      completed_set: Array.from(completed),
      wrong_set: wrongObj,
      last_index: currentIdx,
      section_filter: currentSectionFilter || ''
    });

    // 4. 同步每个词条的状态
    var items = [];
    var touched = {};
    for (var j = 0; j < batch.length; j++) {
      var a = batch[j];
      var key = a.bank_id + '|' + a.item_index;
      if (!touched[key]) {
        touched[key] = { bank_id: a.bank_id, item_index: a.item_index, is_correct: a.is_correct, user_answer: a.user_answer };
      }
    }
    for (var k in touched) {
      if (!touched.hasOwnProperty(k)) continue;
      var t = touched[k];
      items.push({
        bank_id: t.bank_id,
        item_index: t.item_index,
        status: t.is_correct ? 'correct' : 'wrong',
        wrong_count: 0,  // server increments
        last_answer: t.user_answer
      });
    }
    if (items.length > 0) {
      await apiPost('/api/sync/item-statuses', { items: items });
    }

  } catch(e) {
    // 重试：放回队列
    syncQueue = batch.concat(syncQueue);
  }
}

// 从后端拉取进度（登录后合并）
async function fetchCloudProgress(bankId) {
  if (!currentUser) return null;
  try {
    return await apiGet('/api/progress/' + (bankId || currentBankId));
  } catch(e) { return null; }
}

// 合并云端进度到本地
function mergeCloudProgress(cloudSP) {
  if (!cloudSP || !cloudSP.found) return;
  var cloudCompleted = cloudSP.completed_set || [];
  for (var i = 0; i < cloudCompleted.length; i++) { completed.add(cloudCompleted[i]); }
  var cloudWrong = cloudSP.wrong_set || {};
  var twoDays = 2 * 24 * 60 * 60 * 1000;
  var now = Date.now();
  for (var k in cloudWrong) {
    if (cloudWrong.hasOwnProperty(k)) {
      var cloudTs = cloudWrong[k];
      if (now - cloudTs < twoDays) {
        var localTs = wrongSet.get(Number(k));
        if (!localTs || cloudTs > localTs) { wrongSet.set(Number(k), cloudTs); }
      }
    }
  }
  saveWrongSet();
  updateWrongBadge();
  var cloudIdx = cloudSP.last_index;
  if (typeof cloudIdx === 'number' && cloudIdx >= 0) { currentIdx = cloudIdx; }
}

// 页面卸载前尽力同步
window.addEventListener('beforeunload', function() {
  if (syncQueue.length > 0) {
    try { localStorage.setItem('dictation_pending_sync', '1'); } catch(e) {}
  }
});

// 切换词库前强制同步
var _origSwitchBank = switchBank;
switchBank = function(bankId) {
  if (currentUser && syncQueue.length > 0) {
    flushToCloud().then(function() { _origSwitchBank(bankId); });
    return;
  }
  _origSwitchBank(bankId);
};

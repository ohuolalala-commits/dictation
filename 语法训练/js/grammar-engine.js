/* ============================================================
   ASD 语法训练系统 — 核心引擎
   五步教学法：SEE → COLOR → MATCH → BUILD → USE
   四级渐隐提示：L4(全) → L3(半) → L2(弱) → L1(无) → L0(独立)
   ============================================================ */

(function () {
  'use strict';

  // ============ 全局状态 ============
  const STORAGE_KEY = 'grammar_progress_v1';

  let currentGateId = null;        // 当前关卡 ID，如 "1-1"
  let currentGate = null;          // 当前关卡数据对象
  let questionIndex = 0;           // 当前题目索引
  let currentHintLevel = 4;        // 当前渐隐等级
  let consecutiveCorrect = 0;      // 连续正确次数
  let consecutiveWrong = 0;        // 连续错误次数
  let totalStars = 0;              // 总星星数
  let gateStars = 0;               // 当前关星星数
  let isSpeaking = false;          // TTS 播放中
  let draggedBlock = null;         // 拖拽中的词块
  let placedBlocks = [];           // 已放置的词块
  let currentStepType = null;      // 当前题型
  let questionStartTime = 0;       // 题目开始时间
  let currentAudioTimeout = null;  // 颜色逐个出现定时器

  // 进度数据（从 localStorage 加载）
  let progressData = {};

  // ============ DOM 缓存 ============
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let app, homeScreen, practiceScreen, topbar, progressOuter, progressInner, progressText;
  let starBadge, questionCard, actionBar;

  // ============ 初始化 ============
  function init() {
    cacheDom();
    loadProgress();
    renderHome();
    bindGlobalEvents();
  }

  function cacheDom() {
    app = $('#app');
    homeScreen = $('#homeScreen');
    practiceScreen = $('#practiceScreen');
    topbar = $('#topbar');
    progressOuter = $('#progressOuter');
    progressInner = $('#progressInner');
    progressText = $('#progressText');
    starBadge = $('#starBadge');
    questionCard = $('#questionCard');
    actionBar = $('#actionBar');
  }

  // ============ 进度数据管理 ============
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      progressData = raw ? JSON.parse(raw) : {};
    } catch (e) {
      progressData = {};
    }
    totalStars = 0;
    Object.values(progressData).forEach(g => {
      if (g.stars) totalStars += g.stars;
    });
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (e) { /* quota exceeded, silent fail */ }
  }

  function getGateProgress(gateId) {
    return progressData[gateId] || { stars: 0, completed: false, bestStreak: 0, questionsDone: 0 };
  }

  function updateGateProgress(gateId, updates) {
    const prev = getGateProgress(gateId);
    progressData[gateId] = { ...prev, ...updates };
    saveProgress();
    loadProgress(); // 重新计算 totalStars
  }

  // ============ 主页渲染 ============
  function renderHome() {
    practiceScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    topbar.classList.remove('hidden');

    // 获取所有关卡
    const allGates = getOrderedGates();

    let html = `
      <div class="home-title">🧩 语法训练</div>
      <div class="home-subtitle">8 级 24 关 · 循序渐进</div>
      <div class="level-grid">
    `;

    // 按 Level 分组
    const levels = {};
    allGates.forEach(g => {
      if (!levels[g.level]) levels[g.level] = { gates: [], name: '', icon: '' };
      levels[g.level].gates.push(g);
    });

    // Level 名称
    const levelNames = {
      1: ['Be 动词基础', '🟢'],
      2: ['冠词 + 名词复数', '🟣'],
      3: ['一般现在时（无三单）', '🟠'],
      4: ['一般现在时（三单）', '🟡'],
      5: ['情态动词 Can', '🟣'],
      6: ['现在进行时', '🟠'],
      7: ['介词方位', '🟣'],
      8: ['Have / Has', '🔵'],
    };

    Object.keys(levels).sort((a,b) => a-b).forEach(lvl => {
      const [lvlName, lvlIcon] = levelNames[lvl] || ['Level ' + lvl, '📝'];
      const gates = levels[lvl].gates.sort((a,b) => a.gate - b.gate);

      // 判断 Level 整体状态
      const allDone = gates.every(g => getGateProgress(g.id).completed);
      const anyStarted = gates.some(g => getGateProgress(g.id).questionsDone > 0);
      const isLocked = !anyStarted && lvl > 1 && !isLevelUnlocked(lvl);

      let statusClass = 'wait';
      let statusText = '待解锁';
      if (isLocked) { statusClass = 'wait'; statusText = '🔒 未解锁'; }
      else if (allDone) { statusClass = 'done'; statusText = '✅ 已完成'; }
      else if (anyStarted) { statusClass = 'active'; statusText = '🔄 进行中'; }
      else { statusClass = 'active'; statusText = '可开始'; }

      const cardClass = isLocked ? 'locked' : (allDone ? 'completed' : (anyStarted ? 'in-progress' : ''));

      html += `<div class="level-card ${cardClass}" data-level="${lvl}" ${isLocked ? '' : 'onclick="GrammarEngine.openLevel(' + lvl + ')"'}>
        <div class="level-card-header">
          <span class="level-icon">${lvlIcon}</span>
          <span class="level-name">Level ${lvl}: ${lvlName}</span>
          <span class="level-status ${statusClass.replace('active','')}">${statusText}</span>
        </div>
        <div class="level-gates">`;

      gates.forEach(g => {
        const gp = getGateProgress(g.id);
        let dotClass = 'wait';
        if (gp.completed) dotClass = 'done';
        else if (gp.questionsDone > 0) dotClass = 'active';
        else if (!isLocked) dotClass = 'active';

        html += `<div class="gate-dot ${dotClass}" title="${g.name} (${g.nameCn})" onclick="event.stopPropagation(); GrammarEngine.startGate('${g.id}')">
          ${gp.completed ? '✓' : g.gate}
        </div>`;
      });

      html += `</div></div>`;
    });

    html += '</div>';
    homeScreen.innerHTML = html;
    updateStarBadge();
  }

  function isLevelUnlocked(lvl) {
    if (lvl <= 1) return true;
    // 前一个 Level 的至少一个关完成
    const prevGates = getOrderedGates().filter(g => g.level === lvl - 1);
    if (prevGates.length === 0) return true;
    return prevGates.some(g => getGateProgress(g.id).completed);
  }

  function getOrderedGates() {
    const gates = [];
    if (typeof grammarLevels === 'undefined') return gates;

    const ids = Object.keys(grammarLevels).sort((a, b) => {
      const [al, ag] = a.split('-').map(Number);
      const [bl, bg] = b.split('-').map(Number);
      return al !== bl ? al - bl : ag - bg;
    });

    ids.forEach(id => {
      const g = grammarLevels[id];
      if (g) gates.push({ id, level: g.level, gate: g.gate, name: g.name, nameCn: g.nameCn, icon: g.icon });
    });

    return gates;
  }

  function updateStarBadge() {
    if (starBadge) starBadge.innerHTML = `⭐ ${totalStars}`;
  }

  // ============ 开始关卡 ============
  window.GrammarEngine = {
    startGate: function (gateId) {
      if (!grammarLevels || !grammarLevels[gateId]) return;

      currentGateId = gateId;
      currentGate = grammarLevels[gateId];
      questionIndex = 0;
      currentHintLevel = 4;
      consecutiveCorrect = 0;
      consecutiveWrong = 0;
      gateStars = 0;
      placedBlocks = [];
      currentStepType = null;

      homeScreen.classList.add('hidden');
      practiceScreen.classList.remove('hidden');
      topbar.classList.remove('hidden');

      renderPracticeHeader();
      renderQuestion();
    },

    openLevel: function (lvl) {
      // 找到该 Level 的第一个未完成关卡
      const gates = getOrderedGates().filter(g => g.level === lvl);
      const firstIncomplete = gates.find(g => !getGateProgress(g.id).completed);
      if (firstIncomplete) {
        this.startGate(firstIncomplete.id);
      } else if (gates.length > 0) {
        this.startGate(gates[0].id);
      }
    },

    goHome: function () {
      if (currentAudioTimeout) clearTimeout(currentAudioTimeout);
      stopTTS();
      renderHome();
    },

    nextQuestion: function () {
      if (!currentGate) return;
      questionIndex++;
      if (questionIndex >= currentGate.questions.length) {
        // 关卡完成
        gateCompleted();
      } else {
        placedBlocks = [];
        currentStepType = null;
        renderQuestion();
      }
    },

    prevQuestion: function () {
      if (questionIndex > 0) {
        questionIndex--;
        placedBlocks = [];
        currentStepType = null;
        renderQuestion();
      }
    },

    restartGate: function () {
      questionIndex = 0;
      currentHintLevel = 4;
      consecutiveCorrect = 0;
      consecutiveWrong = 0;
      gateStars = 0;
      placedBlocks = [];
      currentStepType = null;
      renderQuestion();
    },

    // 暴露给 HTML onclick
    selectOption: function (value) { selectOption(value); },
    pickBlock: function (el) { pickBlock(el); },
    removePlacedBlock: function (index) { removePlacedBlock(index); },
    submitBuild: function () { submitBuild(); },
    submitWrite: function () { submitWrite(); },
    speakSentence: function () { speakCurrentSentence(); },
    toggleReferenceTable: function () { toggleReferenceTable(); },
    showHint: function () { showHintForUse(); },
  };

  // ============ 关卡完成 ============
  function gateCompleted() {
    const gp = getGateProgress(currentGateId);
    const newStars = Math.max(gateStars, gp.stars || 0);
    const wasCompleted = gp.completed;

    updateGateProgress(currentGateId, {
      stars: newStars,
      completed: true,
      questionsDone: currentGate.questions.length,
    });

    // 显示完成画面
    practiceScreen.innerHTML = `
      <div class="all-done fade-in">
        <div class="trophy">${currentGate.icon}</div>
        <div class="message">${currentGate.nameCn || currentGate.name} — 完成！</div>
        <div class="sub-message">获得 ${newStars} ⭐ 星星 · ${wasCompleted ? '再次通关' : '新纪录'}</div>
        <button class="btn btn-primary" onclick="GrammarEngine.restartGate()">🔄 再练一次</button>
        <button class="btn btn-outline" style="margin-top:8px;" onclick="GrammarEngine.goHome()">🏠 返回主页</button>
      </div>
    `;
    updateStarBadge();
    burstStars(12);
  }

  // ============ 渲染题目 ============
  function renderQuestion() {
    if (!currentGate || questionIndex >= currentGate.questions.length) return;

    const q = currentGate.questions[questionIndex];
    if (!q) return;

    currentStepType = q.step;
    questionStartTime = Date.now();

    updateProgressBar();
    updateStepIndicator();
    renderPracticeHeader();

    switch (q.step) {
      case 'see': renderSee(q); break;
      case 'compare': renderCompare(q); break;
      case 'color': renderColor(q); break;
      case 'match': renderMatch(q); break;
      case 'build': renderBuild(q); break;
      case 'use': renderUse(q); break;
    }

    // 渲染参照表（如果需要）
    renderReferenceTableIfNeeded();
  }

  // ============ SEE 题 ============
  function renderSee(q) {
    questionCard.innerHTML = `
      <div class="question-image fade-in">${q.image}</div>
      <div class="question-sentence fade-in">${q.sentence}</div>
    `;
    actionBar.innerHTML = `
      <button class="btn-speaker" onclick="GrammarEngine.speakSentence()" title="播放">🔊</button>
      <button class="btn btn-primary" onclick="GrammarEngine.nextQuestion()">下一题 →</button>
    `;
    // 自动播放
    setTimeout(() => speakText(q.sentence), 400);
  }

  // ============ COMPARE 题（对比） ============
  function renderCompare(q) {
    questionCard.innerHTML = `
      <div style="display:flex;gap:24px;align-items:center;justify-content:center;flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="font-size:3rem;">${q.leftImage}</div>
          <div style="font-size:1.2rem;font-family:var(--font-en);margin-top:8px;">
            ${colorizeText(q.leftSentence)}
          </div>
        </div>
        <div style="font-size:2rem;color:var(--text-muted);">→</div>
        <div style="text-align:center;">
          <div style="font-size:3rem;">${q.rightImage}</div>
          <div style="font-size:1.2rem;font-family:var(--font-en);margin-top:8px;">
            ${colorizeText(q.rightSentence)}
          </div>
        </div>
      </div>
      ${q.highlight ? `<div style="text-align:center;margin-top:16px;color:var(--color-be-verb);font-weight:600;">👀 注意变化：<span style="font-size:1.3rem;">${q.highlight}</span></div>` : ''}
    `;
    actionBar.innerHTML = `
      <button class="btn-speaker" onclick="GrammarEngine.speakSentence()" title="播放">🔊</button>
      <button class="btn btn-primary" onclick="GrammarEngine.nextQuestion()">看懂了，下一题 →</button>
    `;
    setTimeout(() => speakText(q.rightSentence), 400);
  }

  // ============ COLOR 题 ============
  function renderColor(q) {
    // 构建带颜色的句子
    const partsHtml = q.parts.map((p, i) =>
      `<span class="g-${p.type}" style="animation: fadeIn 400ms ease; animation-delay: ${i * 600}ms; animation-fill-mode: both;">${p.text}</span>`
    ).join(' ');

    questionCard.innerHTML = `
      <div class="question-image fade-in">${q.image}</div>
      <div class="question-sentence" style="gap:4px;">${partsHtml}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-top:12px;">颜色会逐个出现，请仔细观察 👀</div>
    `;
    actionBar.innerHTML = `
      <button class="btn-speaker" onclick="GrammarEngine.speakSentence()" title="播放">🔊</button>
      <button class="btn btn-primary" onclick="GrammarEngine.nextQuestion()">下一题 →</button>
    `;

    // 触发颜色逐个出现动画
    const totalDelay = q.parts.length * 600 + 400;
    if (currentAudioTimeout) clearTimeout(currentAudioTimeout);
    currentAudioTimeout = setTimeout(() => speakText(q.parts.map(p => p.text).join(' ')), totalDelay);
  }

  // ============ MATCH 题（选择填空） ============
  function renderMatch(q) {
    // 根据 currentHintLevel 决定是否给选项加颜色
    const useColors = currentHintLevel >= 4;
    const blankContent = '___';

    const promptHtml = (q.promptBefore || '') +
      ` <span class="blank-slot" id="blankSlot">${blankContent}</span> ` +
      (q.promptAfter || '');

    const optionsHtml = q.options.map(opt => {
      let colorClass = '';
      if (useColors) {
        if (opt === q.answer) {
          // 给答案对应的颜色
          const qType = getOptionType(opt);
          if (qType) colorClass = 'colored block-' + qType;
        }
      }
      return `<button class="option-btn ${colorClass}" onclick="GrammarEngine.selectOption('${escapeHtml(opt)}')">${opt}</button>`;
    }).join('');

    questionCard.innerHTML = `
      <div class="question-image fade-in">${q.image}</div>
      <div class="blank-sentence">${promptHtml}</div>
      <div class="options-row">${optionsHtml}</div>
    `;

    // 存储当前题目数据
    questionCard._matchData = q;
    questionCard._hasAnswered = false;

    actionBar.innerHTML = `
      <div class="hint-level">提示等级: ${'💡'.repeat(currentHintLevel)}</div>
    `;
  }

  function selectOption(value) {
    const q = questionCard._matchData;
    if (!q || questionCard._hasAnswered) return;
    questionCard._hasAnswered = true;

    const isCorrect = normalizeStr(value) === normalizeStr(q.answer);
    const blankSlot = $('#blankSlot');
    const allOptions = $$('.option-btn');

    if (isCorrect) {
      blankSlot.textContent = value;
      blankSlot.classList.add('filled');
      allOptions.forEach(btn => {
        if (normalizeStr(btn.textContent) === normalizeStr(q.answer)) {
          btn.classList.add('correct');
        }
      });
      handleCorrectAnswer();
    } else {
      blankSlot.textContent = value;
      blankSlot.classList.add('wrong-flash');
      // 找到错误选项
      allOptions.forEach(btn => {
        if (normalizeStr(btn.textContent) === normalizeStr(value)) {
          btn.classList.add('wrong-flash');
        }
      });
      // 1.5 秒后显示正确答案
      setTimeout(() => {
        blankSlot.textContent = q.answer;
        blankSlot.classList.remove('wrong-flash');
        blankSlot.classList.add('filled');
        allOptions.forEach(btn => {
          btn.classList.remove('wrong-flash');
          if (normalizeStr(btn.textContent) === normalizeStr(q.answer)) {
            btn.classList.add('correct');
          }
        });
      }, 1500);
      handleWrongAnswer();
      // 2 秒后自动进入下一题
      setTimeout(() => {
        if (currentGate && questionCard._hasAnswered && currentStepType === 'match') {
          window.GrammarEngine.nextQuestion();
        }
      }, 2500);
    }
  }

  function getOptionType(opt) {
    // 根据选项内容判断语法类型
    if (['am','is','are','have','has'].includes(opt.toLowerCase())) return 'be';
    if (['can',"can't",'the','a','an','in','on','under','next','behind','to','of'].includes(opt.toLowerCase())) return 'function';
    if (['do',"don't",'does',"doesn't"].includes(opt.toLowerCase())) return 'function';
    if (['eat','eats','play','plays','like','likes','go','goes','drink','drinks','run','runs'].includes(opt.toLowerCase())) return 'action';
    if (['sleeping','reading','playing','running','swimming','eating','writing','dancing'].includes(opt.toLowerCase())) return 'action';
    return null;
  }

  // ============ BUILD 题（拖拽组句） ============
  function renderBuild(q) {
    const useColors = currentHintLevel >= 4;
    placedBlocks = [];

    // 打乱词块顺序
    const shuffled = [...q.blocks].sort(() => Math.random() - 0.5);

    const blocksHtml = shuffled.map((word, i) => {
      let typeClass = 'block-function';
      if (useColors) {
        const t = getWordType(word);
        if (t) typeClass = 'block-' + t;
      }
      return `<div class="word-block ${typeClass}" onclick="GrammarEngine.pickBlock(this)" data-word="${escapeHtml(word)}" data-index="${i}">${word}</div>`;
    }).join('');

    const slotsHtml = q.blocks.map((_, i) =>
      `<div class="slot" data-slot="${i}" ondragover="event.preventDefault(); this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="event.preventDefault(); this.classList.remove('over'); GrammarEngine.dropOnSlot(${i})"></div>`
    ).join('');

    questionCard.innerHTML = `
      <div class="question-image fade-in">${q.image}</div>
      <div class="build-area" id="buildArea">${slotsHtml}</div>
      <div class="word-blocks" id="wordBlocks">${blocksHtml}</div>
    `;
    questionCard._buildData = q;
    questionCard._hasAnswered = false;

    // 如果 hintLevel >= 3，显示首词位置提示
    if (currentHintLevel >= 3 && q.blocks.length > 0) {
      const firstWord = q.blocks[0];
      const firstBlock = questionCard.querySelector(`.word-block[data-word="${escapeHtml(firstWord)}"]`);
      if (firstBlock) {
        firstBlock.style.boxShadow = '0 0 0 3px var(--color-be-verb)';
      }
    }

    actionBar.innerHTML = `
      <button class="btn btn-primary" onclick="GrammarEngine.submitBuild()">✓ 确认</button>
      <div class="hint-level">提示等级: ${'💡'.repeat(currentHintLevel)}</div>
    `;
  }

  function pickBlock(el) {
    if (el.classList.contains('placed')) return;

    // 找到第一个空 slot
    const slots = $$('#buildArea .slot');
    let emptySlot = null;
    slots.forEach(s => {
      if (!s.querySelector('.placed-block') && !emptySlot) emptySlot = s;
    });

    if (emptySlot) {
      const word = el.getAttribute('data-word');
      emptySlot.innerHTML = `<div class="placed-block block-function" onclick="GrammarEngine.removePlacedBlock(${placedBlocks.length})">${word}</div>`;
      el.classList.add('placed');
      placedBlocks.push({ word, el, slot: emptySlot });
      emptySlot.classList.remove('over');
    }
  }

  function removePlacedBlock(index) {
    if (index < 0 || index >= placedBlocks.length) return;
    const pb = placedBlocks[index];
    pb.el.classList.remove('placed');
    pb.slot.innerHTML = '';
    placedBlocks.splice(index, 1);
    // 重新索引
    placedBlocks.forEach((pb, i) => {
      pb.slot.querySelector('.placed-block').setAttribute('onclick', `GrammarEngine.removePlacedBlock(${i})`);
    });
  }

  function submitBuild() {
    const q = questionCard._buildData;
    if (!q || questionCard._hasAnswered) return;

    const userAnswer = placedBlocks.map(pb => pb.word).join(' ');
    const correctAnswer = q.answer.replace(/[.?!]/g, '').trim();
    const userClean = userAnswer.replace(/[.?!]/g, '').trim();

    if (normalizeStr(userClean) === normalizeStr(correctAnswer)) {
      // 正确
      const buildArea = $('#buildArea');
      buildArea.style.borderColor = 'var(--color-correct-border)';
      buildArea.style.background = 'var(--color-correct-bg)';
      handleCorrectAnswer();
    } else {
      // 错误：显示正确答案
      const buildArea = $('#buildArea');
      buildArea.style.borderColor = 'var(--color-time)';
      buildArea.style.background = '#FFF3E0';
      handleWrongAnswer();

      setTimeout(() => {
        // 重置并将正确答案放入
        placedBlocks.forEach(pb => { pb.el.classList.remove('placed'); pb.slot.innerHTML = ''; });
        placedBlocks = [];
        const correctWords = q.answer.replace(/[.?!]/g, '').trim().split(/\s+/);
        const slots = $$('#buildArea .slot');
        const allBlocks = $$('#wordBlocks .word-block');
        correctWords.forEach((word, i) => {
          if (slots[i]) {
            slots[i].innerHTML = `<div class="placed-block" style="background:var(--color-correct-bg);border:2px solid var(--color-correct-border);">${word}</div>`;
          }
          allBlocks.forEach(b => { if (b.getAttribute('data-word') === word) b.classList.add('placed'); });
        });
      }, 1500);

      setTimeout(() => {
        if (currentGate && questionCard._hasAnswered) {
          window.GrammarEngine.nextQuestion();
        }
      }, 3000);
    }
    questionCard._hasAnswered = true;
  }

  function getWordType(word) {
    const w = word.toLowerCase().replace(/[.?!,]/g, '');
    if (['i','you','he','she','it','we','they','cat','dog','bird','book','box','boy','girl','student','teacher','water','fish'].includes(w)) return 'subject';
    if (['am','is','are','have','has'].includes(w)) return 'be';
    if (['eat','eats','play','plays','like','likes','go','goes','drink','drinks','run','runs','read','sleep','sing','swim','dance','write','jump','cook','fly','drive'].includes(w)) return 'action';
    if (['can',"can't",'the','a','an','in','on','under','next','behind','to','of','front','do',"don't",'does',"doesn't"].includes(w)) return 'function';
    if (['sleeping','reading','playing','running','swimming','eating','writing','dancing','singing','jumping','cooking','flying'].includes(w)) return 'action';
    if (['there','two','three','one','yes','no'].includes(w)) return 'function';
    return null;
  }

  // ============ USE 题（看图写句） ============
  function renderUse(q) {
    const showHintBtn = q.hints && q.hints.length > 0 && currentHintLevel >= 2;
    const autoShowHints = currentHintLevel >= 3 && q.hints && q.hints.length > 0;

    questionCard.innerHTML = `
      <div class="question-image fade-in">${q.image}</div>
      ${autoShowHints ? `<div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px;">💡 提示：${q.hints.join(' ')}</div>` : ''}
      ${showHintBtn && !autoShowHints ? `<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;cursor:pointer;" onclick="GrammarEngine.showHint()">💡 需要提示？点这里</div>` : ''}
      <div id="hintArea" style="min-height:20px;"></div>
      <input type="text" class="write-input" id="writeInput" placeholder="请输入完整句子..." autocomplete="off" autocorrect="off" spellcheck="false">
    `;
    questionCard._useData = q;
    questionCard._hasAnswered = false;

    actionBar.innerHTML = `
      <button class="btn-speaker" onclick="GrammarEngine.speakSentence()" title="播放">🔊</button>
      <button class="btn btn-success" onclick="GrammarEngine.submitWrite()">✓ 确认</button>
      <div class="hint-level">提示等级: ${'💡'.repeat(currentHintLevel)}</div>
    `;

    setTimeout(() => {
      const input = $('#writeInput');
      if (input) input.focus();
    }, 300);
  }

  function showHintForUse() {
    const q = questionCard._useData;
    if (!q || !q.hints || q.hints.length === 0) return;
    const hintArea = $('#hintArea');
    if (hintArea) {
      hintArea.innerHTML = `<span style="color:var(--color-hint-border);font-weight:600;">💡 ${q.hints.join(' ')}</span>`;
    }
    speakText(q.answer);
  }

  function submitWrite() {
    const q = questionCard._useData;
    const input = $('#writeInput');
    if (!q || !input || questionCard._hasAnswered) return;

    const userAnswer = input.value.trim();
    if (!userAnswer) return;

    questionCard._hasAnswered = true;
    const correctAnswers = [q.answer.replace(/[.?!]/g, '').trim()];
    // 也接受带标点的版本
    if (q.answer.endsWith('?') || q.answer.endsWith('.') || q.answer.endsWith('!')) {
      correctAnswers.push(q.answer.trim());
    }

    const isCorrect = correctAnswers.some(a => normalizeStr(userAnswer) === normalizeStr(a));

    input.classList.add(isCorrect ? 'correct' : 'wrong-flash');

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
      setTimeout(() => {
        input.value = q.answer;
        input.classList.remove('wrong-flash');
        input.classList.add('correct');
      }, 1500);
      setTimeout(() => {
        if (currentGate && questionCard._hasAnswered) {
          window.GrammarEngine.nextQuestion();
        }
      }, 3000);
    }
  }

  // ============ 渐隐提示引擎 ============
  function handleCorrectAnswer() {
    consecutiveCorrect++;
    consecutiveWrong = 0;
    gateStars++;

    // 升级：连续2题正确
    if (consecutiveCorrect >= 2 && currentHintLevel > 0) {
      currentHintLevel = Math.max(0, currentHintLevel - 1);
      consecutiveCorrect = 0;
    }

    // 星星反馈
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'feedback correct fade-in';
    feedbackEl.textContent = '⭐ Good job!';
    questionCard.appendChild(feedbackEl);
    setTimeout(() => feedbackEl.remove(), 1500);

    updateProgressBar();
    updateStarBadge();

    // 小庆祝（每 3 颗星）
    if (gateStars % 3 === 0) {
      burstStars(5);
    }

    // 如果是 MATCH 或 USE 正确，短暂延迟后自动下一题
    if (currentStepType === 'match') {
      setTimeout(() => {
        if (currentGate && questionIndex < currentGate.questions.length - 1) {
          window.GrammarEngine.nextQuestion();
        }
      }, 1200);
    }
  }

  function handleWrongAnswer() {
    consecutiveWrong++;
    consecutiveCorrect = 0;

    // 降级：连续2题错误
    if (consecutiveWrong >= 2 && currentHintLevel < 4) {
      currentHintLevel = Math.min(4, currentHintLevel + 1);
      consecutiveWrong = 0;
    }

    // 柔和提示：只显示正确答案，不批评
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'feedback show-answer fade-in';
    feedbackEl.textContent = '💡 正确答案已显示';
    questionCard.appendChild(feedbackEl);
    setTimeout(() => feedbackEl.remove(), 2000);
  }

  // ============ 参照表 ============
  function renderReferenceTableIfNeeded() {
    // 移除旧表
    const oldTable = $('#referenceTable');
    if (oldTable) oldTable.remove();

    if (!currentGate || !currentGate.referenceTable) return;

    const table = document.createElement('div');
    table.id = 'referenceTable';
    table.className = 'reference-table' + (currentHintLevel <= 2 ? ' collapsed' : '');
    table.onclick = function () { window.GrammarEngine.toggleReferenceTable(); };

    const rowsHtml = currentGate.referenceTable.map(row => {
      const hl = row.highlight ? 'style="font-weight:700;color:var(--color-be-verb);"' : '';
      return `<div class="ref-row" ${hl}>
        <span class="ref-subject">${row.subject}</span>
        <span class="ref-arrow">→</span>
        <span class="ref-verb">${row.verb}</span>
      </div>`;
    }).join('');

    table.innerHTML = rowsHtml + (currentHintLevel <= 2 ? '<div style="font-size:0.7rem;text-align:center;color:var(--text-muted);">点击展开</div>' : '');
    practiceScreen.insertBefore(table, questionCard);
  }

  function toggleReferenceTable() {
    const table = $('#referenceTable');
    if (!table) return;
    table.classList.toggle('collapsed');
  }

  // ============ UI 辅助 ============
  function renderPracticeHeader() {
    // 由 renderQuestion 调用，实际 header 在 topbar
    const stepNames = { see: '👀 看', compare: '🔄 对比', color: '🎨 色块', match: '🔗 选择', build: '🧱 组句', use: '✏️ 写句' };
    const stepName = stepNames[currentStepType] || '';
    const qNum = questionIndex + 1;
    const total = currentGate ? currentGate.questions.length : 0;

    if (topbar) {
      topbar.innerHTML = `
        <div class="topbar-left">
          <button class="btn-back" onclick="GrammarEngine.goHome()">← 返回</button>
          <span class="title-text">${currentGate ? currentGate.icon + ' ' + currentGate.name : ''}</span>
        </div>
        <div class="topbar-right">
          <span style="font-size:0.85rem;color:var(--text-secondary);">${stepName} · ${qNum}/${total}</span>
          <span class="star-badge">⭐ ${gateStars}</span>
        </div>
      `;
    }
  }

  function updateStepIndicator() {
    const q = currentGate ? currentGate.questions[questionIndex] : null;
    const stepOrder = ['see', 'compare', 'color', 'match', 'build', 'use'];
    const currentStepIdx = q ? stepOrder.indexOf(q.step) : -1;

    // 在 questionCard 上方显示步骤
    let stepHtml = '<div class="step-indicator" style="justify-content:center;margin-bottom:8px;">';
    const stepIcons = { see: '👀', compare: '🔄', color: '🎨', match: '🔗', build: '🧱', use: '✏️' };
    stepOrder.forEach((s, i) => {
      if (i <= currentStepIdx) {
        stepHtml += `<div class="step-dot ${i === currentStepIdx ? 'active' : 'done'}">${stepIcons[s]}</div>`;
      }
    });
    stepHtml += '</div>';

    // 在 questionCard 前插入
    let indicatorEl = $('#stepIndicator');
    if (!indicatorEl) {
      indicatorEl = document.createElement('div');
      indicatorEl.id = 'stepIndicator';
      practiceScreen.insertBefore(indicatorEl, questionCard);
    }
    indicatorEl.innerHTML = stepHtml;
  }

  function updateProgressBar() {
    if (!currentGate) return;
    const done = questionIndex;
    const total = currentGate.questions.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    if (progressInner) progressInner.style.width = pct + '%';
    if (progressText) progressText.textContent = `${done}/${total} 题`;

    // 更新进度存储
    const gp = getGateProgress(currentGateId);
    if (done > gp.questionsDone) {
      updateGateProgress(currentGateId, { questionsDone: done });
    }
  }

  // ============ TTS（使用 Web Speech API） ============
  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    stopTTS();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.4;  // 慢速，匹配 ASD 需求
    utterance.pitch = 1.0;
    utterance.volume = 0.6; // 低音量

    // 尝试找一个好的英文声音
    const voices = speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Female'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;

    isSpeaking = true;
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    speechSynthesis.speak(utterance);
  }

  function speakCurrentSentence() {
    if (!currentGate) return;
    const q = currentGate.questions[questionIndex];
    if (!q) return;

    let text = '';
    if (q.sentence) {
      text = q.sentence;
    } else if (q.parts) {
      text = q.parts.map(p => p.text).join(' ');
    } else if (q.answer) {
      text = q.answer;
    }

    if (text) speakText(text);
  }

  function stopTTS() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      isSpeaking = false;
    }
  }

  // ============ 星星特效 ============
  function burstStars(count) {
    const container = document.createElement('div');
    container.className = 'stars-container';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.textContent = '⭐';
      star.style.left = (40 + Math.random() * 20) + '%';
      star.style.top = (30 + Math.random() * 20) + '%';
      star.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
      star.style.setProperty('--dy', (Math.random() - 0.5) * 200 - 60 + 'px');
      star.style.animationDuration = (1 + Math.random()) + 's';
      star.style.animationDelay = (i * 0.05) + 's';
      container.appendChild(star);
    }

    setTimeout(() => container.remove(), 2000);
  }

  // ============ 工具函数 ============
  function normalizeStr(s) {
    if (!s) return '';
    return s.toLowerCase()
      .replace(/[.?,!]/g, '')
      .replace(/[\s　]+/g, ' ')
      .trim();
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function colorizeText(text) {
    // 简单的语法着色
    return text
      .replace(/\b(I|you|he|she|it|we|they|cat|dog|boy|girl|student)\b/gi, '<span class="g-subject">$&</span>')
      .replace(/\b(am|is|are|have|has)\b/gi, '<span class="g-be">$&</span>')
      .replace(/\b(eat|eats|play|plays|like|likes|go|goes|drink|drinks|run|runs|sleep|read|sing|swim|dance|write|jump|cook|fly)\b/gi, '<span class="g-action">$&</span>')
      .replace(/\b(can|can't|the|a|an|in|on|under|next|behind|to|of|do|don't|does|doesn't|front|there)\b/gi, '<span class="g-function">$&</span>')
      .replace(/\b(ing|s|es|ies)\b/gi, '<span class="g-inflection">$&</span>');
  }

  // ============ 全局事件 ============
  function bindGlobalEvents() {
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
        const input = $('#writeInput');
        if (input && document.activeElement === input) {
          e.preventDefault();
          submitWrite();
        }
      }
    });

    // 预加载语音
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => { speechSynthesis.getVoices(); };
    }
  }

  // ============ 启动 ============
  document.addEventListener('DOMContentLoaded', init);

})();

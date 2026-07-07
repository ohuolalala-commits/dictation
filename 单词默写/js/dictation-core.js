// ========================================
// 英语默写本 — 核心默写逻辑
// 自动生成，请勿手动编辑
// ========================================
// ===== 当前状态 =====
let currentBankId = 'preposition';
let currentIdx = 0;
let completed = new Set();
let confettiAnimId = null;
let celebrationTimeout = null;
let revealedThisRound = false;
let wrongSet = new Map();        // index->timestamp, auto-expires after 2 days
let isWrongMode = false;         // reviewing wrong items only
let streakCount = 0;             // 连续正确计数
let lastAnswerWrong = false;     // 上一题是否答错

// ===== 发音 =====
var lastSpokenWord = '';
function speakWord(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text || lastSpokenWord);
  u.lang = 'en-US';
  u.rate = 0.8;
  u.pitch = 1;
  var voices = window.speechSynthesis.getVoices();
  for (var i = 0; i < voices.length; i++) {
    if (voices[i].lang === 'en-US' && voices[i].name.indexOf('Female') >= 0) {
      u.voice = voices[i]; break;
    }
  }
  window.speechSynthesis.speak(u);
}

function getStorageKey() { return 'dictation_wrong_' + currentBankId; }
function saveWrongSet() { try { var obj = {}; wrongSet.forEach(function(val, key) { obj[key] = val; }); localStorage.setItem(getStorageKey(), JSON.stringify(obj)); } catch(e) {} }
function loadWrongSet() {
  wrongSet = new Map();
  try {
    var raw = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
    var now = Date.now();
    var twoDays = 2 * 24 * 60 * 60 * 1000;
    var expired = 0;
    for (var k in raw) {
      if (raw.hasOwnProperty(k)) {
        var ts = raw[k];
        if (now - ts < twoDays) { wrongSet.set(Number(k), ts); } else { expired++; }
      }
    }
    if (expired > 0) saveWrongSet();
  } catch(e) { wrongSet = new Map(); }
  if (currentUser) {
    fetchCloudProgress().then(function(sp) { mergeCloudProgress(sp); updateWrongBadge(); }).catch(function(){});
  }
  updateWrongBadge();
}
function updateWrongBadge() {
  var badge = document.getElementById('wrongBadge');
  var btn = document.getElementById('btnWrongBook');
  badge.textContent = wrongSet.size;
  btn.style.display = wrongSet.size > 0 ? 'inline-block' : 'none';
}

function updateStreakBadge() {
  var b = document.getElementById('streakBadge');
  if (streakCount >= 3) {
    b.style.display = 'inline-block';
    b.textContent = '🔥 ' + streakCount + '连击';
    if (streakCount >= 5) {
      b.style.background = 'linear-gradient(180deg,#b8942e,#c8a84e)';
      b.textContent = '💥 ' + streakCount + '连击！';
    }
  } else {
    b.style.display = 'none';
  }
}

let currentSectionFilter = ''; // 板块筛选：''=全部，否则为cat值

function getBank() { return wordBanks[currentBankId]; }
function items() { return getBank().items; }

function getSectionList() {
  var list = [];
  if (currentSectionFilter === '') return null;
  for (var i = 0; i < items().length; i++) {
    if (items()[i].cat === currentSectionFilter) list.push(i);
  }
  return list;
}

function populateSectionFilter() {
  var sel = document.getElementById('sectionFilter');
  var cats = [];
  var seen = {};
  for (var i = 0; i < items().length; i++) {
    var c = items()[i].cat;
    if (!seen[c]) { seen[c] = true; cats.push(c); }
  }
  var html = '<option value="">全部（' + items().length + '词）</option>';
  for (var j = 0; j < cats.length; j++) {
    html += '<option value="' + cats[j] + '">' + cats[j] + '</option>';
  }
  sel.innerHTML = html;
}

function applySectionFilter() {
  currentSectionFilter = document.getElementById('sectionFilter').value;
  if (isWrongMode) exitWrongMode();
  currentIdx = 0; completed = new Set();
  var sl = getSectionList();
  var total = sl ? sl.length : items().length;
  document.getElementById('progressText').textContent = (currentSectionFilter ? '📊 ' + currentSectionFilter.replace(/^./,'') + ' ' : '') + '0 / ' + total;
  renderItem();
}

// ===== 词库切换 =====
function switchBank(bankId) {
  if (bankId === currentBankId) return;
  saveWrongSet();
  currentBankId = bankId;
  if (isWrongMode) exitWrongMode();
  // Show/hide section filter
  var sfw = document.getElementById('sectionFilterWrap');
  if (bankId === 'zk688' || bankId === 'grade7a') {
    sfw.style.display = 'flex';
    document.getElementById('sectionFilter').value = '';
    currentSectionFilter = '';
    populateSectionFilter();
  } else {
    sfw.style.display = 'none';
    currentSectionFilter = '';
  }
  loadWrongSet();
  resetAll();
  // 更新标题
  const bank = getBank();
  document.getElementById('headerTitle').textContent = bank.icon + ' ' + bank.name + '默写';
  document.getElementById('headerSub').textContent = bank.subtitle;
  document.getElementById('allDoneMsg').textContent = bank.doneMsg;
  document.title = bank.name + '默写';
}

document.getElementById('bankSelect').addEventListener('change', function() {
  switchBank(this.value);
});

function init() {
  currentIdx = 0; completed = new Set();
  loadWrongSet();
  document.getElementById('allDone').classList.remove('show');
  document.getElementById('card').classList.remove('hide');
  // Show section filter for zk688 and grade7a
  var sfw = document.getElementById('sectionFilterWrap');
  sfw.style.display = (currentBankId === 'zk688' || currentBankId === 'grade7a') ? 'flex' : 'none';
  if (currentBankId !== 'zk688' && currentBankId !== 'grade7a') { currentSectionFilter = ''; document.getElementById('sectionFilter').value = ''; }
  if (currentBankId === 'zk688' || currentBankId === 'grade7a') { populateSectionFilter(); }
  const bank = getBank();
  document.getElementById('headerTitle').textContent = bank.icon + ' ' + bank.name + '默写';
  document.getElementById('headerSub').textContent = bank.subtitle;
  document.getElementById('allDoneMsg').textContent = bank.doneMsg;
  // 预加载语音
  if (window.speechSynthesis) { window.speechSynthesis.getVoices(); }
  renderItem();
}

function getWrongList() { return [...wrongSet.keys()].sort(function(a,b){return a-b;}); }

function toggleWrongMode() {
  if (wrongSet.size === 0) return;
  if (isWrongMode) { exitWrongMode(); } else { enterWrongMode(); }
}

function enterWrongMode() {
  isWrongMode = true;
  currentIdx = 0;
  completed = new Set(); // 错题模式独立计数
  document.getElementById('modeBar').classList.add('show');
  document.getElementById('btnWrongBook').classList.add('active');
  document.getElementById('btnWrongBook').innerHTML = '📖 返回全部 <span class="badge" id="wrongBadge">' + wrongSet.size + '</span>';
  updateProgress();
  renderItem();
}

function exitWrongMode() {
  isWrongMode = false;
  currentIdx = 0;
  document.getElementById('modeBar').classList.remove('show');
  document.getElementById('btnWrongBook').classList.remove('active');
  document.getElementById('btnWrongBook').innerHTML = '📕 错题本 <span class="badge" id="wrongBadge">' + wrongSet.size + '</span>';
  updateWrongBadge();
  renderItem();
}

function getActiveList() {
  if (isWrongMode) return getWrongList();
  var sl = getSectionList();
  if (sl) return sl;
  return null; // null = use full items array
}

function getActiveTotal() {
  var list = getActiveList();
  return list ? list.length : items().length;
}

function renderItem() {
  var list = getActiveList();
  if (isWrongMode && list.length === 0) { exitWrongMode(); return; }
  if (!isWrongMode && currentSectionFilter && list.length === 0) {
    currentSectionFilter = ''; document.getElementById('sectionFilter').value = ''; renderItem(); return;
  }
  var idx = list ? list[currentIdx] : currentIdx;
  const it = items()[idx];
  revealedThisRound = false;
  document.getElementById('sectionLabel').textContent = it.cat;
  const tipBox = document.getElementById('tipBox');
  tipBox.style.display = 'none';
  if (currentBankId === 'pastTense') {
    document.getElementById('promptMain').innerHTML = '写出下方动词原型的<strong>过去式</strong>';
    document.getElementById('promptCn').innerHTML = '🔤 <strong style="font-size:22px">' + esc(it.base) + '</strong>&nbsp;&nbsp;<span style="font-size:15px;color:#8b7540">（' + esc(it.cn) + '）</span>';
  } else {
    document.getElementById('promptMain').innerHTML = '写出下方中文对应的<strong>英文内容</strong>';
    document.getElementById('promptCn').textContent = it.cn;
  }
  document.getElementById('inputArea').value = '';
  document.getElementById('feedback').classList.remove('show');
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('btnPrev').disabled = currentIdx === 0;
  var totalItems = getActiveTotal();
  document.getElementById('btnNext').textContent = currentIdx === totalItems - 1 ? '🏁 完成' : '下一个 ▶';
  updateProgress();
  document.getElementById('inputArea').focus();
  document.getElementById('card').scrollIntoView({ behavior: 'smooth' });
}

function updateProgress() {
  var t = getActiveTotal();
  var d = completed.size;
  document.getElementById('progressBar').style.width = Math.round(d/t*100) + '%';
  var prefix = (isWrongMode ? '📕 错题 ' : (currentSectionFilter ? '📊 ' : ''));
  document.getElementById('progressText').textContent = prefix + d + ' / ' + t;
}

function normalize(s) {
  return s.toLowerCase().replace(/[·……]/g,'...').replace(/['"",.!?;:]+/g,'').replace(/\s+/g,' ').replace(/\.\.\./g,'...').trim();
}

function checkAnswer() {
  const input = document.getElementById('inputArea').value.trim();
  if (!input) return;

  var list = getActiveList();
  var realIdx = list ? list[currentIdx] : currentIdx;
  const it = items()[realIdx];
  const fb = document.getElementById('feedback');
  fb.classList.add('show');

  const ni = normalize(input);
  const ne = normalize(it.en);

  let isMatch = ni === ne;
  if (!isMatch) {
    for (const alt of it.alt) {
      if (ni === normalize(alt)) { isMatch = true; break; }
    }
  }

  if (isMatch) {
    if (!revealedThisRound) {
      completed.add(realIdx);
      streakCount++;
      lastAnswerWrong = false;
      updateStreakBadge();
      if (wrongSet.has(realIdx)) { wrongSet.delete(realIdx); saveWrongSet(); updateWrongBadge(); }
      // 云端同步
      queueAnswerSync(currentBankId, realIdx, it.en, it.cn, input, true, 0);
      queueProgressSync();
    }
    updateProgress();

    let html = '<div class="fb-summary great">🎉 完全正确！</div>';
    if (streakCount >= 3 && streakCount < 5) {
      html = '<div class="fb-summary great">🔥 连续' + streakCount + '题正确！</div>';
    }
    if (streakCount >= 5) {
      html = '<div class="fb-summary great">💥 Unbelievable！连续' + streakCount + '题正确！</div>';
    }
    html += '<div class="fb-correct">✅ <strong>' + esc(it.en) + '</strong></div>';
    fb.innerHTML = html;

    if (streakCount === 5 || streakCount === 10 || streakCount === 15 || streakCount === 20) {
      playStreakSound();
      document.getElementById('celebrateText').textContent = streakCount === 5 ? 'Unbelievable!' : (streakCount + '连击！');
      document.getElementById('celebrateSub').textContent = '连续' + streakCount + '题全对';
      triggerCelebration();
    } else if (streakCount < 5) {
      playCorrectSound();
      document.getElementById('celebrateText').textContent = '正确！';
      document.getElementById('celebrateSub').textContent = streakCount >= 3 ? '连续' + streakCount + '题' : '书写无误';
      triggerCelebration();
    } else {
      playCorrectSound();
    }

    if (it.tip) {
      const tipBox = document.getElementById('tipBox');
      tipBox.style.display = 'block';
      tipBox.textContent = '💡 ' + it.tip;
    }
  } else {
    // Record wrong answer — reset streak
    streakCount = 0;
    lastAnswerWrong = true;
    updateStreakBadge();
    if (!wrongSet.has(realIdx)) { wrongSet.set(realIdx, Date.now()); saveWrongSet(); updateWrongBadge(); }
    // 云端同步（错误也要同步）
    queueAnswerSync(currentBankId, realIdx, it.en, it.cn, input, false, 0);
    queueProgressSync();
    // 判断是否为短语（含空格）
    var isPhrase = it.en.indexOf(' ') >= 0;
    let html = '<div class="fb-summary needs">📝 对照一下正确答案：</div>';
    if (isPhrase) {
      html += '<div style="font-size:12px;color:#c8a84e;margin:2px 0">📎 这是一个短语/搭配，注意连在一起记</div>';
    }
    html += '<div class="fb-answer">' + esc(it.en) + ' <button onclick="speakWord()" style="background:none;border:1px solid rgba(200,168,78,0.5);border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;line-height:1" title="听发音">🔊</button></div>';
    if (it.alt.length > 0) html += '<div style="font-size:13px;color:#888;margin-top:4px">也接受：' + it.alt.map(esc).join(' / ') + '</div>';
    fb.innerHTML = html;

    // 答错时滚动到正确答案区域，确保平板上能看到
    fb.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 自动朗读正确答案
    lastSpokenWord = it.en;
    speakWord();

    if (it.tip) {
      const tipBox = document.getElementById('tipBox');
      tipBox.style.display = 'block';
      tipBox.textContent = '💡 ' + it.tip;
    }
  }
}

function autoAdvanceAfterCheck() {
  // 答错时不自动跳题，留时间看正确答案
  if (lastAnswerWrong) return;
  var totalItems = getActiveTotal();
  setTimeout(function() {
    if (completed.size === totalItems) return;
    dismissCelebrate();
    nextItem();
  }, 1200);
}

function revealAnswer() {
  revealedThisRound = true;
  streakCount = 0; updateStreakBadge(); // reveal breaks streak
  var list = getActiveList();
  var realIdx = list ? list[currentIdx] : currentIdx;
  document.getElementById('inputArea').value = items()[realIdx].en;
  const it = items()[realIdx];
  if (it.tip) {
    const tipBox = document.getElementById('tipBox');
    tipBox.style.display = 'block';
    tipBox.textContent = '💡 ' + it.tip;
  }
  document.getElementById('inputArea').focus();
}

// ===== CELEBRATION =====
function triggerCelebration() {
  document.getElementById('celebrateOverlay').classList.add('active');
  document.getElementById('celebrateCenter').classList.add('active');
  startConfetti(); burstStars();
  if (celebrationTimeout) clearTimeout(celebrationTimeout);
  celebrationTimeout = setTimeout(dismissCelebrate, 2800);
}
function dismissCelebrate() {
  document.getElementById('celebrateOverlay').classList.remove('active');
  document.getElementById('celebrateCenter').classList.remove('active');
  stopConfetti();
  if (celebrationTimeout) clearTimeout(celebrationTimeout);
  var totalItems = getActiveTotal();
  if (completed.size === totalItems) {
    if (isWrongMode && wrongSet.size === 0) {
      exitWrongMode();
    }
    document.getElementById('card').classList.add('hide');
    document.getElementById('allDone').classList.add('show');
    document.getElementById('allDone').scrollIntoView({behavior:'smooth'});
    startConfetti(); setTimeout(stopConfetti, 4000);
  }
}
function burstStars() {
  const emojis = ['🌟','✨','💫','🎉','💖','🔥','👏','🥳'];
  for (let i=0;i<8;i++){setTimeout(()=>{
    const star=document.createElement('span');star.className='star-burst';
    star.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    star.style.left=(40+Math.random()*20)+'%';star.style.top=(35+Math.random()*20)+'%';
    star.style.setProperty('--dx',(Math.random()-0.5)*200+'px');
    star.style.setProperty('--dy',(Math.random()-0.5)*200-50+'px');
    star.style.setProperty('--dx2',(Math.random()-0.5)*300+'px');
    star.style.setProperty('--dy2',(Math.random()-0.5)*300-80+'px');
    document.body.appendChild(star);setTimeout(()=>star.remove(),1600);
  },i*60);}
}

// ===== CONFETTI =====
const canvas=document.getElementById('confetti'),ctx=canvas.getContext('2d');
let confettiParticles=[];
const confettiColors=['#c8a84e','#f4d87c','#b8942e','#e8d5a3','#8b6914','#1a2840','#4a8c5c','#a03a20','#d4af37','#f7ecd5'];
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
window.addEventListener('resize',resizeCanvas);resizeCanvas();
class ConfettiParticle{constructor(){this.x=Math.random()*canvas.width;this.y=-20;this.w=Math.random()*10+6;this.h=Math.random()*6+4;this.color=confettiColors[Math.floor(Math.random()*confettiColors.length)];this.vx=(Math.random()-0.5)*4;this.vy=Math.random()*3+2;this.rotation=Math.random()*360;this.rotSpeed=(Math.random()-0.5)*10;this.opacity=1}update(){this.x+=this.vx;this.vy+=0.06;this.y+=this.vy;this.rotation+=this.rotSpeed;this.opacity-=0.003}draw(c){c.save();c.globalAlpha=Math.max(0,this.opacity);c.translate(this.x,this.y);c.rotate(this.rotation*Math.PI/180);c.fillStyle=this.color;c.fillRect(-this.w/2,-this.h/2,this.w,this.h);c.restore()}}
function startConfetti(){canvas.classList.add('active');confettiParticles=[];for(let i=0;i<100;i++){const p=new ConfettiParticle();p.y=Math.random()*canvas.height*0.3;confettiParticles.push(p)}if(!confettiAnimId)animateConfetti()}
function stopConfetti(){canvas.classList.remove('active');confettiParticles=[];if(confettiAnimId){cancelAnimationFrame(confettiAnimId);confettiAnimId=null}ctx.clearRect(0,0,canvas.width,canvas.height)}
function animateConfetti(){ctx.clearRect(0,0,canvas.width,canvas.height);let alive=false;for(const p of confettiParticles){p.update();p.draw(ctx);if(p.opacity>0&&p.y<canvas.height+20)alive=true}if(alive){confettiAnimId=requestAnimationFrame(animateConfetti)}else{confettiAnimId=null;canvas.classList.remove('active')}}

// ===== NAV =====
function nextItem(){
  if (isWrongMode && wrongSet.size === 0) { exitWrongMode(); return; }
  var totalItems = getActiveTotal();
  if(currentIdx<totalItems-1){currentIdx++;renderItem()}
  else{document.getElementById('card').classList.add('hide');document.getElementById('allDone').classList.add('show');document.getElementById('allDone').scrollIntoView({behavior:'smooth'});updateProgress()}
}
function prevItem(){if(currentIdx>0){currentIdx--;renderItem()}}
function showHint(){
  var list = getActiveList();
  var realIdx = list ? list[currentIdx] : currentIdx;
  document.getElementById('inputArea').value = items()[realIdx].hint;
  document.getElementById('inputArea').focus();
}
function resetAll(){currentIdx=0;completed=new Set();streakCount=0;updateStreakBadge();if(isWrongMode)exitWrongMode();if(currentSectionFilter){currentSectionFilter='';document.getElementById('sectionFilter').value='';}document.getElementById('allDone').classList.remove('show');document.getElementById('card').classList.remove('hide');stopConfetti();renderItem();window.scrollTo({top:0,behavior:'smooth'})}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
document.addEventListener('keydown',function(e){if(e.ctrlKey&&e.key==='Enter'){checkAnswer();e.preventDefault()}});
document.getElementById('inputArea').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    var input = document.getElementById('inputArea').value.trim();
    // 如果上一题答错，用户看完答案后按回车直接跳到下一题
    if (lastAnswerWrong) {
      lastAnswerWrong = false;
      dismissCelebrate();
      nextItem();
      return;
    }
    if (input) { checkAnswer(); autoAdvanceAfterCheck(); }
  }
});

// ===== MECHANICAL KEYBOARD SOUND EFFECT =====
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }
  return audioCtx;
}

function playKeySound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const jitter = (Math.random() - 0.5) * 0.003;

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.connect(clickGain); clickGain.connect(ctx.destination);
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(2800 + Math.random() * 600, t + jitter);
    clickOsc.frequency.exponentialRampToValueAtTime(1200, t + jitter + 0.015);
    clickGain.gain.setValueAtTime(0.06, t + jitter);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + jitter + 0.018);
    clickOsc.start(t + jitter);
    clickOsc.stop(t + jitter + 0.02);

    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thumpOsc.connect(thumpGain); thumpGain.connect(ctx.destination);
    thumpOsc.type = 'triangle';
    thumpOsc.frequency.setValueAtTime(90 + Math.random() * 30, t + jitter + 0.005);
    thumpOsc.frequency.exponentialRampToValueAtTime(40, t + jitter + 0.025);
    thumpGain.gain.setValueAtTime(0.10, t + jitter + 0.005);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + jitter + 0.03);
    thumpOsc.start(t + jitter + 0.005);
    thumpOsc.stop(t + jitter + 0.035);

    const bufferSize = Math.floor(ctx.sampleRate * 0.012);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 3000;
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0.04, t + jitter);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + jitter + 0.012);
    noise.start(t + jitter);
    noise.stop(t + jitter + 0.012);

  } catch(e) {}
}

function playCorrectSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = t + i * 0.08;
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.start(start); osc.stop(start + 0.3);
    });
    for (let i = 0; i < 6; i++) {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.connect(g2); g2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.value = 1500 + Math.random() * 2000;
      const st = t + 0.2 + Math.random() * 0.3;
      g2.gain.setValueAtTime(0.04, st);
      g2.gain.exponentialRampToValueAtTime(0.001, st + 0.15);
      osc2.start(st); osc2.stop(st + 0.2);
    }
  } catch(e) {}
}

// ===== Unbelievable 连击音效（消消乐风格） =====
function playStreakSound() {
  // ---- 消消乐原声 Unbelievable 音效 ----
  try {
    unbelievableAudio.currentTime = 0;
    unbelievableAudio.play();
  } catch(e) {}

  // ---- 音乐音效 ----
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // 1. 低沉轰鸣上升（whoosh sweep）
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    const sweepFilter = ctx.createBiquadFilter();
    sweepOsc.connect(sweepFilter); sweepFilter.connect(sweepGain); sweepGain.connect(ctx.destination);
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(80, t);
    sweepOsc.frequency.exponentialRampToValueAtTime(2000, t + 0.8);
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(200, t);
    sweepFilter.frequency.exponentialRampToValueAtTime(6000, t + 0.7);
    sweepGain.gain.setValueAtTime(0.10, t);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    sweepOsc.start(t); sweepOsc.stop(t + 0.95);

    // 2. 八度跳跃合唱
    const vocalNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    vocalNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);
      vib.type = 'sine';
      vib.frequency.value = 6;
      vibGain.gain.value = 8;
      vib.start(t + i * 0.10);
      vib.stop(t + i * 0.10 + 0.35);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = t + i * 0.10;
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.setValueAtTime(0.12, start + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.start(start); osc.stop(start + 0.4);
    });

    // 3. 辉煌高音和弦
    const chordNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chordNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = t + 0.65;
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.start(start); osc.stop(start + 0.7);
    });

    // 4. 闪闪发光铃铛（sparkles）
    for (let i = 0; i < 25; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 2000 + Math.random() * 4000;
      const start = t + 0.5 + Math.random() * 0.6;
      gain.gain.setValueAtTime(0.04, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
      osc.start(start); osc.stop(start + 0.25);
    }

    // 5. 低音鼓点
    [0, 0.35, 0.7].forEach(function(delay) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t + delay);
      osc.frequency.exponentialRampToValueAtTime(30, t + delay + 0.15);
      gain.gain.setValueAtTime(0.15, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.18);
      osc.start(t + delay); osc.stop(t + delay + 0.2);
    });

  } catch(e) {}
}

document.getElementById('inputArea').addEventListener('keydown', function(e) {
  if (e.key.length === 1) playKeySound();
});

// 预加载语音列表，确保浏览器语音就绪
(function preloadVoices() {
  var voices = speechSynthesis.getVoices();
  if (voices.length > 0) return;
  speechSynthesis.onvoiceschanged = function() { speechSynthesis.getVoices(); };
  // 触发一次空播报加载引擎
  try { var u = new SpeechSynthesisUtterance(''); u.volume = 0; speechSynthesis.speak(u); } catch(e) {}
})();

// ========== 启动流程：先检查登录 ==========
async function appStartup() {
  var hasSession = false;
  var backendAvailable = false;
  try {
    hasSession = await checkSession();
    backendAvailable = true;
  } catch(e) {
    // 后端未启动，使用纯本地模式
  }

  if (hasSession) {
    // 已登录：显示用户信息，开始默写
    document.getElementById('authOverlay').classList.add('hide');
    document.getElementById('btnLogout').classList.add('show');
    document.getElementById('userTag').classList.add('show');
    document.getElementById('userTag').textContent = '👤 ' + getUserName();
    init();
  } else if (backendAvailable) {
    // 后端可用但未登录：显示登录浮层（默认已显示）
    document.getElementById('authToggle').style.display = 'block';
    document.getElementById('authToggleBtn').style.display = 'inline-block';
  } else {
    // 后端未启动：纯本地模式
    document.getElementById('authOverlay').classList.add('hide');
    init();
  }
}

appStartup();

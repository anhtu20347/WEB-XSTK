/* ===== MODULE 1: CORE ENGINE, GEMINI AI, VOICE TTS SIÊU TỐC & FIREBASE AUTH ===== */
var $ = function(s){ return document.querySelector(s); };
var ls = {
  get: function(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
var tx = function(){ try{ if(window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise(); }catch(e){} };
var toast = function(m){
  var t = $('#toast'); if(!t) return;
  t.textContent = m; t.classList.remove('hidden');
  clearTimeout(toast.h); toast.h = setTimeout(function(){ t.classList.add('hidden'); }, 3200);
};
var esc = function(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
var attr = function(x){ return esc(x).replace(/"/g,'&quot;'); };

var KEY = '', MODEL = 'gemini-2.5-flash';
var ST = {
  view:'home', ch:1, lv:'all', gen:[], ex:null,
  cfg:{scope:'all',n:10,min:15}, ui:{},
  tch:1, tlv:'Vận dụng', cnt:15, pi:0,
  fdraft:'', ftitle:'', cd:{}, activeChatUid:null, dmDraft:'',
  simEssayList:[], simMcqList:[], mcqScore:{ok:0, tot:0},
  mmCh:1, mmTopic:'', polyaQ:'', polyaRes:null, voiceBoardLatex:''
};
var QM = {};
var LB = ['A','B','C','D'];
var CH = [
  'Xác suất và công thức tính xác suất',
  'Biến ngẫu nhiên',
  'Phân phối xác suất của biến ngẫu nhiên',
  'Mẫu ngẫu nhiên và các số đặc trưng của mẫu',
  'Khoảng ước lượng',
  'Kiểm định giả thuyết trong thống kê',
  'So sánh 2 tham số'
];
/* Thanh điều hướng mới: Bỏ Luyện tập chung, chia thành các module độc lập a, b, c, d, e, f */
var NAV = [
  ['home','🏠 Trang chủ (Mục lục)'],
  ['voice_ipad','🎙️ (a) Voice & Bảng iPad'],
  ['essay_sim','✍️ (b) Tự luận tương tự'],
  ['mcq_sim','☑️ (c) Trắc nghiệm tương tự'],
  ['stats','📊 (d) Thống kê lỗi & Hồ sơ'],
  ['mindmap','🧠 (e) Bản đồ tư duy'],
  ['polya_clone','🧭 (f) Quy trình 4 bước Polya'],
  ['exam','⏰ Thi thử'],
  ['forum','🌐 Diễn đàn']
];
var MODES = { mcq:'Trắc nghiệm', essay:'Tự luận', oral:'Vấn đáp Voice', exam:'Thi thử' };
var RUBRIC = [
  {k:'Nhận diện dạng toán & gọi biến', p:2},
  {k:'Viết đúng công thức xác suất/thống kê', p:3},
  {k:'Thay số & biến đổi tính toán chuẩn xác', p:3.5},
  {k:'Kết luận & giải thích ý nghĩa thực tế', p:1.5}
];
var TITLES = ['Cú Đêm Tập Sự','Cú Đêm Chăm Chỉ','Cú Đêm Thông Thái','Giáo Sư Cú Đêm'];
var REACTS = [['like','👍 Thích'],['love','❤️ Yêu thích'],['wow','🤯 Xoắn não']];
var LBL = [
  ['📌 Dạng toán','#D9C9FF'],
  ['📋 Dữ kiện đề cho','#BFF1DC'],
  ['🧮 Công thức cốt lõi','#FFD2D0'],
  ['🪜 Các bước giải & ⚠️ Bẫy hay sai','#FFF1B8']
];

var prog = ls.get('prog', {done:[], streak:1, last:''});
var PROF = ls.get('prof', {name:'', sid:'', cls:'', title:'Cú Đêm Tập Sự', email:'', photo:''});
var ATT = ls.get('att', {});
var miss = ls.get('miss', []);
var PSTK = [], last = [0,0], down = false, upFile = null, PADIMG = '';
var PEN = {c:'#2D2A4A', w:4, e:0};

/* Biến Firebase & Cộng đồng người thật */
var auth = null;
var currentUser = ls.get('session_user', null);
var USERS = {};
var POSTS = ls.get('forum_real', {});
if(!POSTS || typeof POSTS !== 'object') POSTS = {};
var MY_FRIENDS = {}, INCOMING_REQS = {}, OUTGOING_REQS = {}, DM_MSGS = {};
var fbPoll = null;
var FB_URL = 'https://web-xstk-default-rtdb.asia-southeast1.firebasedatabase.app';

/* Linh vật Cú Đêm SVG */
function owl(s, w){
  s = s || 120; if(w === undefined) w = true;
  return '<svg viewBox="0 0 200 200" width="'+s+'" height="'+s+'" aria-label="Cú Đêm">' +
    '<polygon points="52,60 44,22 82,48" fill="#9C7BEF"/><polygon points="148,60 156,22 118,48" fill="#9C7BEF"/>' +
    '<ellipse cx="100" cy="122" rx="64" ry="64" fill="#B79CF5" stroke="#2D2A4A" stroke-width="4"/>' +
    '<ellipse cx="100" cy="146" rx="38" ry="40" fill="#FFF1D6"/>' +
    '<g fill="#9C7BEF" stroke="#2D2A4A" stroke-width="3"><ellipse cx="40" cy="135" rx="14" ry="28"/><ellipse class="'+(w?'wave':'')+'" cx="164" cy="132" rx="14" ry="28"/></g>' +
    '<circle cx="72" cy="98" r="24" fill="#fff" stroke="#2D2A4A" stroke-width="5"/><circle cx="128" cy="98" r="24" fill="#fff" stroke="#2D2A4A" stroke-width="5"/>' +
    '<line x1="96" y1="98" x2="104" y2="98" stroke="#2D2A4A" stroke-width="5"/>' +
    '<g class="blink"><circle cx="74" cy="100" r="10" fill="#2D2A4A"/><circle cx="126" cy="100" r="10" fill="#2D2A4A"/><circle cx="77" cy="96" r="3" fill="#fff"/><circle cx="129" cy="96" r="3" fill="#fff"/></g>' +
    '<polygon points="93,116 107,116 100,130" fill="#FFB84D" stroke="#2D2A4A" stroke-width="3"/>' +
    '<polygon points="48,52 100,30 152,52 100,72" fill="#2D2A4A"/><rect x="76" y="58" width="48" height="14" fill="#2D2A4A"/>' +
    '<line x1="152" y1="52" x2="156" y2="82" stroke="#FFC933" stroke-width="3"/><circle cx="156" cy="85" r="5" fill="#FFC933"/>' +
    '<g fill="#FFB84D" stroke="#2D2A4A" stroke-width="3"><ellipse cx="80" cy="186" rx="14" ry="6"/><ellipse cx="120" cy="186" rx="14" ry="6"/></g></svg>';
}

/* Kết nối Firebase */
var firebaseConfig = {
  apiKey: "AIzaSyAcSJ9u6JNPDZE6JX-LxxXLFehDHEm6Bo",
  authDomain: "web-xstk.firebaseapp.com",
  databaseURL: "https://web-xstk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-xstk",
  storageBucket: "web-xstk.firebasestorage.app",
  messagingSenderId: "129353981164",
  appId: "1:129353981164:web:bbd22cf1216b7ae0f759c9",
  measurementId: "G-CMNJ4BNPVE"
};

async function fbFetch(path, method, body){
  method = method || 'GET';
  try{
    var opts = { method:method, headers:{'Content-Type':'application/json'} };
    if(body !== undefined && body !== null) opts.body = JSON.stringify(body);
    var r = await fetch(FB_URL + '/' + path + '.json', opts);
    if(!r.ok) return null;
    return await r.json();
  }catch(e){ return null; }
}
function emailToKey(email){ return String(email || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_'); }
function myUid(){ return currentUser ? currentUser.uid : ''; }
function myName(){ return currentUser ? currentUser.displayName : (PROF.name || 'Khách'); }
function myAvatar(){ return currentUser ? (currentUser.photoURL || currentUser.avatar || '🦊') : '🦉'; }

function initFirebase(){
  try{
    if(window.firebase && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
    if(window.firebase){
      auth = firebase.auth();
      auth.onAuthStateChanged(function(u){
        if(u){
          var uid = 'gg_' + u.uid;
          currentUser = { uid:uid, displayName:u.displayName||u.email, email:u.email||'', photoURL:u.photoURL||'', avatar:'🦊' };
          ls.set('session_user', currentUser);
          PROF.name = currentUser.displayName; PROF.email = currentUser.email; ls.set('prof', PROF);
          fbFetch('users/' + uid, 'PUT', { uid:uid, name:currentUser.displayName, email:currentUser.email, av:currentUser.photoURL||'🦊', seen:Date.now() });
          renderAuth();
          if(typeof syncFB === 'function') syncFB();
          if(ST.view === 'forum' || ST.view === 'stats') render();
        }
      });
    }
  }catch(e){}
}

function openAuthModal(tab){
  var m = $('#authModal'); if(!m) return;
  switchAuthTab(tab || 'login');
  m.classList.remove('hidden'); m.classList.add('flex');
}
function closeAuthModal(){
  var m = $('#authModal'); if(!m) return;
  m.classList.add('hidden'); m.classList.remove('flex');
}
function switchAuthTab(tab){
  var isLogin = (tab === 'login');
  $('#formLogin').classList.toggle('hidden', !isLogin);
  $('#formRegister').classList.toggle('hidden', isLogin);
  $('#tabLoginBtn').classList.toggle('on', isLogin);
  $('#tabRegBtn').classList.toggle('on', !isLogin);
}
async function doRegister(){
  var name = ($('#rName').value || '').trim();
  var email = ($('#rEmail').value || '').trim().toLowerCase();
  var pass = ($('#rPass').value || '').trim();
  var av = ($('#rAvatar').value || '🦊');
  if(!name) return toast('⚠️ Vui lòng nhập Tên hiển thị!');
  if(!email || email.indexOf('@') < 1) return toast('⚠️ Vui lòng nhập Gmail hợp lệ!');
  if(pass.length < 4) return toast('⚠️ Mật khẩu tối thiểu 4 ký tự!');
  var eKey = emailToKey(email);
  toast('⏳ Đang tạo tài khoản...');
  var existing = await fbFetch('accounts/' + eKey);
  if(existing && existing.email) return toast('⚠️ Gmail này đã được đăng ký! Hãy chuyển qua Đăng nhập.');
  var uid = 'acc_' + eKey;
  var accData = { uid:uid, name:name, email:email, pass:btoa(unescape(encodeURIComponent(pass))), avatar:av, createdAt:Date.now() };
  await fbFetch('accounts/' + eKey, 'PUT', accData);
  await fbFetch('users/' + uid, 'PUT', { uid:uid, name:name, email:email, av:av, seen:Date.now() });
  currentUser = { uid:uid, displayName:name, email:email, photoURL:'', avatar:av };
  ls.set('session_user', currentUser);
  PROF.name = name; PROF.email = email; ls.set('prof', PROF);
  closeAuthModal(); renderAuth(); if(typeof syncFB==='function') await syncFB(); render();
  toast('🎉 Tạo tài khoản thành công! Chào ' + name);
}
async function doLogin(){
  var email = ($('#lEmail').value || '').trim().toLowerCase();
  var pass = ($('#lPass').value || '').trim();
  if(!email || !pass) return toast('⚠️ Nhập đầy đủ Gmail và Mật khẩu!');
  var eKey = emailToKey(email);
  var acc = await fbFetch('accounts/' + eKey);
  if(!acc || !acc.uid) return toast('❌ Chưa có tài khoản với Gmail này! Hãy bấm Tạo tài khoản.');
  if(acc.pass !== btoa(unescape(encodeURIComponent(pass)))) return toast('❌ Sai mật khẩu!');
  currentUser = { uid:acc.uid, displayName:acc.name, email:acc.email, photoURL:'', avatar:acc.avatar||'🦊' };
  ls.set('session_user', currentUser);
  PROF.name = acc.name; PROF.email = acc.email; ls.set('prof', PROF);
  await fbFetch('users/' + acc.uid, 'PUT', { uid:acc.uid, name:acc.name, email:acc.email, av:acc.avatar||'🦊', seen:Date.now() });
  closeAuthModal(); renderAuth(); if(typeof syncFB==='function') await syncFB(); render();
  toast('🎉 Đăng nhập thành công! Chào ' + acc.name);
}
function loginGooglePopup(){
  if(!auth) return toast('⚠️ Hãy đăng nhập bằng Gmail & Mật khẩu ở khung trên!');
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(function(){ closeAuthModal(); toast('🎉 Đăng nhập Google thành công!'); })
    .catch(function(){ toast('💡 Hãy nhập Gmail & Mật khẩu ở khung trên để tạo tài khoản/đăng nhập nhanh nhé!'); });
}
function logoutUser(){
  currentUser = null; ST.activeChatUid = null;
  MY_FRIENDS = {}; INCOMING_REQS = {}; OUTGOING_REQS = {}; DM_MSGS = {};
  ls.set('session_user', null);
  if(auth){ try{ auth.signOut(); }catch(e){} }
  renderAuth(); render(); toast('👋 Đã đăng xuất tài khoản!');
}
function renderAuth(){
  var el = $('#authArea'); if(!el) return;
  if(currentUser && currentUser.uid){
    var reqCount = Object.keys(INCOMING_REQS || {}).length;
    el.innerHTML = '<div class="flex items-center gap-2 bg-[#BFF1DC] px-3 py-1 rounded-full border-2 border-[#2D2A4A] text-xs font-black">' +
      (currentUser.photoURL ? '<img src="'+attr(currentUser.photoURL)+'" class="w-5 h-5 rounded-full border border-[#2D2A4A]">' : '<span class="text-base">'+(currentUser.avatar||'🦊')+'</span>') +
      '<span>'+esc(currentUser.displayName)+'</span>' +
      (reqCount ? '<span class="tag bg-[#FFD2D0] cursor-pointer" onclick="go(\'forum\')">🔔 '+reqCount+' lời mời KB</span>' : '') +
      '<button class="underline text-red-700 ml-1 font-extrabold" onclick="logoutUser()">Đăng xuất</button></div>';
  } else {
    el.innerHTML = '<button class="bt text-sm bg-[#BFF1DC]" onclick="openAuthModal(\'login\')">🔑 Đăng nhập</button>' +
                   '<button class="bt text-sm bg-white" onclick="openAuthModal(\'register\')">✨ Đăng ký</button>';
  }
}

/* Kết nối Gemini AI (Hỗ trợ cấu hình maxTokens cho phản hồi giọng nói siêu tốc) */
function U(id){ return ST.ui[id] || (ST.ui[id] = {msgs:[], run:true}); }
function markDone(id){
  var d = new Date(), f = d.toDateString();
  if(!prog.done.includes(id)) prog.done.push(id);
  if(prog.last !== f){
    var y = new Date(d - 86400000).toDateString();
    prog.streak = (prog.last === y) ? prog.streak + 1 : 1;
    prog.last = f;
  }
  ls.set('prog', prog);
}
function saveKey(){
  KEY = $('#key').value.trim();
  MODEL = $('#model').value.trim() || 'gemini-2.5-flash';
  ls.set('cfg', {k:KEY, m:MODEL});
  toast(KEY ? 'Đã lưu Gemini API Key! 🦉' : 'Đã xoá Key – dùng chế độ mẫu 🦉');
}
async function callGeminiOnce(modelName, contents, sys, genCfg){
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelName) + ':generateContent?key=' + encodeURIComponent(KEY);
  var bodyObj = {
    systemInstruction: { parts: [{ text: sys || 'Bạn là trợ giảng Xác suất Thống kê.' }] },
    contents: contents
  };
  if(genCfg) bodyObj.generationConfig = genCfg;
  var r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(bodyObj) });
  var j = await r.json();
  if(!r.ok) throw new Error((j.error && j.error.message) ? j.error.message : ('HTTP ' + r.status));
  var parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
  return parts.map(function(p){ return p.text || ''; }).join('');
}
async function ai(contents, sys, genCfg){
  if(!KEY) throw new Error('nokey');
  if(typeof contents === 'string') contents = [{role:'user', parts:[{text:contents}]}];
  var candidates = [MODEL, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.8-flash', 'gemini-3.0-flash'];
  var tried = {}, lastErr = null;
  for(var i = 0; i < candidates.length; i++){
    var m = candidates[i]; if(!m || tried[m]) continue; tried[m] = true;
    try{
      var res = await callGeminiOnce(m, contents, sys, genCfg);
      if(m !== MODEL){ MODEL = m; if($('#model')) $('#model').value = m; ls.set('cfg', {k:KEY, m:MODEL}); }
      return res;
    }catch(e){
      lastErr = e;
      var match = String(e.message).match(/models\/(gemini-[a-z0-9.-]+)/i);
      if(match && match[1] && !tried[match[1]]) candidates.splice(i + 1, 0, match[1]);
    }
  }
  throw lastErr || new Error('Không thể kết nối Gemini API');
}
function safeJSON(t){
  t = String(t).replace(/```json|```/g,'').trim();
  var a = t.indexOf('['), b = t.lastIndexOf(']');
  var c = t.indexOf('{'), d = t.lastIndexOf('}');
  if(a >= 0 && b > a && (c < 0 || a < c)) t = t.slice(a, b + 1);
  else if(c >= 0 && d > c) t = t.slice(c, d + 1);
  try{ return JSON.parse(t); }catch(e){}
  try{ return JSON.parse(t.replace(/\\(?![/bfnrtu"\\])/g, '\\\\')); }catch(e2){}
  throw new Error('Dữ liệu AI chưa đúng chuẩn JSON, vui lòng thử lại!');
}

/* ===== VOICE AI PHẢN HỒI SIÊU TỐC & PHÁT RA TIẾNG 100% ===== */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var VT = 'fl', VQ = null, vRec = null, vOn = false, speakOn = true, VNOANS = false;
var LAST_SPOKEN = '';

if('speechSynthesis' in window){
  window.speechSynthesis.getVoices();
  if(window.speechSynthesis.onvoiceschanged !== undefined){
    window.speechSynthesis.onvoiceschanged = function(){ window.speechSynthesis.getVoices(); };
  }
}

function cleanSpeechText(t){
  return String(t || '')
    .replace(/\$\$?/g, ' ')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, ' $1 phần $2 ')
    .replace(/\\sqrt\{([^}]+)\}/g, ' căn bậc hai của $1 ')
    .replace(/\\bar\{x\}/g, ' x ngang ')
    .replace(/\\mu/g, ' muy ')
    .replace(/\\sigma\^2/g, ' xích ma bình phương ')
    .replace(/\\sigma/g, ' xích ma ')
    .replace(/\\lambda/g, ' lam đa ')
    .replace(/\\alpha/g, ' an pha ')
    .replace(/\\Phi/g, ' hàm phi ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[*_#`~>{}\[\]\\]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function speak(t, force){
  if((!speakOn && !force) || !('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    var clean = cleanSpeechText(t);
    if(!clean) return;
    LAST_SPOKEN = clean;
    var u = new SpeechSynthesisUtterance(clean);
    u.lang = 'vi-VN';
    u.rate = 1.18;
    u.pitch = 1.05;
    var voices = window.speechSynthesis.getVoices() || [];
    var viVoice = voices.find(function(v){ return v.lang && v.lang.toLowerCase().indexOf('vi') >= 0; }) ||
                  voices.find(function(v){ return v.name && v.name.toLowerCase().indexOf('viet') >= 0; }) ||
                  voices.find(function(v){ return v.name && v.name.toLowerCase().indexOf('google') >= 0; });
    if(viVoice) u.voice = viVoice;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

function vBlock(b, qid, noans){
  return '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A]">' +
    '<div class="flex items-center gap-2 flex-wrap">' +
    '<button class="bt text-sm bg-[#BFF1DC]" onclick="vToggle(\''+b+'\',\''+(qid||'')+'\','+(!!noans)+')">🎙️ Bấm nói chuyện với AI</button>' +
    '<button class="bt text-xs bg-white" onclick="speak(LAST_SPOKEN, true)">🔊 Phát lại tiếng</button>' +
    '<span class="wv" data-b="'+b+'"><i></i><i></i><i></i><i></i><i></i></span>' +
    '<span class="text-sm font-bold text-indigo-900" id="s_'+b+'"></span></div>' +
    '<div class="mt-2 text-sm font-bold" id="o_'+b+'"></div></div>';
}

function vInit(){
  var r = new SR(); r.lang = 'vi-VN'; r.interimResults = true; r.continuous = false;
  r.onresult = function(e){
    if(r !== vRec) return;
    var t = ''; for(var i=0;i<e.results.length;i++) t += e.results[i][0].transcript;
    var sub = $('#s_'+VT); if(sub) sub.textContent = '🗣️ "' + t + '"';
    if(e.results[e.results.length-1].isFinal) vAsk(t.trim());
  };
  r.onend = function(){ if(r === vRec){ vOn = false; vUI(); } };
  r.onerror = function(){ if(r === vRec){ vOn = false; vUI(); } };
  return r;
}

function vToggle(b, qid, noans){
  /* Mở khóa kênh âm thanh của trình duyệt ngay khi người dùng bấm nút */
  if('speechSynthesis' in window){ try{ window.speechSynthesis.resume(); }catch(e){} }
  if(!SR) return toast('Trình duyệt chưa hỗ trợ thu âm, bạn hãy dùng Google Chrome hoặc Microsoft Edge nhé 🎙️');
  if(vOn && VT === b){ vRec.stop(); return; }
  if(vRec && vOn) vRec.stop();
  VT = b; VNOANS = !!noans; if(qid) VQ = qid;
  vRec = vInit(); vOn = true; vUI();
  try{ vRec.start(); }catch(e){ vOn = false; vUI(); }
}
function vUI(){ document.querySelectorAll('.wv').forEach(function(w){ w.classList.toggle('on', vOn && w.dataset.b === VT); }); }

async function vAsk(t){
  var out = $('#o_'+VT); if(!t || !out) return;
  out.innerHTML = '🦉 Cú Đêm đang phản hồi siêu tốc...';
  var q = VQ && allQ().find(function(x){ return x.id === VQ; });
  if(!KEY){
    var msg = q ? ('Gợi ý nhanh: ' + q.hint) : 'Bạn hãy dán Gemini API Key ở thanh trên cùng để Cú Đêm đàm thoại trực tiếp nhé!';
    out.innerHTML = '🦉 ' + msg; speak(msg, true); tx(); return;
  }
  try{
    var sysPrompt = 'Bạn là Giáo sư Cú Đêm. Trả lời bằng tiếng Việt CỰC KỲ NGẮN GỌN (chỉ 1-2 câu dưới 35 từ) để đọc thành tiếng ngay lập tức. Nếu có công thức, hãy viết thêm dòng cuối bắt đầu bằng "BANG_IPAD:" chứa công thức LaTeX $...$ để hiện lên bảng iPad.' +
      (q ? ('\nĐề đang hỏi: ' + q.q + '\n' + (VNOANS ? 'Không tiết lộ đáp án, chỉ gợi ý công thức.' : 'Lời giải: ' + q.sol)) : '');
    var r = await ai([{role:'user', parts:[{text:t}]}], sysPrompt, {maxOutputTokens: 160, temperature: 0.3});
    var parts = r.split('BANG_IPAD:');
    var spokenPart = parts[0].trim();
    var boardPart = parts[1] ? parts[1].trim() : spokenPart;
    ST.voiceBoardLatex = boardPart;
    if($('#voiceBoardBox')) $('#voiceBoardBox').innerHTML = '<div class="p-3 rounded-xl bg-white border-2 border-[#2D2A4A] mt-2">' + boardPart.replace(/\n/g,'<br>') + '</div>';
    out.innerHTML = '🦉 ' + spokenPart.replace(/\n/g,'<br>') + ' <button class="underline text-xs text-indigo-700 ml-2" onclick=" logMiss(VQ ? QM[VQ] : {id:\'oral_\'+Date.now(), ch:ST.ch, q:\''+attr(t)+'\', type:\'oral\', opts:[]}, \'oral\'); toast(\'Đã lưu câu hỏi vấn đáp này vào Thống kê lỗi sai!\')">📌 Đánh dấu câu này còn lúng túng</button>';
    speak(spokenPart, true);
    tx();
  }catch(e){ out.textContent = 'Lỗi: ' + e.message; }
}

/* Điều hướng tổng thể */
function go(v){
  clearInterval(ST.timer); ST.view = v;
  if(v === 'exam' && !(ST.ex && !ST.ex.done)) ST.ex = null;
  render();
}
function render(){
  var a = $('#app'); if(!a) return;
  $('#homeBtn').classList.toggle('hidden', ST.view === 'home');
  $('#nav').innerHTML = NAV.map(function(item){
    return '<button class="bt text-xs md:text-sm '+(ST.view===item[0]?'on':'')+'" onclick="go(\''+item[0]+'\')">'+item[1]+'</button>';
  }).join('');
  var views = {
    home: window.rHome,
    voice_ipad: window.rVoiceIpad,
    essay_sim: window.rEssaySim,
    mcq_sim: window.rMcqSim,
    stats: window.rStats,
    mindmap: window.rMindmap,
    polya_clone: window.rPolyaClone,
    exam: window.rExam,
    forum: window.rForum
  };
  var fn = views[ST.view] || window.rHome;
  if(typeof fn === 'function') fn(a);
  tx();
}

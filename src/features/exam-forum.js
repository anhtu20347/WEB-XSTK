/* ===== MODULE 8: ĐẤU TRƯỜNG THI THỬ BẤM GIỜ & DIỄN ĐÀN 100% NGƯỜI THẬT ===== */

/* --- ĐẤU TRƯỜNG THI THỬ BẤM GIỜ --- */
function cfgExam(a){
  var c = ST.cfg;
  var btn = function(k, v, l){ return '<button class="bt text-sm '+(c[k]===v?'on':'')+'" onclick="ST.cfg.'+k+'='+JSON.stringify(v)+';render()">'+l+'</button>'; };
  a.innerHTML =
    '<div class="pc p-5 bg-white">' +
      '<div class="flex items-center justify-between flex-wrap gap-2">' +
        '<h2 class="text-2xl font-black">⏰ Đấu Trường Thi Thử Bấm Giờ</h2>' +
        '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
      '</div>' +
      '<p class="font-bold mt-3">1. Chọn phạm vi kiến thức:</p><div class="flex flex-wrap gap-2 mt-1">' +
        btn('scope','all','Tổng hợp 7 chương') +
        CH.map(function(_, i){ return btn('scope', i+1, 'Chương '+(i+1)); }).join('') +
      '</div>' +
      '<p class="font-bold mt-3">2. Số lượng câu hỏi:</p><div class="flex gap-2 mt-1">' +
        [5,10,15,20].map(function(n){ return btn('n', n, n+' câu'); }).join('') +
      '</div>' +
      '<p class="font-bold mt-3">3. Thời gian làm bài:</p><div class="flex gap-2 mt-1">' +
        [10,15,30,45].map(function(m){ return btn('min', m, m+' phút'); }).join('') +
      '</div>' +
      '<div class="flex flex-wrap gap-3 mt-5">' +
        '<button class="bt bg-[#BFF1DC]" onclick="startEx(false)">📚 Bắt đầu Thi Thử ngay ('+c.n+' câu)</button>' +
        '<button class="bt" id="xbtn" onclick="startEx(true)">✨ Nhờ AI ra Đề Thi Mới ('+c.n+' câu)</button>' +
      '</div>' +
    '</div>';
}
async function startEx(useAI){
  var c = ST.cfg, qs = [];
  if(useAI && KEY){
    var b = $('#xbtn'); if(b){ b.disabled = true; b.textContent = '🦉 Đang ra đề thi...'; }
    try{ qs = await genAI({ch: c.scope==='all'?0:c.scope, type:'mcq', lv:'Vận dụng'}, c.n); }catch(e){}
  }
  if(qs.length < c.n){
    var pool = SAMPLE_EXAM.filter(function(q){ return c.scope==='all' || q.ch===c.scope; });
    var extra = buildPracticePack(c.scope==='all' ? 1 : c.scope, c.n, 'mcq');
    qs = qs.concat(pool).concat(extra).slice(0, c.n);
  }
  ST.ex = { qs:qs, ans:{}, done:false, end: Date.now() + c.min*60000 };
  render();
}
function exQ(q, i){
  var a = ST.ex.ans[q.id];
  return '<span class="tag bg-[#D9C9FF]">Câu '+(i+1)+' · Chương '+q.ch+'</span>' +
    '<div class="font-bold text-lg my-2">'+q.q+'</div>' +
    q.opts.map(function(o, k){ return '<button class="opt '+(a===k?'sel':'')+'" onclick="exPick('+i+','+k+')"><b>'+LB[k]+'.</b> '+o+'</button>'; }).join('') +
    vBlock('ex'+q.id, q.id, true);
}
function exPick(i, k){
  var q = ST.ex.qs[i]; ST.ex.ans[q.id] = k;
  $('#eq_'+i).innerHTML = exQ(q, i);
  var nv = $('#nv_'+i); if(nv) nv.classList.add('on');
  tx();
}
function submitEx(){
  var e = ST.ex; if(!e || e.done) return;
  clearInterval(ST.timer); e.done = true;
  e.ok = e.qs.filter(function(q){
    var r = (e.ans[q.id] === q.ans);
    recAtt(q, r); if(r) markDone(q.id); else logMiss(q, 'exam');
    return r;
  }).length;
  render();
}
function resExam(a){
  var e = ST.ex, n = e.qs.length, sc = (e.ok / n * 10).toFixed(1);
  var cm = sc >= 8 ? 'Xuất sắc! Bạn nắm kiến thức rất chắc 🎉' : (sc >= 5 ? 'Khá tốt! Hãy xem Bản đồ tư duy các câu sai bên dưới nhé 💪' : 'Cùng Cú Đêm xem Bản đồ tư duy và Vấn đáp từng câu bên dưới để gỡ rối nhé 🦉');
  a.innerHTML =
    '<div class="pc p-5 flex flex-wrap items-center gap-4 bg-white">' +
      '<div class="float">'+owl(105)+'</div>' +
      '<div><h2 class="text-3xl font-black">Điểm số: '+sc+' / 10</h2><p class="font-bold">Trả lời đúng '+e.ok+' / '+n+' câu</p><p class="mt-1">'+cm+'</p></div>' +
      '<button class="bt ml-auto" onclick="ST.ex=null;render()">🔁 Thi đề khác</button>' +
    '</div>' +
    '<h3 class="text-xl font-black mt-6">📝 Chữa bài chi tiết (Có Bản đồ tư duy, Truy vấn Tại sao &amp; Quy trình 4 bước Polya)</h3>' +
    e.qs.map(function(q, i){ return qcard(q, 'r', i+1); }).join('');
}
window.rExam = function(a){
  var e = ST.ex; if(!e) return cfgExam(a); if(e.done) return resExam(a);
  a.innerHTML =
    '<div class="pc p-3 sticky top-16 z-20 flex flex-wrap items-center gap-2 bg-white">' +
      '<b class="text-2xl text-red-600">⏰ <span id="clk">--:--</span></b>' +
      '<div class="flex gap-1 flex-wrap flex-1">' +
        e.qs.map(function(_, i){ return '<button id="nv_'+i+'" class="bt text-xs" onclick="document.getElementById(\'eq_'+i+'\').scrollIntoView({behavior:\'smooth\'})">'+(i+1)+'</button>'; }).join('') +
      '</div><button class="bt bg-[#BFF1DC] text-sm" onclick="submitEx()">📨 Nộp bài chấm điểm</button>' +
    '</div>' +
    e.qs.map(function(q, i){ QM[q.id] = q; return '<div class="pc p-4 my-4" id="eq_'+i+'">'+exQ(q, i)+'</div>'; }).join('');
  clearInterval(ST.timer);
  var tick = function(){
    var s = Math.max(0, (e.end - Date.now())/1000) | 0;
    var c = $('#clk'); if(c) c.textContent = String((s/60)|0).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    if(s <= 0) submitEx();
  };
  tick(); ST.timer = setInterval(tick, 500); tx();
};

/* --- DIỄN ĐÀN 100% NGƯỜI THẬT + KẾT BẠN 2 CHIỀU + TRÒ CHUYỆN RIÊNG 1-1 --- */
async function sendFriendReq(toUid, toName){
  if(!currentUser || !myUid()) return openAuthModal('login');
  if(!toUid || toUid === myUid()) return;
  if(MY_FRIENDS[toUid]) return toast('Hai bạn đã là bạn bè của nhau rồi! 🤝');
  var reqObj = { fromUid:myUid(), fromName:myName(), fromEmail:currentUser.email||'', fromAv:myAvatar(), t:Date.now() };
  OUTGOING_REQS[toUid] = true;
  await fbFetch('friend_reqs/' + toUid + '/' + myUid(), 'PUT', reqObj);
  await fbFetch('sent_reqs/' + myUid() + '/' + toUid, 'PUT', true);
  toast('📨 Đã gửi lời mời kết bạn tới ' + (toName || 'bạn học') + '!');
  if(ST.view === 'forum') render();
}
async function acceptFriendReq(fromUid, fromName){
  if(!currentUser || !myUid()) return;
  var me = myUid();
  MY_FRIENDS[fromUid] = true;
  delete INCOMING_REQS[fromUid];
  await fbFetch('friends/' + me + '/' + fromUid, 'PUT', true);
  await fbFetch('friends/' + fromUid + '/' + me, 'PUT', true);
  await fbFetch('friend_reqs/' + me + '/' + fromUid, 'DELETE');
  await fbFetch('sent_reqs/' + fromUid + '/' + me, 'DELETE');
  renderAuth();
  toast('🤝 Đã đồng ý kết bạn với ' + (fromName || 'bạn học') + '! Hãy bấm Nhắn tin để trò chuyện riêng.');
  if(ST.view === 'forum') render();
}
async function declineFriendReq(fromUid){
  if(!currentUser || !myUid()) return;
  var me = myUid();
  delete INCOMING_REQS[fromUid];
  await fbFetch('friend_reqs/' + me + '/' + fromUid, 'DELETE');
  await fbFetch('sent_reqs/' + fromUid + '/' + me, 'DELETE');
  renderAuth();
  toast('Đã từ chối lời mời kết bạn.');
  if(ST.view === 'forum') render();
}
function getPairId(uid1, uid2){ return [String(uid1), String(uid2)].sort().join('__'); }
async function openDM(friendUid){
  if(!currentUser || !myUid()) return openAuthModal('login');
  if(!MY_FRIENDS[friendUid]) return toast('⚠️ Hai bạn cần kết bạn và được đồng ý trước khi nhắn tin riêng tư!');
  ST.activeChatUid = friendUid;
  var pairId = getPairId(myUid(), friendUid);
  var msgs = await fbFetch('dms/' + pairId);
  DM_MSGS = (msgs && typeof msgs === 'object') ? msgs : {};
  if(ST.view !== 'forum') go('forum'); else render();
}
async function sendDM(){
  if(!currentUser || !ST.activeChatUid) return;
  var fUid = ST.activeChatUid;
  if(!MY_FRIENDS[fUid]) return toast('Chỉ có thể nhắn tin riêng với bạn bè đã kết nối!');
  var inp = $('#dmInput');
  var txt = (inp ? inp.value : ST.dmDraft).trim();
  if(!txt) return;
  var pairId = getPairId(myUid(), fUid);
  var msgId = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
  var msgObj = { id:msgId, senderUid:myUid(), senderName:myName(), text:txt, t:Date.now() };
  ST.dmDraft = ''; if(inp) inp.value = '';
  DM_MSGS[msgId] = msgObj;
  await fbFetch('dms/' + pairId + '/' + msgId, 'PUT', msgObj);
  if(ST.view === 'forum') render();
  var boxEl = $('#dmBox'); if(boxEl) boxEl.scrollTop = boxEl.scrollHeight;
}
async function pubPost(){
  if(!currentUser || !myUid()){ toast('🔐 Vui lòng Đăng nhập hoặc Tạo tài khoản để đăng bài!'); return openAuthModal('login'); }
  var body = ST.fdraft.trim(), title = ST.ftitle.trim() || 'Thảo luận Xác suất & Thống kê';
  if(!body) return toast('Bạn hãy viết nội dung trước khi đăng nhé ✍️');
  var ch = Number($('#fch') ? $('#fch').value : 1) || 1;
  var img = ($('#fdraw') && $('#fdraw').checked && PADIMG) ? PADIMG : '';
  var id = 'p' + Date.now().toString(36) + myUid().slice(-4);
  var p = { id:id, title:title, ch:ch, body:body, img:img, an:myName(), au:myUid(), aa:myAvatar(), t:Date.now(), likes:{}, comments:{} };
  POSTS[id] = p; ST.fdraft = ''; ST.ftitle = '';
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + id, 'PUT', p);
  toast('🎉 Đã đăng bài viết lên Diễn đàn!');
  if(ST.view === 'forum') render();
}
async function react(pid, kind){
  if(!currentUser || !myUid()){ toast('🔐 Vui lòng đăng nhập để thả cảm xúc!'); return openAuthModal('login'); }
  var x = POSTS[pid]; if(!x) return;
  x.likes = x.likes || {};
  var uid = myUid(), nv = (x.likes[uid] === kind) ? null : kind;
  if(nv) x.likes[uid] = nv; else delete x.likes[uid];
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + pid + '/likes/' + uid, 'PUT', nv);
  if(ST.view === 'forum') render();
}
async function comment(pid, txt){
  if(!currentUser || !myUid()){ toast('🔐 Vui lòng đăng nhập để bình luận!'); return openAuthModal('login'); }
  txt = (txt || '').trim(); if(!txt || !POSTS[pid]) return;
  var cid = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
  var c = { id:cid, body:txt, an:myName(), au:myUid(), aa:myAvatar(), t:Date.now() };
  POSTS[pid].comments = POSTS[pid].comments || {};
  POSTS[pid].comments[cid] = c;
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + pid + '/comments/' + cid, 'PUT', c);
  if(ST.view === 'forum') render();
}
function cmt(pid){ var v = ST.cd[pid] || ''; ST.cd[pid] = ''; comment(pid, v); }

async function syncFB(){
  var d = await fbFetch('posts_real');
  var chg = false;
  if(d && typeof d === 'object'){
    var newPosts = {};
    for(var id in d){
      var rPost = d[id]; if(!rPost || !rPost.id || rPost.au === 'owl') continue;
      newPosts[id] = Object.assign({}, rPost, {likes: rPost.likes||{}, comments: rPost.comments||{}});
    }
    if(JSON.stringify(newPosts) !== JSON.stringify(POSTS)){ POSTS = newPosts; ls.set('forum_real', POSTS); chg = true; }
  }
  if(currentUser && myUid()){
    var me = myUid();
    await fbFetch('users/' + me, 'PUT', { uid:me, name:myName(), email:currentUser.email||'', av:myAvatar(), seen:Date.now() });
    var fr = await fbFetch('friends/' + me);
    var newFriends = (fr && typeof fr === 'object') ? fr : {};
    if(JSON.stringify(newFriends) !== JSON.stringify(MY_FRIENDS)){ MY_FRIENDS = newFriends; chg = true; }
    var inReqs = await fbFetch('friend_reqs/' + me);
    var newIn = (inReqs && typeof inReqs === 'object') ? inReqs : {};
    if(JSON.stringify(newIn) !== JSON.stringify(INCOMING_REQS)){ INCOMING_REQS = newIn; renderAuth(); chg = true; }
    var outReqs = await fbFetch('sent_reqs/' + me);
    OUTGOING_REQS = (outReqs && typeof outReqs === 'object') ? outReqs : {};
    if(ST.activeChatUid && MY_FRIENDS[ST.activeChatUid]){
      var pairId = getPairId(me, ST.activeChatUid);
      var dmData = await fbFetch('dms/' + pairId);
      var newDM = (dmData && typeof dmData === 'object') ? dmData : {};
      if(Object.keys(newDM).length !== Object.keys(DM_MSGS).length){ DM_MSGS = newDM; chg = true; }
    }
  }
  var u = await fbFetch('users');
  if(u && typeof u === 'object'){ if(Object.keys(u).length !== Object.keys(USERS).length) chg = true; USERS = u; }
  if(chg && ST.view === 'forum'){
    var act = document.activeElement;
    if(!act || (act.tagName !== 'INPUT' && act.tagName !== 'TEXTAREA')) render();
  }
}
function startSync(){ clearInterval(fbPoll); syncFB(); fbPoll = setInterval(syncFB, 4000); }
function avHTML(av, cls){
  cls = cls || 'w-8 h-8';
  return (av && String(av).indexOf('http') === 0)
    ? '<img src="'+attr(av)+'" class="'+cls+' rounded-full border-2 border-[#2D2A4A] inline-block">'
    : '<span class="text-2xl">'+(av || '🦊')+'</span>';
}
function relationBtnHTML(targetUid, targetName){
  if(!targetUid || targetUid === myUid()) return '<span class="tag bg-[#FFF1B8]">Bạn</span>';
  if(MY_FRIENDS[targetUid]){
    return '<span class="tag bg-[#BFF1DC]">🤝 Bạn bè</span> <button class="bt text-xs bg-[#D9C9FF] ml-1" onclick="openDM(\''+targetUid+'\')">💬 Nhắn tin</button>';
  }
  if(INCOMING_REQS[targetUid]) return '<button class="bt text-xs bg-[#BFF1DC]" onclick="acceptFriendReq(\''+targetUid+'\',\''+attr(targetName)+'\')">✅ Đồng ý KB</button>';
  if(OUTGOING_REQS[targetUid]) return '<span class="tag bg-gray-100">⏳ Đã gửi lời mời</span>';
  return '<button class="bt text-xs bg-white" onclick="sendFriendReq(\''+targetUid+'\',\''+attr(targetName)+'\')">➕ Kết bạn</button>';
}
function postHTML(x){
  var likes = x.likes || {}, ks = Object.values(likes).filter(Boolean);
  var cnt = function(k){ return ks.filter(function(v){ return v===k; }).length; };
  var mine = myUid() ? likes[myUid()] : null;
  var cms = Object.values(x.comments || {}).filter(function(c){ return c && c.au !== 'owl'; }).sort(function(a,b){ return a.t - b.t; });
  var isFriend = x.au && MY_FRIENDS[x.au];
  return '<article class="pc p-4 '+(isFriend ? 'ring-4 ring-[#BFF1DC]' : '')+'">' +
    '<div class="flex items-center gap-2 flex-wrap">' + avHTML(x.aa) +
    '<div><b>'+esc(x.an || 'Thành viên')+'</b><div class="text-xs">'+new Date(x.t).toLocaleString('vi-VN')+' · Chương '+(x.ch||1)+'</div></div>' +
    '<div class="ml-auto flex items-center gap-1">' + relationBtnHTML(x.au, x.an) + '</div></div>' +
    '<h3 class="font-black text-lg mt-2">'+esc(x.title)+'</h3>' +
    '<div class="mt-1">'+esc(x.body).replace(/\n/g,'<br>')+'</div>' +
    (x.img ? '<img src="'+attr(x.img)+'" class="mt-2 rounded-xl border-2 border-[#2D2A4A] max-h-64">' : '') +
    '<div class="flex flex-wrap gap-2 mt-3">' +
    REACTS.map(function(r){ return '<button class="bt text-xs '+(mine===r[0]?'on':'')+'" onclick="react(\''+x.id+'\',\''+r[0]+'\')">'+r[1]+' '+cnt(r[0])+'</button>'; }).join('') +
    '</div>' +
    '<div class="mt-3 space-y-2">' +
    cms.map(function(c){
      var cFriend = c.au && MY_FRIENDS[c.au];
      return '<div class="rounded-2xl bg-[#F8FAFC] border-2 border-[#2D2A4A] p-2 text-sm"><b>'+esc(c.an)+'</b> '+(cFriend ? '<span class="tag bg-[#BFF1DC] text-[10px]">🤝 Bạn bè</span> ' : '')+': '+esc(c.body).replace(/\n/g,'<br>')+'</div>';
    }).join('') + '</div>' +
    '<div class="flex gap-2 mt-2"><input class="flex-1 text-sm" placeholder="Viết bình luận..." value="'+attr(ST.cd[x.id]||'')+'" oninput="ST.cd[\''+x.id+'\']=this.value" onkeydown="if(event.key===\'Enter\')cmt(\''+x.id+'\')"><button class="bt text-sm" onclick="cmt(\''+x.id+'\')">Gửi</button></div></article>';
}
window.rForum = function(a){
  var posts = Object.values(POSTS).filter(function(p){ return p && p.au !== 'owl'; }).sort(function(x,y){ return y.t - x.t; });
  var inList = Object.values(INCOMING_REQS || {});
  var friendUids = Object.keys(MY_FRIENDS || {}).filter(function(k){ return MY_FRIENDS[k]; });
  var allMembers = Object.values(USERS || {}).filter(function(u){ return u && u.uid && u.uid !== myUid(); });
  var activeFriend = ST.activeChatUid && USERS[ST.activeChatUid] ? USERS[ST.activeChatUid] : null;
  var dmList = Object.values(DM_MSGS || {}).sort(function(x,y){ return x.t - y.t; });

  a.innerHTML =
    '<div class="grid md:grid-cols-12 gap-4">' +
      '<aside class="md:col-span-4 space-y-4">' +
        '<div class="pc p-4 text-center">' +
          (currentUser ? (
            '<div>'+avHTML(myAvatar(),'w-14 h-14 mx-auto')+'</div><b class="block mt-2 text-lg">'+esc(myName())+'</b><div class="text-xs text-gray-600 font-bold">'+esc(currentUser.email)+'</div>' +
            '<div class="flex gap-2 justify-center mt-3"><button class="bt text-xs bg-white" onclick="go(\'stats\')">🪪 Hồ sơ</button><button class="bt text-xs bg-[#FFD2D0]" onclick="logoutUser()">🚪 Đăng xuất</button></div>'
          ) : (
            '<div class="text-3xl">🔐</div><b class="block mt-1">Bạn chưa đăng nhập</b><p class="text-xs mt-1">Hãy tạo tài khoản hoặc đăng nhập để kết bạn, nhắn tin riêng và đăng bài!</p>' +
            '<div class="flex gap-2 justify-center mt-3"><button class="bt text-xs bg-[#BFF1DC]" onclick="openAuthModal(\'login\')">🔑 Đăng nhập</button><button class="bt text-xs bg-[#D9C9FF]" onclick="openAuthModal(\'register\')">✨ Tạo tài khoản</button></div>'
          )) +
        '</div>' +
        '<div class="pc p-4 bg-[#FFF1B8]"><b>🔔 Lời mời kết bạn ('+inList.length+')</b>' +
          (inList.length ? inList.map(function(req){
            return '<div class="p-2 mt-2 bg-white rounded-xl border-2 border-[#2D2A4A] text-sm"><div class="font-bold">'+avHTML(req.fromAv,'w-5 h-5')+' '+esc(req.fromName)+' muốn kết bạn</div>' +
              '<div class="flex gap-2 mt-2"><button class="bt text-xs bg-[#BFF1DC] flex-1" onclick="acceptFriendReq(\''+req.fromUid+'\',\''+attr(req.fromName)+'\')">✅ Đồng ý</button><button class="bt text-xs bg-[#FFD2D0]" onclick="declineFriendReq(\''+req.fromUid+'\')">❌ Từ chối</button></div></div>';
          }).join('') : '<p class="text-xs mt-2">Chưa có lời mời kết bạn mới.</p>') +
        '</div>' +
        '<div class="pc p-4"><b>🤝 Bạn bè của tôi ('+friendUids.length+')</b>' +
          (friendUids.length ? friendUids.map(function(fUid){
            var fUser = USERS[fUid] || { name:'Bạn học', av:'🦊' };
            return '<div class="flex items-center gap-2 mt-2 p-2 rounded-xl bg-[#F8FAFC] border-2 border-[#2D2A4A] text-sm">' + avHTML(fUser.av,'w-6 h-6') + '<span class="flex-1 font-bold truncate">'+esc(fUser.name)+'</span><button class="bt text-xs bg-[#D9C9FF]" onclick="openDM(\''+fUid+'\')">💬 Nhắn tin</button></div>';
          }).join('') : '<p class="text-xs mt-2 text-gray-600">Hãy gửi lời mời kết bạn ở danh sách bên dưới nhé!</p>') +
        '</div>' +
        '<div class="pc p-4"><b>🌐 Thành viên Cộng đồng ('+allMembers.length+')</b><div class="max-h-60 overflow-y-auto space-y-2 mt-2">' +
          (allMembers.length ? allMembers.map(function(u){
            var isOnline = u.seen && (Date.now() - u.seen < 180000);
            return '<div class="flex items-center gap-2 p-2 rounded-xl border border-[#2D2A4A] text-xs"><span>'+(isOnline ? '🟢' : '⚪')+'</span><div class="flex-1 truncate"><b>'+esc(u.name)+'</b></div>' + relationBtnHTML(u.uid, u.name) + '</div>';
          }).join('') : '<p class="text-xs text-gray-600">Mời bạn bè tạo tài khoản để kết nối cùng nhau!</p>') +
        '</div></div>' +
      '</aside>' +
      '<section class="md:col-span-8 space-y-4">' +
        (ST.activeChatUid && MY_FRIENDS[ST.activeChatUid] ? (
          '<div class="pc p-4 bg-[#EFFFF8] border-4 border-[#2D2A4A]"><div class="flex items-center justify-between border-b-2 border-[#2D2A4A] pb-2"><div><b>💬 Trò chuyện riêng với: '+(activeFriend ? esc(activeFriend.name) : 'Bạn bè')+'</b> <span class="tag bg-[#BFF1DC] ml-1">🤝 Bạn bè</span></div><button class="bt text-xs bg-white" onclick="ST.activeChatUid=null;render()">Đóng ✕</button></div>' +
          '<div id="dmBox" class="max-h-64 overflow-y-auto my-3 space-y-2 p-2 bg-white rounded-xl border-2 border-[#2D2A4A]">' +
            (dmList.length ? dmList.map(function(m){
              var isMe = (m.senderUid === myUid());
              return '<div class="'+(isMe ? 'text-right' : 'text-left')+'"><div class="inline-block px-3 py-1.5 rounded-2xl border-2 border-[#2D2A4A] text-sm '+(isMe ? 'bg-[#BFF1DC]' : 'bg-[#F3EEFF]')+'"><b>'+esc(m.senderName)+':</b> '+esc(m.text)+'<div class="text-[10px] text-gray-600">'+new Date(m.t).toLocaleTimeString('vi-VN')+'</div></div></div>';
            }).join('') : '<p class="text-center text-xs text-gray-500 py-4">Gửi tin nhắn đầu tiên để bắt đầu trò chuyện riêng tư nhé 👋</p>') +
          '</div><div class="flex gap-2"><input id="dmInput" class="flex-1 text-sm" placeholder="Nhập tin nhắn riêng tư..." value="'+attr(ST.dmDraft)+'" oninput="ST.dmDraft=this.value" onkeydown="if(event.key===\'Enter\')sendDM()"><button class="bt bg-[#BFF1DC] text-sm" onclick="sendDM()">📨 Gửi</button></div></div>'
        ) : '') +
        '<div class="pc p-4"><b>📝 Đăng bài thảo luận lên Cộng đồng (100% Người thật)</b>' +
          '<input id="ftitle" class="w-full mt-2 text-sm" placeholder="Tiêu đề bài viết..." value="'+attr(ST.ftitle)+'" oninput="ST.ftitle=this.value">' +
          '<textarea id="fbody" rows="3" class="w-full mt-2 text-sm" placeholder="Chia sẻ câu hỏi, cách giải với bạn bè (hỗ trợ $...$)..." oninput="ST.fdraft=this.value">'+esc(ST.fdraft)+'</textarea>' +
          '<div class="flex flex-wrap gap-2 mt-2 items-center"><select id="fch" class="text-sm">'+CH.map(function(c,i){ return '<option value="'+(i+1)+'">Chương '+(i+1)+'</option>'; }).join('')+'</select><button class="bt ml-auto bg-[#BFF1DC] text-sm" onclick="pubPost()">📮 Đăng bài</button></div>' +
        '</div>' +
        (posts.length ? posts.map(postHTML).join('') : '<div class="pc p-6 text-center font-bold">🌐 Diễn đàn 100% người thật. Hãy đăng nhập và đăng bài viết đầu tiên để kết nối với bạn bè nhé!</div>') +
      '</section>' +
    '</div>';
  tx();
};

/* ===== KHỞI ĐỘNG TOÀN BỘ ỨNG DỤNG ===== */
(function bootstrap(){
  if($('#logo')) $('#logo').innerHTML = owl(42, false);
  document.body.insertAdjacentHTML('beforeend',
    '<div class="fixed bottom-4 right-4 z-40 text-right">' +
      '<div id="fpanel" class="hidden pc p-3 mb-2 w-80 max-h-[70vh] overflow-y-auto text-left text-sm">' +
        '<div class="flex items-center gap-2"><b>🦉 Trạm Vấn Đáp Voice AI</b>' +
        '<button class="bt text-xs ml-auto" onclick="speakOn=!speakOn;toast(speakOn?\'Đã bật tiếng 🔊\':\'Đã tắt tiếng 🔇\')">🔊 / 🔇</button></div>' +
        vBlock('fl','',false) +
      '</div>' +
      '<button class="bt bg-[#D9C9FF]" onclick="$(\'#fpanel\').classList.toggle(\'hidden\')">🎙️ Đàm thoại nhanh với Cú Đêm</button>' +
    '</div>'
  );
  var c = ls.get('cfg', {});
  KEY = c.k || '';
  MODEL = c.m || 'gemini-2.5-flash';
  if($('#key')) $('#key').value = KEY;
  if($('#model')) $('#model').value = MODEL;
  initFirebase();
  renderAuth();
  render();
  startSync();
})();

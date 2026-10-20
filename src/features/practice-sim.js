/* ===== MODULE 5: TÍNH NĂNG (b) TỰ LUẬN TƯƠNG TỰ & (c) TRẮC NGHIỆM TƯƠNG TỰ ===== */

/* --- (b) TẠO BÀI TẬP TƯƠNG TỰ TỰ LUẬN (SINH 5 BÀI + CHỈ CUNG CẤP CHIẾN LƯỢC GIẢI) --- */
window.rEssaySim = function(a){
  if(!ST.simEssayList.length){
    ST.simEssayList = buildPracticePack(ST.ch, 5, 'essay');
  }
  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#D9C9FF]">Chức năng độc lập (b)</span>' +
        '<h2 class="text-2xl font-black mt-1">📝🧭 Tạo 5 Bài Tập Tương Tự Tự Luận (Chỉ cung cấp Chiến lược giải)</h2>' +
        '<p class="text-sm font-bold text-gray-600">Đưa một bài toán mẫu hoặc chọn chương học -> AI tự động sinh 5 bài toán tương tự kèm Chiến lược giải để bạn tự rèn luyện.</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
    '</div>' +

    '<div class="pc p-4 bg-white">' +
      '<div class="flex flex-wrap gap-2 items-center">' +
        CH.map(function(c, i){
          return '<button class="bt text-xs '+(ST.ch===i+1?'on':'')+'" onclick="ST.ch='+(i+1)+';ST.simEssayList=buildPracticePack('+(i+1)+',5,\'essay\');ST.pi=0;render()">Chương '+(i+1)+'</button>';
        }).join('') +
      '</div>' +
      '<p class="font-bold mt-2 text-indigo-900">📘 Đang chọn Chương '+ST.ch+': '+CH[ST.ch-1]+'</p>' +
      '<textarea id="seedEssayInput" class="w-full mt-2 text-sm" rows="2" placeholder="Nhập đề bài toán tự luận mẫu của bạn vào đây (hoặc để trống để tạo theo Chương '+ST.ch+')..."></textarea>' +
      '<div class="flex flex-wrap gap-2 mt-2 items-center">' +
        '<select class="text-sm" onchange="ST.lv=this.value">' +
          ['Cơ bản','Vận dụng','Vận dụng cao'].map(function(l){ return '<option '+(ST.lv===l?'selected':'')+'>'+l+'</option>'; }).join('') +
        '</select>' +
        '<button id="btnGenEssay5" class="bt bg-[#BFF1DC] text-sm" onclick="gen5SimilarEssays()">✨ Sinh ngay 5 Bài Toán Tự Luận Tương Tự (Kèm Chiến lược giải)</button>' +
      '</div>' +
    '</div>' +

    '<div id="essaySimContainer" class="mt-4"></div>';

  renderEssaySimList();
};

function renderEssaySimList(){
  var list = ST.simEssayList, el = $('#essaySimContainer'); if(!el) return;
  if(ST.pi >= list.length) ST.pi = 0;
  el.innerHTML =
    '<div class="flex flex-wrap gap-1.5 items-center my-3">' +
      '<span class="font-black text-sm mr-2">Danh sách 5 bài tương tự:</span>' +
      list.map(function(_, i){
        return '<button class="bt text-sm '+(i===ST.pi?'on':'')+'" onclick="ST.pi='+i+';renderEssaySimList()">Bài '+(i+1)+'</button>';
      }).join('') +
      '<button class="bt text-xs ml-auto bg-white" onclick="ST.pi=(ST.pi+1)%'+list.length+';renderEssaySimList()">Bài tiếp theo ▶</button>' +
    '</div>' +
    qcard(list[ST.pi], 'strategy', ST.pi + 1);
  tx();
}

async function gen5SimilarEssays(){
  var seed = ($('#seedEssayInput') ? $('#seedEssayInput').value : '').trim();
  var b = $('#btnGenEssay5');
  if(b){ b.disabled = true; b.textContent = '🦉 AI đang sinh 5 bài toán tương tự & chiến lược giải...'; }
  try{
    if(KEY){
      var note = seed ? ('Tạo 5 bài toán tự luận TƯƠNG TỰ với bài toán gốc sau: "' + seed + '". Chỉ cung cấp chiến lược giải trong trường hint, không lộ đáp số trong hint.') : 'Tạo 5 bài toán tự luận thực tế có chiến lược giải từng bước rõ ràng.';
      var r = await genAI({ch:ST.ch, type:'essay', lv:ST.lv==='all'?'Vận dụng cao':ST.lv, note:note}, 5);
      ST.simEssayList = r.slice(0, 5);
      toast('🎉 Đã sinh 5 bài toán tự luận tương tự bằng AI!');
    } else {
      ST.simEssayList = buildPracticePack(ST.ch, 5, 'essay');
      toast('🎉 Đã sinh 5 bài toán tự luận tương tự Chương '+ST.ch+' kèm Chiến lược giải!');
    }
    ST.pi = 0;
  }catch(e){
    ST.simEssayList = buildPracticePack(ST.ch, 5, 'essay');
    toast('Đã nạp 5 bài toán tương tự Chương '+ST.ch+'! 🦉');
  }
  if(b){ b.disabled = false; b.textContent = '✨ Sinh ngay 5 Bài Toán Tự Luận Tương Tự (Kèm Chiến lược giải)'; }
  renderEssaySimList();
}

/* --- (c) TẠO BÀI TẬP TƯƠNG TỰ TRẮC NGHIỆM (CHẤM TỨC THÌ + ĐIỂM SỐ + HỎI TẠI SAO?) --- */
window.rMcqSim = function(a){
  if(!ST.simMcqList.length){
    var initPool = BANK.filter(function(q){ return q.ch === ST.ch && q.type === 'mcq'; });
    ST.simMcqList = initPool.concat(buildPracticePack(ST.ch, 15, 'mcq')).slice(0, 15);
  }
  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#FFF1B8]">Chức năng độc lập (c)</span>' +
        '<h2 class="text-2xl font-black mt-1">☑️⚡ Tạo Bài Tập Tương Tự Trắc Nghiệm (Chấm tức thì &amp; Truy vấn Tại sao?)</h2>' +
        '<p class="text-sm font-bold text-gray-600">Chấm kết quả ngay tức thì khi chọn đáp án, cập nhật bảng điểm trực tiếp và giải đáp câu hỏi "Tại sao chọn đáp án đó?".</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
    '</div>' +

    '<div class="pc p-4 bg-white">' +
      '<div class="flex flex-wrap gap-2 items-center">' +
        CH.map(function(c, i){
          return '<button class="bt text-xs '+(ST.ch===i+1?'on':'')+'" onclick="ST.ch='+(i+1)+';ST.simMcqList=buildPracticePack('+(i+1)+',ST.cnt,\'mcq\');ST.pi=0;render()">Chương '+(i+1)+'</button>';
        }).join('') +
      '</div>' +
      '<div class="flex flex-wrap gap-2 mt-3 items-center">' +
        '<input id="seedMcqInput" class="flex-1 min-w-[200px] text-sm" placeholder="Nhập dạng toán hoặc câu trắc nghiệm mẫu muốn tạo tương tự (tùy chọn)...">' +
        '<select class="text-sm" onchange="ST.cnt=+this.value">' +
          [5,10,15,20].map(function(n){ return '<option value="'+n+'" '+(ST.cnt===n?'selected':'')+'>Bộ '+n+' câu</option>'; }).join('') +
        '</select>' +
        '<button id="btnGenMcq" class="bt bg-[#BFF1DC] text-sm" onclick="genSimilarMcqs()">✨ Tạo '+ST.cnt+' Câu Trắc Nghiệm Tương Tự</button>' +
      '</div>' +
      /* Thanh Điểm số chấm tức thì */
      '<div id="mcqScoreBar" class="mt-3"></div>' +
    '</div>' +

    '<div id="mcqSimContainer" class="mt-4"></div>';

  updateMcqScoreBar();
  renderMcqSimList();
};

function updateMcqScoreBar(){
  var el = $('#mcqScoreBar'); if(!el) return;
  var ok = ST.mcqScore.ok, tot = ST.mcqScore.tot;
  var sc10 = tot ? (ok / tot * 10).toFixed(1) : '0.0';
  el.innerHTML = '<div class="p-3 rounded-2xl bg-[#EFFFF8] border-2 border-[#2D2A4A] flex flex-wrap items-center justify-between gap-2">' +
    '<div><b>⚡ Kết quả chấm tức thì:</b> Đã làm <b>'+tot+' câu</b> · Đúng <b>'+ok+' câu</b></div>' +
    '<div class="flex items-center gap-2">' +
      '<span class="tag bg-[#FFF1B8] text-sm py-1">Điểm hiện tại: '+sc10+' / 10</span>' +
      '<button class="bt text-xs bg-white" onclick="ST.mcqScore={ok:0,tot:0};updateMcqScoreBar()">🔄 Đặt lại điểm</button>' +
    '</div></div>';
}

function renderMcqSimList(){
  var list = ST.simMcqList, el = $('#mcqSimContainer'); if(!el) return;
  if(ST.pi >= list.length) ST.pi = 0;
  el.innerHTML =
    '<div class="flex flex-wrap gap-1 items-center my-3">' +
      '<button class="bt text-xs" onclick="ST.pi=(ST.pi-1+'+list.length+')%'+list.length+';renderMcqSimList()">◀ Câu trước</button>' +
      list.map(function(q, i){
        var u = U(q.id);
        var cls = (i === ST.pi) ? 'on' : (u.pick != null ? (u.pick===q.ans ? 'bg-[#9BEFC8]' : 'bg-[#FFAFB0]') : 'bg-white');
        return '<button class="bt text-xs '+cls+'" onclick="ST.pi='+i+';renderMcqSimList()">'+(i+1)+'</button>';
      }).join('') +
      '<button class="bt text-xs" onclick="ST.pi=(ST.pi+1)%'+list.length+';renderMcqSimList()">Câu tiếp ▶</button>' +
      '<span class="text-xs font-black ml-2">Câu '+(ST.pi+1)+' / '+list.length+'</span>' +
    '</div>' +
    qcard(list[ST.pi], 'p', ST.pi + 1);
  tx();
}

async function genSimilarMcqs(){
  var seed = ($('#seedMcqInput') ? $('#seedMcqInput').value : '').trim();
  var b = $('#btnGenMcq');
  if(b){ b.disabled = true; b.textContent = '🦉 Đang tạo '+ST.cnt+' câu trắc nghiệm tương tự...'; }
  try{
    if(KEY){
      var note = seed ? ('Tạo câu hỏi trắc nghiệm tương tự với mẫu: ' + seed) : 'Bài toán thực tế đa dạng mô hình 3D';
      var r = await genAI({ch:ST.ch, type:'mcq', lv:'Vận dụng cao', note:note}, ST.cnt);
      if(r.length < ST.cnt) r = r.concat(buildPracticePack(ST.ch, ST.cnt - r.length, 'mcq'));
      ST.simMcqList = r;
      toast('🎉 Đã tạo '+r.length+' câu trắc nghiệm tương tự bằng AI!');
    } else {
      ST.simMcqList = buildPracticePack(ST.ch, ST.cnt, 'mcq');
      toast('🎉 Đã tạo '+ST.cnt+' câu trắc nghiệm tương tự Chương '+ST.ch+'!');
    }
    ST.pi = 0;
  }catch(e){
    ST.simMcqList = buildPracticePack(ST.ch, ST.cnt, 'mcq');
    toast('Đã nạp '+ST.cnt+' câu trắc nghiệm Chương '+ST.ch+'! 🦉');
  }
  if(b){ b.disabled = false; b.textContent = '✨ Tạo '+ST.cnt+' Câu Trắc Nghiệm Tương Tự'; }
  renderMcqSimList();
}

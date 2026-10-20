/* ===== MODULE 4: TÍNH NĂNG (a) TƯƠNG TÁC GIỌNG NÓI KẾT HỢP BẢNG VIẾT IPAD & CHẤM BAREM ===== */
window.rVoiceIpad = function(a){
  var all = allQ(), cur = all.find(function(q){ return q.id === ST.tq; }) || all[0];
  ST.tq = cur.id;

  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#BFF1DC]">Chức năng độc lập (a)</span>' +
        '<h2 class="text-2xl font-black mt-1">🎙️✍️ Tương tác Giọng nói AI kết hợp Bảng viết iPad</h2>' +
        '<p class="text-sm font-bold text-gray-600">Hỏi đáp bằng lời nói kết hợp viết công thức lên bảng iPad (vì toán học khó diễn đạt hết qua lời nói) &amp; chấm điểm theo Barem.</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục Trang chủ</button>' +
    '</div>' +

    '<div class="grid md:grid-cols-12 gap-4">' +
      /* CỘT TRÁI (5 CỘT): ĐỀ BÀI, GIỌNG NÓI 2 CHIỀU, BẢNG PHẤN TOÁN HỌC CỦA AI & BAREM ĐIỂM */
      '<div class="pc p-4 md:col-span-5 space-y-3">' +
        '<h3 class="text-lg font-black">1. Chọn hoặc Tạo bài toán cần trao đổi</h3>' +
        '<select class="w-full text-sm" onchange="ST.tq=this.value;render()">' +
          all.map(function(q){ return '<option value="'+q.id+'" '+(q.id===cur.id?'selected':'')+'>Ch'+q.ch+' · '+esc(q.q.replace(/\$/g,'').slice(0,48))+'...</option>'; }).join('') +
        '</select>' +
        '<div class="p-3 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A] font-bold text-sm">' + cur.q + '</div>' +

        /* Trạm trao đổi giọng nói kết hợp Bảng Phấn AI */
        '<div class="p-3 rounded-2xl bg-[#F3EEFF] border-2 border-[#2D2A4A]">' +
          '<b>🎙️ Trao đổi Giọng nói trực tiếp với Cú Đêm</b>' +
          '<p class="text-xs font-bold text-gray-600 mt-0.5">Bấm nút nói để hỏi. AI sẽ phát tiếng trả lời ngay và viết công thức toán lên Bảng Phấn bên dưới:</p>' +
          vBlock('vi', cur.id, false) +
          '<div class="mt-2">' +
            '<b class="text-xs">📐 Bảng Phấn Toán Học Cú Đêm (Hiển thị công thức từ lời giảng):</b>' +
            '<div id="voiceBoardBox">' +
              (ST.voiceBoardLatex
                ? '<div class="p-3 rounded-xl bg-white border-2 border-[#2D2A4A] mt-1 text-sm">' + ST.voiceBoardLatex.replace(/\n/g,'<br>') + '</div>'
                : '<div class="p-3 rounded-xl bg-white border-2 border-dashed border-[#2D2A4A] mt-1 text-xs text-gray-500">Công thức LaTeX do AI trình bày khi trả lời giọng nói sẽ hiện tại đây...</div>') +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Barem chấm điểm tự chỉnh */
        '<div class="p-3 rounded-2xl bg-white border-2 border-[#2D2A4A]">' +
          '<b>⚖️ Barem điểm AI Tutor (Tự chỉnh được):</b>' +
          RUBRIC.map(function(r, i){
            return '<div class="flex gap-2 items-center my-1"><input class="flex-1 text-xs" value="'+attr(r.k)+'" onchange="RUBRIC['+i+'].k=this.value"><input type="number" step="0.5" class="w-16 text-xs" value="'+r.p+'" onchange="RUBRIC['+i+'].p=+this.value;rTutorSum()"></div>';
          }).join('') +
          '<div id="rsum" class="font-black text-sm mt-1 text-indigo-900"></div>' +
        '</div>' +
      '</div>' +

      /* CỘT PHẢI (7 CỘT): TẠO ĐỀ MỚI + BẢNG VIẾT IPAD TƯƠNG TÁC + NỘP ẢNH/PDF */
      '<div class="pc p-4 md:col-span-7">' +
        '<div class="p-3 rounded-2xl bg-[#EFFFF8] border-2 border-[#2D2A4A] mb-3">' +
          '<b>✨ Tạo đề bài mới bằng AI hoặc Nhập đề riêng lên Bảng iPad</b>' +
          '<div class="flex flex-wrap gap-2 mt-2">' +
            '<select class="text-sm" onchange="ST.tch=+this.value">'+CH.map(function(c,i){ return '<option value="'+(i+1)+'" '+(ST.tch===i+1?'selected':'')+'>Chương '+(i+1)+'</option>'; }).join('')+'</select>' +
            '<select class="text-sm" onchange="ST.tlv=this.value">'+['Cơ bản','Vận dụng','Vận dụng cao'].map(function(l){ return '<option '+(ST.tlv===l?'selected':'')+'>'+l+'</option>'; }).join('')+'</select>' +
            '<input id="treq" class="flex-1 min-w-[140px] text-sm" placeholder="Bối cảnh (vd: kiểm định y tế, cổ phiếu)">' +
            '<button class="bt text-sm bg-[#BFF1DC]" onclick="aiTutorNew()">✨ AI Tạo Đề</button>' +
          '</div>' +
          '<textarea id="tcustom" class="w-full mt-2 text-sm" rows="2" placeholder="Hoặc gõ / dán đề bài toán bạn muốn hỏi vào đây..."></textarea>' +
          '<div class="flex gap-2 flex-wrap mt-2">' +
            '<button class="bt text-xs" onclick="customTutor()">📝 Dùng đề tự nhập</button>' +
            '<label class="bt text-xs cursor-pointer bg-white">📷 Chụp/Tải ảnh đề bài<input type="file" accept="image/*" class="hidden" onchange="problemPhoto(this)"></label>' +
          '</div>' +
        '</div>' +

        /* Thanh công cụ Bảng viết iPad */
        '<div class="flex flex-wrap gap-1.5 items-center">' +
          '<b class="text-sm mr-1">📱 Bảng iPad:</b>' +
          ['#2D2A4A','#2563EB','#DC2626','#16A34A'].map(function(c){ return '<button class="bt" style="background:'+c+';width:1.8rem;height:1.8rem;padding:0" onclick="PEN.c=\''+c+'\';PEN.e=0"></button>'; }).join('') +
          '<select class="text-xs" onchange="PEN.w=+this.value"><option value="2">Nét 2</option><option value="4" selected>Nét 4</option><option value="8">Nét 8</option></select>' +
          '<button class="bt text-xs" onclick="PEN.e=1">🧽 Tẩy</button>' +
          '<button class="bt text-xs" onclick="undoPad()">↩️ Hoàn tác</button>' +
          '<button class="bt text-xs" onclick="clearPad()">🗑️ Xoá</button>' +
          ['∑','∫','μ','σ²','x̄','P(A|B)','Z='].map(function(s){ return '<button class="bt text-xs bg-white" onclick="symPad(\''+s+'\')">'+s+'</button>'; }).join('') +
        '</div>' +

        '<canvas id="ipad" width="720" height="420" class="w-full mt-2 rounded-2xl border-4 border-[#2D2A4A] bg-white" style="touch-action:none;background-image:linear-gradient(#e5e7eb 1px,transparent 1px),linear-gradient(90deg,#e5e7eb 1px,transparent 1px);background-size:28px 28px"></canvas>' +

        '<div class="flex flex-wrap gap-2 items-center mt-3">' +
          '<label class="bt text-xs cursor-pointer bg-white">📎 Đính kèm Ảnh / File PDF bài giải<input type="file" id="up" class="hidden" accept="image/png,image/jpeg,application/pdf" onchange="loadUp(this)"></label>' +
          '<span id="upname" class="text-xs font-bold"></span>' +
        '</div>' +
        '<div id="prev" class="mt-2"></div>' +

        '<div class="grid md:grid-cols-2 gap-2 mt-3">' +
          '<button class="bt bg-[#D9C9FF] text-sm py-2" onclick="askVoiceWithPad()">🎙️+📱 Hỏi đáp Giọng nói kèm Bảng iPad</button>' +
          '<button class="bt bg-[#BFF1DC] text-sm py-2" onclick="gradeTutor()">🦉 Chấm Điểm Bảng iPad / PDF Theo Barem</button>' +
        '</div>' +
        '<div id="tres" class="mt-3"></div>' +
      '</div>' +
    '</div>';

  initPad();
  rTutorSum();
  tx();
};

function rTutorSum(){
  var el = $('#rsum');
  if(el) el.textContent = 'Tổng điểm Barem: ' + RUBRIC.reduce(function(s,r){ return s + (Number(r.p)||0); }, 0) + ' / 10 điểm';
}
function snap(){
  var c = $('#ipad'); if(!c) return;
  var g = c.getContext('2d');
  PSTK.push(g.getImageData(0,0,c.width,c.height));
  if(PSTK.length > 20) PSTK.shift();
}
function initPad(){
  var c = $('#ipad'); if(!c) return;
  var g = c.getContext('2d'); PSTK = []; down = false;
  var pos = function(e){ var r = c.getBoundingClientRect(); return [(e.clientX-r.left)*c.width/r.width, (e.clientY-r.top)*c.height/r.height]; };
  c.onpointerdown = function(e){
    snap(); down = true; c.setPointerCapture(e.pointerId); last = pos(e);
    g.globalCompositeOperation = PEN.e ? 'destination-out' : 'source-over';
    g.strokeStyle = PEN.c; g.lineWidth = PEN.e ? 28 : PEN.w; g.lineCap = 'round'; g.lineJoin = 'round';
  };
  c.onpointermove = function(e){
    if(!down) return;
    var p = pos(e); g.beginPath(); g.moveTo(last[0],last[1]); g.lineTo(p[0],p[1]); g.stroke(); last = p;
  };
  c.onpointerup = c.onpointercancel = function(){ down = false; PADIMG = c.toDataURL('image/png'); };
}
function undoPad(){ var c = $('#ipad'); if(c && PSTK.length) c.getContext('2d').putImageData(PSTK.pop(),0,0); }
function clearPad(){ var c = $('#ipad'); if(!c) return; snap(); c.getContext('2d').clearRect(0,0,c.width,c.height); PADIMG = ''; }
function symPad(s){
  var c = $('#ipad'); if(!c) return;
  var g = c.getContext('2d'); snap();
  g.globalCompositeOperation = 'source-over'; g.fillStyle = PEN.c; g.font = '700 38px Nunito';
  g.fillText(s, 60+Math.random()*360, 100+Math.random()*220);
  PADIMG = c.toDataURL('image/png');
}
function loadUp(inp){
  var f = inp.files[0]; if(!f) return;
  var r = new FileReader();
  r.onload = function(){
    upFile = { mime: f.type || 'image/png', data: r.result.split(',')[1] };
    $('#upname').textContent = 'Đã chọn: ' + f.name;
    $('#prev').innerHTML = f.type === 'application/pdf'
      ? '<div class="p-2 pc bg-[#FFF1B8] text-xs font-bold">📄 Đã nạp tệp PDF: '+esc(f.name)+'</div>'
      : '<img src="'+r.result+'" class="max-h-40 rounded-xl border-2 border-[#2D2A4A]">';
  };
  r.readAsDataURL(f);
}
async function aiTutorNew(){
  var req = ($('#treq') ? $('#treq').value : '').trim();
  if(!KEY){
    var loc = buildPracticePack(ST.tch, 1, 'essay')[0];
    ST.gen.push(loc); ST.tq = loc.id; render();
    return toast('Đã tạo đề mới Chương '+ST.tch+' cho Bảng iPad! 🦉');
  }
  toast('🦉 AI đang soạn đề mới...');
  try{
    var r = await genAI({ch:ST.tch, type:'essay', lv:ST.tlv, note:req}, 1);
    ST.gen.push(r[0]); ST.tq = r[0].id; render();
  }catch(e){
    var fb = buildPracticePack(ST.tch, 1, 'essay')[0];
    ST.gen.push(fb); ST.tq = fb.id; render();
  }
}
function customTutor(){
  var t = ($('#tcustom') ? $('#tcustom').value : '').trim();
  if(!t) return toast('Bạn hãy gõ hoặc dán đề bài vào ô trước nhé ✍️');
  var q = M('u'+Date.now(), ST.tch, 'essay', 'Đề tự nhập', t, [], 0, 'Xác định công thức chính.', 'Áp dụng công thức chương '+ST.tch, 'bellcurve_3d', {}, '');
  ST.gen.push(q); ST.tq = q.id; render();
}
async function problemPhoto(inp){
  var f = inp.files[0]; if(!f) return;
  if(!KEY) return toast('Hãy nhập Gemini API Key ở thanh trên cùng để AI đọc chữ trong ảnh nhé 🦉');
  var r = new FileReader();
  r.onload = async function(){
    toast('🦉 Đang đọc đề bài từ ảnh...');
    try{
      var t = await ai([{role:'user', parts:[{text:'Chép lại chính xác đề bài toán trong ảnh bằng tiếng Việt, công thức viết dạng LaTeX $...$.'},{inlineData:{mimeType:f.type||'image/jpeg', data:r.result.split(',')[1]}}]}]);
      var q = M('u'+Date.now(), ST.tch, 'essay', 'Đề chụp ảnh', t.trim(), [], 0, '', '', 'bellcurve_3d', {}, '');
      ST.gen.push(q); ST.tq = q.id; render();
    }catch(e){ toast('Lỗi đọc ảnh: ' + e.message); }
  };
  r.readAsDataURL(f);
}

/* Kết hợp Giọng nói + Bảng viết iPad gửi cho AI */
async function askVoiceWithPad(){
  var all = allQ(), q = all.find(function(x){ return x.id === ST.tq; }) || all[0], el = $('#tres');
  if(!KEY) return toast('Hãy nhập Gemini API Key ở trên để Cú Đêm nhìn bảng iPad và trả lời bằng giọng nói nhé! 🦉');
  var c = $('#ipad'), t = document.createElement('canvas'); t.width = c.width; t.height = c.height;
  var tg = t.getContext('2d'); tg.fillStyle = '#fff'; tg.fillRect(0,0,t.width,t.height); tg.drawImage(c,0,0);
  var src = upFile ? {mimeType:upFile.mime, data:upFile.data} : {mimeType:'image/png', data:t.toDataURL('image/png').split(',')[1]};

  el.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 Cú Đêm đang nhìn bảng iPad và chuẩn bị trả lời bằng giọng nói...</div>';
  try{
    var prompt = 'Đề bài: '+q.q+'\nLời giải chuẩn: '+q.sol+'\nHãy quan sát nét viết/công thức của học sinh trên bảng iPad đính kèm. Trả lời gồm 2 phần cách nhau bởi từ khóa "BANG_IPAD:":\nPhần 1: Lời nhận xét ngắn gọn 2 câu bằng tiếng Việt để đọc bằng giọng nói.\nPhần 2 (sau chữ BANG_IPAD:): Trình bày rõ các bước biến đổi công thức LaTeX $...$ để hiện lên màn hình.';
    var res = await ai([{role:'user', parts:[{text:prompt},{inlineData:src}]}], 'Bạn là Giáo sư Cú Đêm giảng bài qua bảng iPad và giọng nói.', {maxOutputTokens:350});
    var parts = res.split('BANG_IPAD:');
    var spoken = parts[0].trim();
    var board = parts[1] ? parts[1].trim() : res;
    ST.voiceBoardLatex = board;
    if($('#voiceBoardBox')) $('#voiceBoardBox').innerHTML = '<div class="p-3 rounded-xl bg-white border-2 border-[#2D2A4A] mt-1 text-sm">'+board.replace(/\n/g,'<br>')+'</div>';
    el.innerHTML = '<div class="pc p-4 bg-[#EFFFF8] text-sm"><b>🗣️ Lời giảng Cú Đêm:</b> '+spoken.replace(/\n/g,'<br>')+'<hr class="my-2 border-[#2D2A4A]"><b>📐 Trình bày trên bảng:</b><br>'+board.replace(/\n/g,'<br>')+'</div>';
    speak(spoken, true);
    tx();
  }catch(e){ el.innerHTML = 'Lỗi: ' + esc(e.message); }
}

async function gradeTutor(){
  var all = allQ(), q = all.find(function(x){ return x.id === ST.tq; }) || all[0], el = $('#tres');
  if(!KEY) return toast('Hãy nhập Gemini API Key ở trên để AI Tutor chấm điểm nhé 🦉');
  var src = null;
  if(upFile){ src = {mimeType: upFile.mime, data: upFile.data}; }
  else {
    if(!PSTK.length) return toast('Bạn hãy viết lời giải lên bảng iPad hoặc tải ảnh/PDF lên trước nhé ✍️');
    var c = $('#ipad'), t = document.createElement('canvas'); t.width = c.width; t.height = c.height;
    var tg = t.getContext('2d'); tg.fillStyle = '#fff'; tg.fillRect(0,0,t.width,t.height); tg.drawImage(c,0,0);
    src = {mimeType:'image/png', data: t.toDataURL('image/png').split(',')[1]};
  }
  el.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 AI Tutor đang đọc bài làm và chấm theo Barem...</div>';
  var prompt = 'Đề bài: '+q.q+'\nLời giải chuẩn: '+q.sol+'\nBarem điểm:\n'+RUBRIC.map(function(r){ return '- '+r.k+': '+r.p+'đ'; }).join('\n')+'\nHãy đọc bài làm trong ảnh/PDF đính kèm, chấm điểm từng mục theo Barem, chỉ rõ chỗ đúng/sai và cuối cùng ghi Tổng: X/10. Dùng LaTeX $...$.';
  try{
    var res = await ai([{role:'user', parts:[{text:prompt},{inlineData:src}]}], 'Bạn là Giáo sư Cú Đêm chấm bài công tâm.');
    el.innerHTML = '<div class="pc p-4 bg-[#EFFFF8] text-sm">'+res.replace(/\n/g,'<br>')+'</div>';
    var sc = scoreOf(res); if(sc !== null){ recAtt(q, sc >= 5); if(sc < 5) logMiss(q, 'essay'); }
  }catch(e){ el.innerHTML = '<div class="pc p-3 bg-[#FFD2D0]">Lỗi: '+esc(e.message)+'</div>'; }
  tx();
}

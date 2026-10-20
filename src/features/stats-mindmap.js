/* ===== MODULE 6: TÍNH NĂNG (d) THỐNG KÊ LỖI SAI 3 NGUỒN & (e) BẢN ĐỒ TƯ DUY ===== */

function mastery(ch){ var a = ATT[ch]; return (a && a.n) ? Math.round(a.ok / a.n * 100) : 0; }
function xp(){ return prog.done.length * 10 + prog.streak * 5; }
function saveProf(){
  PROF.name = $('#pn').value.trim();
  PROF.sid = $('#psid').value.trim();
  PROF.cls = $('#pcls').value.trim();
  PROF.title = $('#ptitle').value;
  if(currentUser){ currentUser.displayName = PROF.name || currentUser.displayName; ls.set('session_user', currentUser); }
  ls.set('prof', PROF); renderAuth(); toast('Đã cập nhật Hồ sơ cá nhân! 🎓');
}

/* --- (d) THỐNG KÊ CÂU HỎI & NỘI DUNG SAI (VẤN ĐÁP, TRẮC NGHIỆM, TỰ LUẬN) --- */
window.rStats = function(a){
  var lvl = Math.floor(xp()/100) + 1;
  var vals = Object.values(ATT), tot = vals.reduce(function(s,x){ return s+x.n; }, 0), okT = vals.reduce(function(s,x){ return s+x.ok; }, 0);
  var avg = tot ? Math.round(okT/tot*100) : 0;

  var missOral = miss.filter(function(m){ return m.mode === 'oral'; });
  var missMcq = miss.filter(function(m){ return m.mode === 'mcq' || m.mode === 'exam'; });
  var missEssay = miss.filter(function(m){ return m.mode === 'essay'; });
  var mx = Math.max(1, Math.max.apply(null, CH.map(function(_,i){ return miss.filter(function(m){ return m.ch===i+1; }).length; })));

  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#FFD2D0]">Chức năng độc lập (d)</span>' +
        '<h2 class="text-2xl font-black mt-1">📊🩺 Thống Kê Câu Hỏi Sai &amp; Hồ Sơ AI Học Xác Suất Thống Kê</h2>' +
        '<p class="text-sm font-bold text-gray-600">Tổng hợp lỗi sai về Vấn đáp, Trắc nghiệm, Tự luận -> Đưa ra nhận định chung và hướng khắc phục.</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
    '</div>' +

    /* 3 Thẻ thống kê riêng biệt cho Vấn đáp, Trắc nghiệm, Tự luận */
    '<div class="grid md:grid-cols-3 gap-4 mb-4">' +
      '<div class="pc p-4 bg-[#D9C9FF] text-center"><div class="text-3xl font-black">'+missOral.length+'</div><b class="text-sm">🎙️ Lỗi sai / Lúng túng về Vấn đáp</b></div>' +
      '<div class="pc p-4 bg-[#FFF1B8] text-center"><div class="text-3xl font-black">'+missMcq.length+'</div><b class="text-sm">☑️ Câu trả lời sai về Trắc nghiệm</b></div>' +
      '<div class="pc p-4 bg-[#FFD2D0] text-center"><div class="text-3xl font-black">'+missEssay.length+'</div><b class="text-sm">✍️ Bài làm sai về Tự luận / iPad</b></div>' +
    '</div>' +

    '<div class="grid md:grid-cols-3 gap-4">' +
      '<div class="pc p-5"><h3 class="text-xl font-black">🪪 Hồ Sơ Sinh Viên</h3>' +
        '<div class="text-center my-3">'+(currentUser && currentUser.photoURL ? '<img src="'+attr(currentUser.photoURL)+'" class="w-16 h-16 rounded-full mx-auto border-4 border-[#2D2A4A]">' : '<div class="inline-block">'+owl(85,false)+'</div>')+'</div>' +
        '<label class="block text-sm font-bold mt-2">Họ và tên<input id="pn" class="w-full mt-1" value="'+attr(myName())+'"></label>' +
        '<label class="block text-sm font-bold mt-2">Mã số SV<input id="psid" class="w-full mt-1" value="'+attr(PROF.sid)+'"></label>' +
        '<label class="block text-sm font-bold mt-2">Trường / Lớp<input id="pcls" class="w-full mt-1" value="'+attr(PROF.cls)+'"></label>' +
        '<label class="block text-sm font-bold mt-2">Danh hiệu<select id="ptitle" class="w-full mt-1">'+TITLES.map(function(t){ return '<option '+(PROF.title===t?'selected':'')+'>'+t+'</option>'; }).join('')+'</select></label>' +
        '<button class="bt mt-3 w-full bg-[#BFF1DC]" onclick="saveProf()">💾 Lưu Hồ sơ</button>' +
        '<div class="flex flex-wrap gap-2 mt-3 justify-center"><span class="tag bg-[#FFF1B8]">Level '+lvl+'</span><span class="tag bg-[#BFF1DC]">'+xp()+' XP</span><span class="tag bg-[#D9C9FF]">TB đúng '+avg+'%</span></div>' +
      '</div>' +

      '<div class="pc p-5 md:col-span-2">' +
        '<h3 class="text-xl font-black">🧭 Mức độ thành thạo &amp; Phân bố lỗi sai 7 Chương</h3>' +
        CH.map(function(c, i){
          var m = mastery(i+1), n = ATT[i+1] ? ATT[i+1].n : 0;
          return '<div class="my-1.5 text-xs"><div class="flex justify-between font-bold"><span>Chương '+(i+1)+': '+c+'</span><span>'+(n ? m+'%' : 'Chưa làm')+'</span></div>' +
            '<div class="bg-white border-2 border-[#2D2A4A] rounded-full h-3.5 overflow-hidden"><div class="h-full bg-[#BFF1DC]" style="width:'+m+'%"></div></div></div>';
        }).join('') +

        '<div class="flex gap-2 flex-wrap mt-4">' +
          '<button class="bt bg-[#D9C9FF] text-sm" onclick="analyzeMiss()">🦉 AI Nhận Định Chung Lỗi Sai &amp; Hướng Khắc Phục</button>' +
          '<button class="bt bg-[#BFF1DC] text-sm" onclick="remed()">🎯 Tạo Bài Tập Bổ Trợ Khắc Phục</button>' +
          '<button class="bt bg-white text-xs" onclick="clearMiss()">🗑️ Xoá lịch sử</button>' +
        '</div>' +
        '<div id="ana" class="mt-3"></div>' +

        '<h4 class="font-black mt-4 text-sm">📋 Danh sách các nội dung sai đã ghi nhận:</h4>' +
        '<div class="max-h-52 overflow-y-auto mt-1">' +
          (miss.length ? miss.slice().reverse().map(function(m){
            return '<div class="opt text-xs"><b>[Chương '+m.ch+' · '+(MODES[m.mode]||'Bài tập')+']</b> '+m.q+'<br><span class="text-indigo-800">Đáp án / Hướng chuẩn: '+m.ans+'</span></div>';
          }).join('') : '<p class="text-xs text-gray-600 mt-1">Chưa có lỗi sai nào được ghi nhận. Khi bạn làm sai ở Trắc nghiệm, Tự luận hoặc Vấn đáp, hệ thống sẽ tự động tổng hợp tại đây!</p>') +
        '</div>' +
      '</div>' +
    '</div>';
  tx();
};

async function analyzeMiss(){
  var el = $('#ana'); if(!el) return;
  if(!miss.length){
    el.innerHTML = '<div class="pc p-4 bg-[#EFFFF8] text-sm"><b>🦉 Nhận định từ AI:</b> Hiện tại bạn chưa có câu sai nào. Nếu gặp khó khăn ở Chương nào, bạn có thể bấm nút <b>"🎯 Tạo Bài Tập Bổ Trợ Khắc Phục"</b> để rèn luyện sâu hơn nhé!</div>';
    return;
  }
  if(!KEY){
    el.innerHTML = '<div class="pc p-4 bg-[#F3EEFF] text-sm"><b>🦉 Nhận định chung về lỗi sai:</b> Hệ thống ghi nhận <b>'+miss.length+' lỗi</b> (Vấn đáp, Trắc nghiệm, Tự luận).<br>• <b>Nguyên nhân phổ biến:</b> Nhầm lẫn điều kiện không hoàn lại và có hoàn lại; quên chia cho $\\sqrt{n}$ khi tính sai số chuẩn.<br>• <b>Hướng khắc phục:</b> Ôn lại Sơ đồ tư duy chương tương ứng và luyện 5 bài tự luận tương tự theo chiến lược.</div>';
    tx(); return;
  }
  el.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 AI đang tổng hợp lỗi sai ở cả 3 mảng (Vấn đáp, Trắc nghiệm, Tự luận)...</div>';
  try{
    var list = miss.slice(-25).map(function(m){ return 'Ch'+m.ch+' ['+(MODES[m.mode]||m.mode)+']: '+m.q; }).join('\n');
    var res = await ai('Danh sách lỗi sai của học sinh:\n'+list+'\nHãy phân tích rõ: (1) Nhận định chung về bản chất lỗi sai ở Vấn đáp, Trắc nghiệm, Tự luận; (2) Hướng khắc phục cụ thể cho từng hướng sai này. Dùng LaTeX $...$.');
    el.innerHTML = '<div class="pc p-4 bg-[#F3EEFF] text-sm">'+res.replace(/\n/g,'<br>')+'</div>';
  }catch(e){ el.innerHTML = 'Lỗi: ' + esc(e.message); }
  tx();
}

function remed(){
  var tried = [1,2,3,4,5,6,7].filter(function(i){ return ATT[i] && ATT[i].n; });
  var weak = tried.length ? tried.sort(function(a,b){ return mastery(a) - mastery(b); })[0] : (miss.length ? miss[miss.length-1].ch : 1);
  ST.ch = weak;
  ST.simMcqList = buildPracticePack(weak, 10, 'mcq');
  ST.pi = 0;
  toast('Đã tạo bộ 10 câu hỏi bổ trợ khắc phục lỗ hổng Chương '+weak+'! 🎯');
  go('mcq_sim');
}

/* --- (e) BẢN ĐỒ TƯ DUY XÁC SUẤT THỐNG KÊ (7 CHƯƠNG + TẠO THEO CHỦ ĐỀ) --- */
var CHAPTER_MINDMAPS = {
  1: {
    root: 'Chương 1: Xác suất & Các công thức tính xác suất',
    branches: [
      { title:'📌 Khái niệm & Phép đếm', bg:'#D9C9FF', items:['Không gian mẫu $\\Omega$, biến cố $A$', 'Hoán vị $P_n=n!$, Tổ hợp $C_n^k=\\frac{n!}{k!(n-k)!}$', 'Xác suất cổ điển: $P(A)=\\frac{|A|}{|\\Omega|}$'] },
      { title:'📋 Quy tắc Cộng & Nhân', bg:'#BFF1DC', items:['Cộng: $P(A\\cup B)=P(A)+P(B)-P(AB)$', 'Xác suất có điều kiện: $P(A|B)=\\frac{P(AB)}{P(B)}$', 'Nhân độc lập: $P(AB)=P(A)\\cdot P(B)$'] },
      { title:'🧮 Đầy đủ & Công thức Bayes', bg:'#FFD2D0', items:['Hệ đầy đủ $B_1, B_2, ..., B_n$', 'Đầy đủ: $P(A)=\\sum P(B_i)P(A|B_i)$', 'Bayes: $P(B_k|A)=\\frac{P(B_k)P(A|B_k)}{P(A)}$'] },
      { title:'⚠️ Dấu hiệu & Bẫy hay sai', bg:'#FFF1B8', items:['Phân biệt rõ "Có hoàn lại" và "Không hoàn lại"', 'Đã biết kết quả tìm nguyên nhân -> Dùng Bayes', 'Bẫy: Nhầm $P(A|B)$ với $P(B|A)$'] }
    ]
  },
  2: {
    root: 'Chương 2: Biến ngẫu nhiên & Các số đặc trưng',
    branches: [
      { title:'📌 Biến ngẫu nhiên Rời rạc', bg:'#D9C9FF', items:['Bảng phân phối xác suất $(x_i, p_i)$', 'Điều kiện chuẩn hóa: $\\sum p_i = 1$', 'Hàm phân phối $F(x)=P(X<x)$'] },
      { title:'📋 Biến ngẫu nhiên Liên tục', bg:'#BFF1DC', items:['Hàm mật độ $f(x)\\ge 0$', '$\\int_{-\\infty}^{+\\infty} f(x)dx = 1$', '$P(a<X<b)=\\int_a^b f(x)dx$'] },
      { title:'🧮 Kỳ vọng & Phương sai', bg:'#FFD2D0', items:['Kỳ vọng (Trung bình): $E(X)=\\sum x_i p_i$', 'Phương sai (Rủi ro): $Var(X)=E(X^2)-[E(X)]^2$', 'Độ lệch chuẩn: $\\sigma=\\sqrt{Var(X)}$'] },
      { title:'⚠️ Tính chất & Bẫy hay sai', bg:'#FFF1B8', items:['$E(aX+b)=aE(X)+b$', '$Var(aX+b)=a^2 Var(X)$ (hằng số $b$ triệt tiêu)', 'Bẫy: Quên bình phương hệ số $a$ khi tính $Var$'] }
    ]
  },
  3: {
    root: 'Chương 3: Các quy luật phân phối xác suất thông dụng',
    branches: [
      { title:'📌 Phân phối Nhị thức B(n, p)', bg:'#D9C9FF', items:['$n$ phép thử độc lập, xác suất thành công $p$', '$P(X=k)=C_n^k p^k (1-p)^{n-k}$', '$E(X)=np,\\quad Var(X)=np(1-p)$'] },
      { title:'📋 Phân phối Poisson P(λ)', bg:'#BFF1DC', items:['Số sự kiện hiếm xảy ra trong 1 đơn vị thời gian', '$P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}$', '$E(X)=Var(X)=\\lambda$'] },
      { title:'🧮 Phân phối Chuẩn N(μ, σ²)', bg:'#FFD2D0', items:['Đường cong hình chuông đối xứng qua $\\mu$', 'Chuẩn hóa: $Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1)$', '$P(a<X<b)=\\Phi(\\frac{b-\\mu}{\\sigma})-\\Phi(\\frac{a-\\mu}{\\sigma})$'] },
      { title:'⚠️ Bẫy hay sai', bg:'#FFF1B8', items:['Nhầm $\\sigma^2$ (phương sai) với $\\sigma$ (độ lệch chuẩn)', 'Tính $P(X>a)$ quên lấy phần bù $1-\\Phi(z)$', 'Bốc không hoàn lại phải dùng Siêu bội'] }
    ]
  },
  4: {
    root: 'Chương 4: Mẫu ngẫu nhiên & Các số đặc trưng mẫu',
    branches: [
      { title:'📌 Mẫu ngẫu nhiên kích thước n', bg:'#D9C9FF', items:['Lấy mẫu ngẫu nhiên đại diện cho tổng thể', 'Bảng tần số $(x_i, n_i)$ với $\\sum n_i = n$', 'Tần suất mẫu $f = k/n$'] },
      { title:'📋 Trung bình mẫu x̄', bg:'#BFF1DC', items:['$\\bar{x}=\\frac{1}{n}\\sum n_i x_i$', 'Là ước lượng không chệch của $\\mu$', '$E(\\bar{X})=\\mu,\\quad Var(\\bar{X})=\\frac{\\sigma^2}{n}$'] },
      { title:'🧮 Phương sai mẫu s²', bg:'#FFD2D0', items:['Phương sai mẫu: $\\hat{s}^2=\\frac{1}{n}\\sum(x_i-\\bar{x})^2$', 'Phương sai hiệu chỉnh: $s^2=\\frac{1}{n-1}\\sum(x_i-\\bar{x})^2$', 'Độ lệch chuẩn mẫu hiệu chỉnh: $s=\\sqrt{s^2}$'] },
      { title:'⚠️ Bẫy hay sai', bg:'#FFF1B8', items:['Luôn ưu tiên dùng $s^2$ (chia cho $n-1$) trong ước lượng & kiểm định', 'Khi bấm máy Casio chú ý ký hiệu $s_x$ và $\\sigma_x$'] }
    ]
  },
  5: {
    root: 'Chương 5: Khoảng ước lượng tham số thống kê',
    branches: [
      { title:'📌 Nguyên lý Khoảng tin cậy', bg:'#D9C9FF', items:['Độ tin cậy $1-\\alpha$ (thường 95% $\\Rightarrow z=1{,}96$)', 'Ngưỡng sai số ước lượng $\\varepsilon$', 'Khoảng đối xứng: $(\\bar{x}-\\varepsilon;\\, \\bar{x}+\\varepsilon)$'] },
      { title:'📋 Ước lượng Trung bình μ (Biết σ)', bg:'#BFF1DC', items:['Sai số: $\\varepsilon = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$', 'Khoảng tin cậy: $\\bar{x}\\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$'] },
      { title:'🧮 Ước lượng Trung bình (Chưa biết σ) & Tỷ lệ p', bg:'#FFD2D0', items:['Dùng phân phối Student $t_{n-1}^{\\alpha/2}$ khi $n<30$: $\\varepsilon=t\\frac{s}{\\sqrt{n}}$', 'Ước lượng tỷ lệ $p$: $f\\pm z_{\\alpha/2}\\sqrt{\\frac{f(1-f)}{n}}$'] },
      { title:'⚠️ Bài toán Tìm cỡ mẫu n', bg:'#FFF1B8', items:['Cho trước sai số $\\varepsilon_0$: $n \\ge (\\frac{z_{\\alpha/2}\\sigma}{\\varepsilon_0})^2$', 'Luôn làm tròn $n$ LÊN số nguyên gần nhất'] }
    ]
  },
  6: {
    root: 'Chương 6: Kiểm định giả thuyết thống kê',
    branches: [
      { title:'📌 Cặp giả thuyết H₀ và H₁', bg:'#D9C9FF', items:['Giả thuyết không $H_0: \\mu = \\mu_0$', 'Đối thuyết 2 phía $H_1: \\mu \\ne \\mu_0$', 'Đối thuyết 1 phía: $\\mu > \\mu_0$ hoặc $\\mu < \\mu_0$'] },
      { title:'📋 Thống kê Kiểm định Trung bình', bg:'#BFF1DC', items:['Biết $\\sigma$ (hoặc $n\\ge 30$): $Z = \\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}$', 'Chưa biết $\\sigma, n<30$: $T = \\frac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}$'] },
      { title:'🧮 Thống kê Kiểm định Tỷ lệ', bg:'#FFD2D0', items:['Giả thuyết $H_0: p = p_0$', 'Thống kê: $Z = \\frac{f - p_0}{\\sqrt{p_0(1-p_0)/n}}$'] },
      { title:'⚠️ Quy tắc Bác bỏ H₀', bg:'#FFF1B8', items:['Kiểm định 2 phía: Bác bỏ $H_0$ nếu $|Z| > z_{\\alpha/2}$', 'Kiểm định bên phải: Bác bỏ nếu $Z > z_\\alpha$', 'Bẫy: Dùng $f(1-f)$ thay vì $p_0(1-p_0)$ dưới mẫu số'] }
    ]
  },
  7: {
    root: 'Chương 7: So sánh 2 tham số của hai tổng thể',
    branches: [
      { title:'📌 So sánh 2 Trung bình (Biết σ₁, σ₂)', bg:'#D9C9FF', items:['Giả thuyết $H_0: \\mu_1 = \\mu_2$', 'Sai số chuẩn $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1}+\\frac{\\sigma_2^2}{n_2}}$', 'Thống kê $Z = \\frac{\\bar{x}_1 - \\bar{x}_2}{SE}$'] },
      { title:'📋 So sánh 2 Trung bình (Mẫu lớn n₁, n₂ ≥ 30)', bg:'#BFF1DC', items:['Thay $\\sigma_1, \\sigma_2$ bằng $s_1, s_2$', '$Z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$'] },
      { title:'🧮 So sánh 2 Tỷ lệ p₁ và p₂', bg:'#FFD2D0', items:['Tỷ lệ gộp chung: $\\bar{p}=\\frac{k_1+k_2}{n_1+n_2}$', '$Z = \\frac{f_1 - f_2}{\\sqrt{\\bar{p}(1-\\bar{p})(1/n_1 + 1/n_2)}}$'] },
      { title:'⚠️ Ứng dụng Thực tế (A/B Testing)', bg:'#FFF1B8', items:['So sánh hiệu quả 2 phác đồ điều trị y tế', 'So sánh doanh thu 2 chiến dịch Marketing A và B', 'Bẫy: Trừ hai phương sai thay vì cộng dưới dấu căn'] }
    ]
  }
};

window.rMindmap = function(a){
  var curMap = ST.customMindmap || CHAPTER_MINDMAPS[ST.mmCh] || CHAPTER_MINDMAPS[1];
  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#E9DDFF]">Chức năng độc lập (e)</span>' +
        '<h2 class="text-2xl font-black mt-1">🧠🌳 Bản Đồ Tư Duy Xác Suất Thống Kê (AI Mindmap Studio)</h2>' +
        '<p class="text-sm font-bold text-gray-600">Hệ thống hóa toàn bộ khái niệm, công thức cốt lõi và dấu hiệu nhận biết dạng toán phục vụ ôn tập nhanh.</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
    '</div>' +

    '<div class="pc p-4 bg-white">' +
      '<div class="flex flex-wrap gap-2">' +
        CH.map(function(c, i){
          return '<button class="bt text-xs '+(ST.mmCh===i+1 && !ST.customMindmap ? 'on' : '')+'" onclick="ST.mmCh='+(i+1)+';ST.customMindmap=null;render()">Chương '+(i+1)+'</button>';
        }).join('') +
      '</div>' +
      '<div class="flex flex-wrap gap-2 mt-3">' +
        '<input id="mmTopicInput" class="flex-1 min-w-[220px] text-sm" placeholder="Hoặc nhập chủ đề / định lý / bài toán bất kỳ để AI vẽ Bản đồ tư duy riêng..." value="'+attr(ST.mmTopic)+'" oninput="ST.mmTopic=this.value">' +
        '<button id="btnGenMM" class="bt bg-[#BFF1DC] text-sm" onclick="genCustomMindmap()">✨ AI Vẽ Bản Đồ Tư Duy Theo Chủ Đề</button>' +
      '</div>' +
    '</div>' +

    /* Khu vực hiển thị Sơ đồ tư duy nhánh cây */
    '<div class="pc p-6 mt-4 bg-white mm">' +
      '<div class="text-center">' +
        '<div class="root text-lg md:text-xl px-6 py-2">🧠 '+esc(curMap.root)+'</div>' +
      '</div>' +
      '<div class="grid md:grid-cols-2 gap-4 mt-5">' +
        curMap.branches.map(function(b){
          return '<div class="br p-4" style="background:'+b.bg+'">' +
            '<h3 class="font-black text-base mb-2">'+b.title+'</h3>' +
            '<ul class="space-y-1.5 text-sm font-bold">' +
              b.items.map(function(it){ return '<li>'+it+'</li>'; }).join('') +
            '</ul>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  tx();
};

async function genCustomMindmap(){
  var topic = (ST.mmTopic || '').trim();
  if(!topic) return toast('Bạn hãy nhập tên chủ đề hoặc bài toán cần vẽ Bản đồ tư duy nhé! 🧠');
  if(!KEY) return toast('Hãy nhập Gemini API Key trên Header để AI vẽ Bản đồ tư duy cho chủ đề riêng nhé! 🦉');
  var b = $('#btnGenMM'); if(b){ b.disabled = true; b.textContent = '🦉 AI đang vẽ sơ đồ tư duy...'; }
  try{
    var raw = await ai('Hãy tạo Bản đồ tư duy Xác suất thống kê cho chủ đề: "'+topic+'". Trả về DUY NHẤT một chuỗi theo định dạng 4 nhóm cách nhau bởi dấu |: Khái niệm & Bản chất|Công thức Toán học cốt lõi|Các bước áp dụng giải toán|Ví dụ thực tế & Bẫy hay sai. Các ý nhỏ trong mỗi nhóm cách nhau bởi dấu ;. Công thức dùng LaTeX $...$.');
    var parts = raw.replace(/\n/g,' ').split('|');
    var colors = ['#D9C9FF','#BFF1DC','#FFD2D0','#FFF1B8'];
    var titles = ['📌 Khái niệm & Bản chất','🧮 Công thức cốt lõi','🪜 Các bước giải toán','⚠️ Ví dụ & Bẫy hay sai'];
    ST.customMindmap = {
      root: 'Bản đồ tư duy: ' + topic,
      branches: [0,1,2,3].map(function(i){
        var seg = parts[i] || titles[i];
        return { title:titles[i], bg:colors[i], items:seg.split(';').map(function(s){ return s.trim(); }).filter(Boolean) };
      })
    };
    toast('🎉 Đã vẽ xong Bản đồ tư duy!');
  }catch(e){ toast('Lỗi: ' + e.message); }
  if(b){ b.disabled = false; b.textContent = '✨ AI Vẽ Bản Đồ Tư Duy Theo Chủ Đề'; }
  render();
}

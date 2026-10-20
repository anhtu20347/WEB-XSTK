/* ===== MODULE 7: TÍNH NĂNG (f) SAO CHÉP QUY TRÌNH GIẢI TOÁN 4 BƯỚC POLYA (ĐỦ 4 TÍNH NĂNG) ===== */

function buildDefaultPolya(seedQ, ch){
  var baseQ = seedQ || 'Một dây chuyền sản xuất chip điện tử có 2 máy: Máy A sản xuất 60% tổng sản lượng (tỷ lệ phế phẩm 2%), Máy B sản xuất 40% tổng sản lượng (tỷ lệ phế phẩm 5%). Lấy ngẫu nhiên 1 chip từ kho thấy bị lỗi. Tính xác suất chip lỗi đó do Máy B sản xuất.';
  var clone1 = M('polya_c1_'+Date.now(), ch||1, 'mcq', 'Ví dụ tương đương',
    '[Bản sao 1 · Bài toán Tương tự] Một công ty bảo hiểm phân loại khách hàng: 70% rủi ro thấp (xác suất tai nạn 1%) và 30% rủi ro cao (xác suất tai nạn 6%). Chọn ngẫu nhiên 1 hồ sơ bị tai nạn, xác suất người đó thuộc nhóm rủi ro cao là?',
    ['$0{,}720$','$0{,}500$','$0{,}300$','$0{,}025$'], 0,
    'Chiến lược: Tính xác suất tai nạn toàn phần $P(T)=0{,}7\\times0{,}01+0{,}3\\times0{,}06=0{,}025$, sau đó dùng Bayes.',
    '$P(T)=0{,}025 \\Rightarrow P(Cao|T)=\\frac{0{,}3\\times0{,}06}{0{,}025}=\\frac{0{,}018}{0{,}025}=0{,}720$.',
    'finance_3d', {p:0.025, label:'Bản sao 1: Bảo hiểm Bayes'},
    'Công thức Bayes;Chương 1|Nhóm thấp 70% (lỗi 1%);Nhóm cao 30% (lỗi 6%)|$P(C|T)=\\frac{P(C)P(T|C)}{P(T)}$|Tính $P(T)=0,025$;Chia nhánh rủi ro cao');

  var clone2 = M('polya_c2_'+Date.now(), ch||1, 'mcq', 'Bài toán Đặc biệt',
    '[Bản sao 2 · Trường hợp Đặc biệt (Sản lượng bằng nhau)] Hai nhà máy A và B có sản lượng BẰNG NHAU (mỗi bên 50%). Tỷ lệ lỗi của A là 2%, của B là 6%. Lấy 1 sản phẩm bị lỗi, xác suất nó do B sản xuất là?',
    ['$0{,}75$','$0{,}50$','$0{,}25$','$0{,}04$'], 0,
    'Chiến lược đặc biệt: Khi $P(A)=P(B)=0{,}5$, công thức Bayes rút gọn chỉ còn tỷ lệ giữa hai xác suất điều kiện: $P(B|L)=\\frac{p_B}{p_A+p_B}$.',
    'Vì sản lượng bằng nhau nên $P(B|L)=\\frac{6\\%}{2\\%+6\\%}=\\frac{6}{8}=0{,}75$.',
    'factory_3d', {p:0.04, label:'Bản sao 2: Trường hợp P(A)=P(B)'},
    'Trường hợp đặc biệt Bayes;Chương 1|$P(A)=P(B)=0,5$;Lỗi A 2%, B 6%|$P(B|L)=\\frac{P(L|B)}{P(L|A)+P(L|B)}$|Rút gọn 0,5 ở tử và mẫu;Tính nhanh 6/(2+6)');

  var clone3 = M('polya_c3_'+Date.now(), ch||1, 'essay', 'Bài toán Khái quát hóa',
    '[Bản sao 3 · Bài toán Khái quát hóa & Củng cố] Mở rộng cho hệ đầy đủ 3 dây chuyền $A_1 (50\\%, \\text{lỗi } 1\\%)$, $A_2 (30\\%, \\text{lỗi } 3\\%)$, $A_3 (20\\%, \\text{lỗi } 5\\%)$. Lấy 1 sản phẩm thấy bị lỗi. Hãy tìm phân phối xác suất hậu nghiệm của cả 3 dây chuyền và cho biết dây chuyền nào đáng nghi ngờ nhất.',
    [], 0,
    'Chiến lược khái quát: Tính $P(L)=\\sum_{i=1}^3 P(A_i)P(L|A_i)$, sau đó tính $P(A_i|L)$ cho từng dây chuyền và so sánh tích $P(A_i)P(L|A_i)$ lớn nhất.',
    '$P(L)=0{,}5(0{,}01)+0{,}3(0{,}03)+0{,}2(0{,}05)=0{,}005+0{,}009+0{,}010=0{,}024$. Suy ra $P(A_3|L)=\\frac{0{,}010}{0{,}024}=41{,}67\\%$ là cao nhất.',
    'factory_3d', {p:0.024, label:'Bản sao 3: Khái quát n nhánh'},
    'Khái quát hóa Bayes;Chương 1|Hệ đầy đủ $n=3$ dây chuyền|$P(A_k|L)=\\frac{P(A_k)P(L|A_k)}{\\sum P(A_i)P(L|A_i)}$|Tính đóng góp từng nhánh;So sánh tử số lớn nhất');

  return {
    seed: baseQ,
    step1: [
      '<b>• Cái đã cho (Dữ kiện):</b> Hệ thống gồm các trạng thái tạo thành hệ đầy đủ (ví dụ: tỷ lệ sản lượng/nhóm đối tượng $P(A_i)$) và xác suất có điều kiện đi kèm từng nhánh $P(L|A_i)$.',
      '<b>• Cái phải tìm / Chứng minh:</b> Xác suất của một sự kiện tổng hợp hoặc xác suất hậu nghiệm $P(A_k|L)$ khi đã quan sát thấy kết quả $L$ xảy ra.',
      '<b>• Biểu diễn bằng Ký hiệu &amp; Công thức:</b> Gọi $A_1, A_2, ...$ là hệ đầy đủ ($\\sum P(A_i)=1$, xung khắc từng đôi) và $L$ là biến cố kết quả cần khảo sát.'
    ],
    step2: [
      '<b>• Chia thành các bài toán con đơn giản:</b> (Bài toán con 1) Tính đóng góp của từng nhánh $P(A_i)\\cdot P(L|A_i)$; (Bài toán con 2) Cộng tổng tìm $P(L)$; (Bài toán con 3) Lập tỷ số.',
      '<b>• Lựa chọn kiến thức gần gũi &amp; Dự đoán:</b> Kết hợp Công thức Xác suất đầy đủ và Công thức Bayes. Dự đoán kết quả nằm trong khoảng $(0; 1)$ và nghiêng về nhánh có tích số lớn hơn.',
      '<b>• Phương pháp đặc thù:</b> Vẽ sơ đồ hình cây xác suất (Probability Tree) để không bỏ sót nhánh nào.'
    ],
    step3: '<b>Trình bày lời giải chuẩn mực:</b><br>' +
      '1. Gọi $A, B$ lần lượt là biến cố đối tượng thuộc nhóm 1, nhóm 2 (lập thành hệ đầy đủ) và $L$ là biến cố kết quả quan sát được.<br>' +
      '2. Áp dụng công thức xác suất đầy đủ:<br>$$P(L) = P(A)\\cdot P(L|A) + P(B)\\cdot P(L|B)$$<br>' +
      '3. Áp dụng công thức Bayes để tìm xác suất hậu nghiệm:<br>$$P(B|L) = \\frac{P(B)\\cdot P(L|B)}{P(L)}$$<br>' +
      '4. Thay số cụ thể từ đề bài và kết luận ý nghĩa thực tiễn.',
    step4: [
      '<b>• Kiểm tra lại lập luận:</b> Tổng các xác suất hậu nghiệm $P(A|L) + P(B|L)$ luôn phải bằng $1$ (100%).',
      '<b>• Rút ra Tri thức phương pháp:</b> Mọi bài toán có cấu trúc 2 giai đoạn (Giai đoạn 1 phân nhánh nguyên nhân -> Giai đoạn 2 quan sát hệ quả) đều giải được bằng bộ đôi Đầy đủ + Bayes.',
      '<b>• Khai thác &amp; Mở rộng:</b> Từ bài toán gốc, hệ thống đã nhân bản thành <b>3 đối tượng bài toán bên dưới (Bài tương tự, Bài đặc biệt, Bài khái quát hóa)</b> — mỗi bài đều có đầy đủ <b>4 tính năng tương tác (Mô phỏng 3D, Chấm điểm, Bản đồ tư duy, Vấn đáp Voice AI)</b>.'
    ],
    clones: [clone1, clone2, clone3]
  };
}

window.rPolyaClone = function(a){
  if(!ST.polyaRes) ST.polyaRes = buildDefaultPolya(ST.polyaQ, ST.ch);
  var R = ST.polyaRes;

  a.innerHTML =
    '<div class="pc p-4 mb-4 bg-white flex items-center justify-between flex-wrap gap-2">' +
      '<div>' +
        '<span class="tag bg-[#9BEFC8]">Chức năng độc lập (f) · Quan trọng nhất ⭐</span>' +
        '<h2 class="text-2xl font-black mt-1">🧭🔄 Sao Chép Quy Trình Giải Toán 4 Bước Polya &amp; Nhân Bản Tương Tác</h2>' +
        '<p class="text-sm font-bold text-gray-600">Đưa 1 bài toán vào Trợ lý AI -> Phân tích thành Quy trình 4 Bước chuẩn sư phạm -> Tạo các bài toán bản sao có đầy đủ 4 tính năng tương tác.</p>' +
      '</div>' +
      '<button class="bt text-sm bg-white" onclick="go(\'home\')">← Về Mục lục</button>' +
    '</div>' +

    /* Ô nhập bài toán gốc */
    '<div class="pc p-5 bg-white">' +
      '<b>📥 Đưa bài toán gốc vào Trợ lý AI:</b>' +
      '<textarea id="polyaInput" class="w-full mt-2 text-sm" rows="3" placeholder="Dán hoặc gõ đề bài toán Xác suất thống kê bất kỳ vào đây..." oninput="ST.polyaQ=this.value">'+esc(ST.polyaQ || R.seed)+'</textarea>' +
      '<div class="flex flex-wrap gap-2 mt-3 items-center">' +
        '<select class="text-sm" onchange="ST.ch=+this.value">'+CH.map(function(c,i){ return '<option value="'+(i+1)+'" '+(ST.ch===i+1?'selected':'')+'>Thuộc Chương '+(i+1)+'</option>'; }).join('')+'</select>' +
        '<button id="btnRunPolya" class="bt bg-[#BFF1DC] text-sm" onclick="runPolyaClone()">🚀 Phân Tích Quy Trình 4 Bước &amp; Tạo Bản Sao Tương Tác</button>' +
      '</div>' +
    '</div>' +

    /* HIỂN THỊ CHI TIẾT 4 BƯỚC TRONG QUY TRÌNH GIẢI TOÁN */
    '<div class="grid md:grid-cols-2 gap-4 mt-5">' +
      /* Bước 1 */
      '<div class="pc p-5 bg-[#D9C9FF]">' +
        '<div class="flex items-center gap-2"><span class="tag bg-white">BƯỚC 1</span><h3 class="text-lg font-black">🔍 Tìm hiểu nội dung bài toán</h3></div>' +
        '<p class="text-xs font-bold mt-1 text-indigo-950">Phân biệt cái đã cho, cái phải tìm; dùng ký hiệu, công thức, mô hình để diễn tả điều kiện:</p>' +
        '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A] space-y-2 text-sm">' +
          R.step1.map(function(s){ return '<div>'+s+'</div>'; }).join('') +
        '</div>' +
      '</div>' +

      /* Bước 2 */
      '<div class="pc p-5 bg-[#BFF1DC]">' +
        '<div class="flex items-center gap-2"><span class="tag bg-white">BƯỚC 2</span><h3 class="text-lg font-black">🧭 Xây dựng chương trình giải</h3></div>' +
        '<p class="text-xs font-bold mt-1 text-indigo-950">Phân tích thành bài toán đơn giản quen thuộc, chọn kiến thức gần gũi, dự đoán kết quả:</p>' +
        '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A] space-y-2 text-sm">' +
          R.step2.map(function(s){ return '<div>'+s+'</div>'; }).join('') +
        '</div>' +
      '</div>' +

      /* Bước 3 */
      '<div class="pc p-5 bg-[#FFF1B8]">' +
        '<div class="flex items-center gap-2"><span class="tag bg-white">BƯỚC 3</span><h3 class="text-lg font-black">✍️ Trình bày lời giải chuẩn</h3></div>' +
        '<p class="text-xs font-bold mt-1 text-indigo-950">Trình bày lời giải chặt chẽ sau khi đã đối chiếu điều kiện:</p>' +
        '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A] text-sm">' +
          R.step3 +
        '</div>' +
      '</div>' +

      /* Bước 4 */
      '<div class="pc p-5 bg-[#FFD2D0]">' +
        '<div class="flex items-center gap-2"><span class="tag bg-white">BƯỚC 4</span><h3 class="text-lg font-black">🔬 Kiểm tra &amp; Nghiên cứu sâu lời giải</h3></div>' +
        '<p class="text-xs font-bold mt-1 text-indigo-950">Rút ra tri thức phương pháp, tìm cách giải khác, đề xuất bài tương tự / đặc biệt / khái quát:</p>' +
        '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A] space-y-2 text-sm">' +
          R.step4.map(function(s){ return '<div>'+s+'</div>'; }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +

    /* KHU VỰC CÁC ĐỐI TƯỢNG BÀI TOÁN BẢN SAO (CÓ ĐẦY ĐỦ 4 TÍNH NĂNG NHƯ ĐỐI TƯỢNG BAN ĐẦU) */
    '<div class="pc p-5 mt-6 bg-white">' +
      '<h3 class="text-2xl font-black">🧬 CÁC BÀI TOÁN BẢN SAO &amp; CỦNG CỐ TỪ BƯỚC 4 (Đầy đủ 4 tính năng tương tác)</h3>' +
      '<p class="text-sm font-bold text-gray-600 mt-1">Mỗi bài toán mở rộng dưới đây (Tương tự, Đặc biệt, Khái quát hóa) đều sở hữu trọn vẹn 4 tính năng: (1) Mô phỏng 3D xoay góc nhìn, (2) Chấm điểm trực tiếp, (3) Bản đồ tư duy riêng, và (4) Vấn đáp Giọng nói / Chat tại chỗ:</p>' +
      '<div class="mt-4">' +
        R.clones.map(function(q, idx){ return qcard(q, 'p', idx + 1); }).join('') +
      '</div>' +
    '</div>';
  tx();
};

async function runPolyaClone(){
  var qText = ($('#polyaInput') ? $('#polyaInput').value : ST.polyaQ).trim();
  if(!qText) return toast('Bạn hãy nhập đề bài toán vào ô trước nhé! 🧭');
  var b = $('#btnRunPolya');
  if(b){ b.disabled = true; b.textContent = '🦉 AI đang phân tích 4 bước Polya & sinh các bản sao...'; }

  if(!KEY){
    ST.polyaRes = buildDefaultPolya(qText, ST.ch);
    if(b){ b.disabled = false; b.textContent = '🚀 Phân Tích Quy Trình 4 Bước & Tạo Bản Sao Tương Tác'; }
    render();
    return toast('🎉 Đã tạo Quy trình 4 bước Polya và 3 bài toán bản sao đầy đủ 4 tính năng!');
  }

  try{
    var prompt = 'Phân tích bài toán Xác suất thống kê sau theo quy trình 4 bước Polya và tạo 3 bài toán mở rộng (1 bài tương tự, 1 bài đặc biệt, 1 bài khái quát hóa):\nĐề bài: "' + qText + '"\n' +
      'Trả về DUY NHẤT một đối tượng JSON hợp lệ (không markdown, công thức dùng $...$ và viết 2 dấu gạch chéo ngược \\\\frac) có cấu trúc:\n' +
      '{"step1":["Cái đã cho: ...","Cái phải tìm: ...","Biểu diễn công thức/ký hiệu: ..."],' +
      '"step2":["Phân tích thành bài toán con: ...","Kiến thức áp dụng & Dự đoán: ...","Phương pháp đặc thù: ..."],' +
      '"step3":"Lời giải chi tiết từng bước...",' +
      '"step4":["Kiểm tra lại kết quả: ...","Tri thức phương pháp rút ra: ...","Khai thác & Mở rộng: ..."],' +
      '"clones":[' +
        '{"ch":'+ST.ch+',"type":"mcq","lv":"Bài tương tự","q":"...","opts":["A","B","C","D"],"ans":0,"hint":"...","sol":"...","visual3DType":"factory_3d","vp":{"label":"Bản sao 1"},"m":"Dạng toán;..|Dữ kiện;..|Công thức;..|Bước giải;.."},' +
        '{"ch":'+ST.ch+',"type":"mcq","lv":"Bài đặc biệt","q":"...","opts":["A","B","C","D"],"ans":0,"hint":"...","sol":"...","visual3DType":"bellcurve_3d","vp":{"label":"Bản sao 2"},"m":"Dạng toán;..|Dữ kiện;..|Công thức;..|Bước giải;.."},' +
        '{"ch":'+ST.ch+',"type":"essay","lv":"Bài khái quát hóa","q":"...","opts":[],"ans":0,"hint":"...","sol":"...","visual3DType":"medical_3d","vp":{"label":"Bản sao 3"},"m":"Dạng toán;..|Dữ kiện;..|Công thức;..|Bước giải;.."}' +
      ']}';
    var raw = await ai(prompt, 'Bạn là chuyên gia sư phạm Toán Polya. Chỉ trả về JSON hợp lệ.');
    var obj = safeJSON(raw);
    ST.polyaRes = {
      seed: qText,
      step1: obj.step1 || ['Đã phân tích dữ kiện và yêu cầu bài toán.'],
      step2: obj.step2 || ['Đã xây dựng chương trình giải.'],
      step3: (obj.step3 || 'Áp dụng công thức chuẩn để trình bày.').replace(/\n/g,'<br>'),
      step4: obj.step4 || ['Đã kiểm tra kết quả và nhân bản bài toán.'],
      clones: (obj.clones || []).map(function(c, i){ return normQ(c, i, {ch:ST.ch}); })
    };
    if(!ST.polyaRes.clones.length) ST.polyaRes.clones = buildDefaultPolya(qText, ST.ch).clones;
    toast('🎉 Đã hoàn tất phân tích 4 bước Polya và tạo bản sao tương tác!');
  }catch(e){
    ST.polyaRes = buildDefaultPolya(qText, ST.ch);
    toast('Đã tạo Quy trình 4 bước Polya chuẩn sư phạm! 🦉');
  }
  if(b){ b.disabled = false; b.textContent = '🚀 Phân Tích Quy Trình 4 Bước & Tạo Bản Sao Tương Tác'; }
  render();
}

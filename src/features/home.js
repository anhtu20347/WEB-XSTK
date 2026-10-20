/* ===== MODULE 3: TRANG CHỦ & MỤC LỤC CÁC CHỨC NĂNG ĐỘC LẬP (a, b, c, d, e, f) ===== */
window.rHome = function(a){
  var tocItems = [
    { id:'voice_ipad', code:'Mục a', icon:'🎙️✍️', bg:'#BFF1DC', title:'Tương tác Giọng nói & Bảng viết iPad', desc:'Hỏi đáp Xác suất thống kê bằng giọng nói 2 chiều kết hợp trình bày lời giải toán học trên bảng iPad & chấm điểm theo Barem.' },
    { id:'essay_sim',  code:'Mục b', icon:'📝🧭', bg:'#D9C9FF', title:'Tạo Bài tập Tương tự Tự luận (5 bài + Chiến lược)', desc:'AI tự động nảy sinh 5 bài toán tự luận tương tự để học sinh tự luyện, chỉ cung cấp Chiến lược giải (hướng tư duy & công thức).' },
    { id:'mcq_sim',    code:'Mục c', icon:'☑️⚡', bg:'#FFF1B8', title:'Tạo Bài tập Tương tự Trắc nghiệm (Chấm tức thì & Tại sao?)', desc:'Làm bài trắc nghiệm có mô phỏng 3D, chấm điểm ngay tức thì và truy vấn AI giải thích tại sao đáp án đó đúng/sai.' },
    { id:'stats',      code:'Mục d', icon:'📊🩺', bg:'#FFD2D0', title:'Thống kê Câu hỏi & Nội dung Sai (Vấn đáp, Trắc nghiệm, Tự luận)', desc:'Thống kê lỗi sai từ cả 3 nguồn (Vấn đáp, Trắc nghiệm, Tự luận), đưa ra nhận định chung và lộ trình khắc phục.' },
    { id:'mindmap',    code:'Mục e', icon:'🧠🌳', bg:'#E9DDFF', title:'Bản đồ Tư duy Xác suất Thống kê (7 Chương)', desc:'Hệ thống hóa kiến thức, công thức cốt lõi, dấu hiệu nhận biết và các bẫy hay sai qua sơ đồ tư duy trực quan.' },
    { id:'polya_clone',code:'Mục f ⭐', icon:'🔄🏆', bg:'#9BEFC8', title:'Sao chép Quy trình Giải toán 4 Bước Polya (Quan trọng nhất)', desc:'Đưa 1 bài toán vào AI -> Tạo quy trình 4 bước chuẩn sư phạm -> Nhân bản các bài toán tương tự/khái quát hóa có đủ 4 tính năng.' }
  ];

  a.innerHTML =
    /* Hero Banner */
    '<section class="pc p-5 flex flex-wrap items-center gap-4 bg-white">' +
      '<div class="float">'+owl(135)+'</div>' +
      '<div class="flex-1 min-w-[240px]">' +
        '<div class="inline-block pc px-3 py-1 text-xs font-extrabold mb-2 bg-[#FFF1B8]">👋 Chào '+esc(myName())+'! Hệ thống Học tập Tự chủ AI Tutor</div>' +
        '<h1 class="text-2xl md:text-4xl font-black">Cú Đêm · Hệ Sinh Thái AI Học Xác Suất &amp; Thống Kê 🦉</h1>' +
        '<p class="mt-1 font-bold text-sm md:text-base">Thiết kế theo kiến trúc Modular chia tách thư mục: Tích hợp Quy trình 4 bước Polya, Voice AI + Bảng iPad, Mô phỏng 3D và Cộng đồng người thật.</p>' +
        '<div class="flex gap-2 mt-3 flex-wrap">' +
          '<span class="tag bg-[#BFF1DC] py-1 text-sm">🏆 '+prog.done.length+' bài đã hoàn thành</span>' +
          '<span class="tag bg-[#FFD2D0] py-1 text-sm">🔥 '+prog.streak+' ngày học liên tiếp</span>' +
          '<span class="tag bg-[#D9C9FF] py-1 text-sm">⚠️ '+miss.length+' lỗi đã ghi nhận</span>' +
        '</div>' +
      '</div>' +
    '</section>' +

    /* BẢNG MỤC LỤC CÁC CHỨC NĂNG ĐỘC LẬP (TABLE OF CONTENTS) */
    '<section class="pc p-5 mt-6 bg-white">' +
      '<div class="flex items-center justify-between flex-wrap gap-2 border-b-4 border-[#2D2A4A] pb-3">' +
        '<div>' +
          '<h2 class="text-2xl font-black">📑 MỤC LỤC CÁC CHỨC NĂNG ĐỘC LẬP (A → F)</h2>' +
          '<p class="text-sm font-bold text-gray-600">Bấm chọn trực tiếp một chức năng trong mục lục dưới đây để bắt đầu học tập chủ động:</p>' +
        '</div>' +
        '<span class="tag bg-[#FFF1B8] text-sm py-1">7 Chương Xác suất &amp; Thống kê</span>' +
      '</div>' +

      '<div class="grid md:grid-cols-2 gap-4 mt-4">' +
        tocItems.map(function(item){
          return '<div onclick="go(\''+item.id+'\')" class="pc p-4 cursor-pointer transition-all hover:-translate-y-1" style="background:'+item.bg+'">' +
            '<div class="flex items-center gap-2">' +
              '<span class="tag bg-white text-xs font-black">'+item.code+'</span>' +
              '<span class="text-2xl">'+item.icon+'</span>' +
              '<h3 class="font-black text-lg leading-snug flex-1">'+item.title+'</h3>' +
            '</div>' +
            '<p class="text-sm font-bold mt-2">'+item.desc+'</p>' +
            '<div class="mt-3 text-right"><span class="bt text-xs bg-white inline-block">Mở chức năng này →</span></div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>' +

    /* 2 TÍNH NĂNG MỞ RỘNG: THI THỬ BẤM GIỜ & DIỄN ĐÀN NGƯỜI THẬT */
    '<div class="grid md:grid-cols-2 gap-6 mt-6">' +
      '<button onclick="go(\'exam\')" class="pc p-5 text-left bt" style="background:linear-gradient(135deg,#FFD2D0,#FFF1B8)">' +
        '<div class="text-3xl">⏰📝</div>' +
        '<h3 class="text-xl font-black mt-1">Đấu Trường Thi Thử Bấm Giờ</h3>' +
        '<p class="text-sm font-bold mt-1">Thi thử có đồng hồ đếm ngược, chấm điểm tự động và chữa chi tiết từng câu sau khi nộp bài.</p>' +
      '</button>' +
      '<button onclick="go(\'forum\')" class="pc p-5 text-left bt" style="background:linear-gradient(135deg,#BFF1DC,#D9C9FF)">' +
        '<div class="text-3xl">🌐🤝</div>' +
        '<h3 class="text-xl font-black mt-1">Diễn Đàn Cộng Đồng (100% Người Thật)</h3>' +
        '<p class="text-sm font-bold mt-1">Đăng ký tài khoản, gửi lời mời kết bạn, đồng ý kết bạn và nhắn tin riêng tư 1-1 thời gian thực.</p>' +
      '</button>' +
    '</div>';
};

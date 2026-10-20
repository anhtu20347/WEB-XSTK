/* ===== MODULE 3: TRANG CHỦ DẠNG LƯỚI BÌNH THƯỜNG & MENU MỤC LỤC 3 GẠCH NGANG (☰) ===== */

/* Tự động gắn nút 3 gạch ngang (☰) vào góc trái trên cùng và tạo Menu trượt bên trái */
(function setupSidebarDrawer(){
  document.addEventListener('DOMContentLoaded', initDrawer);
  setTimeout(initDrawer, 100);

  function initDrawer(){
    var header = document.querySelector('header');
    if(header && !document.getElementById('menuToggleBtn')){
      var btn = document.createElement('button');
      btn.id = 'menuToggleBtn';
      btn.className = 'bt text-lg px-3 py-1 bg-white mr-1';
      btn.innerHTML = '☰';
      btn.title = 'Mở Mục lục chức năng';
      btn.onclick = toggleSidebar;
      header.insertBefore(btn, header.firstChild);
    }

    if(!document.getElementById('sidebarDrawer')){
      var drawerHTML =
        '<div id="sidebarOverlay" class="fixed inset-0 bg-black/40 z-40 hidden transition-opacity" onclick="toggleSidebar()"></div>' +
        '<aside id="sidebarDrawer" class="fixed top-0 left-0 h-full w-72 bg-white border-r-4 border-[#2D2A4A] z-50 transform -translate-x-full transition-transform duration-200 flex flex-col">' +
          '<div class="p-4 border-b-4 border-[#2D2A4A] flex items-center justify-between bg-[#FFF1B8]">' +
            '<div class="flex items-center gap-2"><b>📑 Mục Lục Chức Năng</b></div>' +
            '<button class="bt text-xs bg-white px-2.5 py-1" onclick="toggleSidebar()">✕</button>' +
          '</div>' +
          '<div id="drawerLinks" class="p-3 space-y-2 overflow-y-auto flex-1"></div>' +
        '</aside>';
      document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }
    renderDrawerLinks();
  }
})();

window.toggleSidebar = function(){
  var dr = document.getElementById('sidebarDrawer');
  var ov = document.getElementById('sidebarOverlay');
  if(!dr || !ov) return;
  var isOpen = !dr.classList.contains('-translate-x-full');
  if(isOpen){
    dr.classList.add('-translate-x-full');
    ov.classList.add('hidden');
  } else {
    renderDrawerLinks();
    dr.classList.remove('-translate-x-full');
    ov.classList.remove('hidden');
  }
};

window.renderDrawerLinks = function(){
  var box = document.getElementById('drawerLinks');
  if(!box || typeof NAV === 'undefined') return;
  box.innerHTML = NAV.map(function(item){
    var cleanLabel = item[1].replace(/\([a-f]\)\s*/gi, '');
    var active = (ST.view === item[0]);
    return '<button class="w-full text-left bt flex items-center gap-2 text-sm py-2.5 '+(active ? 'on' : 'bg-white')+'" onclick="go(\''+item[0]+'\');toggleSidebar()">' +
      '<span>'+cleanLabel+'</span>' +
    '</button>';
  }).join('');
};

/* Giao diện Trang chủ: Dãy thẻ chức năng bình thường, không còn chữ Mục a, b, c... */
window.rHome = function(a){
  var cards = [
    { id:'voice_ipad',  icon:'🎙️✍️', bg:'linear-gradient(135deg,#BFF1DC,#EFFFF8)', title:'Tương tác Giọng nói & Bảng viết iPad', desc:'Hỏi đáp Xác suất thống kê bằng giọng nói 2 chiều kết hợp trình bày lời giải toán học trên bảng iPad và chấm điểm theo Barem.' },
    { id:'essay_sim',   icon:'📝🧭', bg:'linear-gradient(135deg,#D9C9FF,#F3EEFF)', title:'Bài tập Tương tự Tự luận', desc:'AI tự động sinh 5 bài toán tự luận tương tự để tự luyện tập và cung cấp chiến lược giải định hướng tư duy.' },
    { id:'mcq_sim',     icon:'☑️⚡', bg:'linear-gradient(135deg,#FFF1B8,#FFFBEB)', title:'Bài tập Tương tự Trắc nghiệm', desc:'Làm bài trắc nghiệm có mô phỏng 3D, chấm điểm ngay tức thì và truy vấn AI giải thích tại sao đáp án đó đúng/sai.' },
    { id:'polya_clone', icon:'🔄🏆', bg:'linear-gradient(135deg,#9BEFC8,#BFF1DC)', title:'Quy trình Giải toán 4 Bước Polya', desc:'Đưa một bài toán vào AI để tạo quy trình giải 4 bước chuẩn sư phạm kèm các bài toán tương tự, đặc biệt và khái quát hóa.' },
    { id:'mindmap',     icon:'🧠🌳', bg:'linear-gradient(135deg,#E9DDFF,#D9C9FF)', title:'Bản đồ Tư duy Xác suất Thống kê', desc:'Hệ thống hóa kiến thức 7 chương, công thức cốt lõi, dấu hiệu nhận biết và các bẫy hay sai qua sơ đồ tư duy.' },
    { id:'stats',       icon:'📊🩺', bg:'linear-gradient(135deg,#FFD2D0,#FFF1B8)', title:'Thống kê Lỗi sai & Hồ sơ Học tập', desc:'Thống kê các câu trả lời sai về vấn đáp, trắc nghiệm, tự luận; đưa ra nhận định chung và đề xuất bài tập khắc phục.' },
    { id:'exam',        icon:'⏰📝', bg:'linear-gradient(135deg,#FFD2D0,#FFE4E6)', title:'Đấu Trường Thi Thử Bấm Giờ', desc:'Thi thử có đồng hồ đếm ngược, chấm điểm tự động và mở Bản đồ tư duy + Vấn đáp giải đáp thắc mắc ngay sau khi nộp bài.' },
    { id:'forum',       icon:'🌐🤝', bg:'linear-gradient(135deg,#BFF1DC,#D9C9FF)', title:'Diễn Đàn Học Tập & Nhắn Tin Bạn Bè', desc:'Kết nối cộng đồng người học thật: Đăng bài thảo luận, gửi lời mời kết bạn và trò chuyện riêng tư 1-1.' }
  ];

  a.innerHTML =
    /* Hero Banner */
    '<section class="pc p-5 flex flex-wrap items-center gap-4 bg-white">' +
      '<div class="float">'+owl(135)+'</div>' +
      '<div class="flex-1 min-w-[240px]">' +
        '<div class="inline-block pc px-3 py-1 text-xs font-extrabold mb-2 bg-[#FFF1B8]">👋 Chào '+esc(myName())+'! Hôm nay mình cùng cứu nét kiến thức nhé!</div>' +
        '<h1 class="text-2xl md:text-4xl font-black">Xác suất &amp; Thống kê không đáng sợ, có Cú Đêm lo! 🦉</h1>' +
        '<p class="mt-1 font-bold text-sm md:text-base">Bấm nút <b>☰</b> ở góc trên bên trái để mở nhanh Mục lục, hoặc chọn trực tiếp các tính năng bên dưới:</p>' +
        '<div class="flex gap-2 mt-3 flex-wrap">' +
          '<span class="tag bg-[#BFF1DC] py-1 text-sm">🏆 '+prog.done.length+' bài đã chinh phục</span>' +
          '<span class="tag bg-[#FFD2D0] py-1 text-sm">🔥 '+prog.streak+' ngày chăm học</span>' +
        '</div>' +
      '</div>' +
    '</section>' +

    /* Dãy các thẻ chức năng bình thường */
    '<div class="grid md:grid-cols-2 gap-6 mt-6">' +
      cards.map(function(c){
        return '<button onclick="go(\''+c.id+'\')" class="pc p-5 text-left bt" style="background:'+c.bg+';border-radius:1.5rem;box-shadow:0 8px 0 #2D2A4A">' +
          '<div class="text-4xl">'+c.icon+'</div>' +
          '<h2 class="text-2xl font-black mt-2">'+c.title+'</h2>' +
          '<p class="font-bold text-sm mt-1">'+c.desc+'</p>' +
        '</button>';
      }).join('') +
    '</div>';
};

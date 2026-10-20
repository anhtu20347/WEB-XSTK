/* ===== MODULE 2: NGÂN HÀNG 7 CHƯƠNG, MÔ PHỎNG 3D & THẺ BÀI TẬP TƯƠNG TÁC ===== */
var VIZ_LIST = ['factory_3d','dice_3d','bellcurve_3d','medical_3d','finance_3d','queue_3d','sampling_3d','abtest_3d','dice_cards_3d'];
function normQ(o, i, def){
  var ch = Number(o.ch) || Number(def.ch) || 1;
  var viz = o.visual3DType || o.viz || VIZ_LIST[(ch + i) % VIZ_LIST.length];
  return {
    id: 'g' + Date.now() + '_' + i,
    ch: ch,
    type: o.type === 'essay' ? 'essay' : 'mcq',
    lv: o.lv || def.lv || 'Vận dụng',
    q: o.q || 'Bài toán xác suất thống kê',
    opts: (o.opts && o.opts.length >= 4) ? o.opts : ['0,15','0,25','0,50','0,75'],
    ans: Number(o.ans) || 0,
    hint: o.hint || 'Xác định công thức trọng tâm của chương và phân tích dữ kiện.',
    sol: o.sol || 'Áp dụng công thức chuẩn của chương để tính toán.',
    viz: viz,
    vp: o.vp || {label: 'Mô phỏng Chương ' + ch},
    m: o.m || ('Dạng toán;Chương ' + ch + '|Dữ kiện;Theo đề bài|Công thức;Áp dụng công thức chương ' + ch + '|Bước giải;Thay số và kiểm tra điều kiện')
  };
}

async function genAI(def, n){
  var prompt = 'Tạo ' + n + ' bài toán Xác suất & Thống kê thực tế bằng tiếng Việt cho Chương ' + (def.ch || '1-7') +
    ', hình thức ' + (def.type === 'essay' ? 'tự luận' : 'trắc nghiệm 4 đáp án') +
    ', độ khó ' + (def.lv || 'Vận dụng') + '.' + (def.note ? ' Yêu cầu đặc biệt: ' + def.note + '.' : '') +
    ' Trả về DUY NHẤT mảng JSON hợp lệ, không markdown. Công thức dùng $...$ và viết 2 dấu gạch chéo ngược (\\\\frac). ' +
    'Mỗi phần tử có dạng: {"ch":'+(def.ch||1)+',"type":"'+(def.type==='essay'?'essay':'mcq')+'","lv":"'+(def.lv||'Vận dụng')+'","q":"đề bài thực tế","opts":["A","B","C","D"],"ans":0,"hint":"chiến lược giải / gợi ý phương pháp (không lộ đáp số)","sol":"lời giải chi tiết","visual3DType":"factory_3d|dice_3d|bellcurve_3d|medical_3d|finance_3d|queue_3d|sampling_3d|abtest_3d|dice_cards_3d","vp":{"label":"tên mô hình"},"m":"Dạng toán;..|Dữ kiện;..|Công thức;..|Bước giải;.."}';
  var raw = await ai(prompt, 'Bạn là Cú Đêm, chuyên gia ra đề Xác suất Thống kê. Luôn trả về JSON mảng hợp lệ.');
  var arr = safeJSON(raw);
  return arr.map(function(o, i){ return normQ(o, i, def); });
}

function M(id,ch,type,lv,q,opts,ans,hint,sol,viz,vp,m){ return {id:id,ch:ch,type:type,lv:lv,q:q,opts:opts,ans:ans,hint:hint,sol:sol,viz:viz,vp:vp,m:m}; }
var BANK = [
  M('s1',1,'mcq','Cơ bản','Gieo một con xúc xắc cân đối đồng chất. Xác suất xuất hiện mặt có số chấm chẵn là?',['$1/6$','$1/3$','$1/2$','$2/3$'],2,'Chiến lược: Xác định số phần tử không gian mẫu $|\\Omega|=6$ và đếm các mặt chẵn.', 'Có 3 mặt chẵn (2, 4, 6) trên 6 mặt nên $P=\\frac{3}{6}=\\frac{1}{2}$.','dice_3d',{label:'Xúc xắc 6 mặt cân đối'},'Xác suất cổ điển;Chương 1|Không gian mẫu 6 mặt;Mặt chẵn 2,4,6|$P(A)=\\frac{|A|}{|\\Omega|}$|Đếm 3 mặt;Chia 6;Bẫy: nhầm số nguyên tố'),
  M('s2',1,'mcq','Vận dụng cao','Nhà máy sản xuất chip: Máy A làm 60% sản lượng (tỷ lệ lỗi 2%), Máy B làm 40% sản lượng (tỷ lệ lỗi 5%). Lấy ngẫu nhiên 1 chip thấy bị lỗi. Xác suất chip đó do Máy B sản xuất là?',['$0{,}250$','$0{,}500$','$0{,}625$','$0{,}750$'],2,'Chiến lược: Bước 1 dùng công thức xác suất đầy đủ tính $P(L)$; Bước 2 dùng công thức Bayes tính $P(B|L)$.','$P(L)=0{,}6\\times0{,}02+0{,}4\\times0{,}05=0{,}032$. Theo Bayes: $P(B|L)=\\frac{0{,}4\\times0{,}05}{0{,}032}=0{,}625$.','factory_3d',{p:0.032,label:'Dây chuyền Chip · Lỗi 3,2%'},'Công thức Bayes;Chương 1|$P(A)=0,6; P(B)=0,4$;Lỗi A 2%, B 5%|$P(B|L)=\\frac{P(B)P(L|B)}{P(L)}$|Tính xác suất đầy đủ $P(L)$;Chia tỷ lệ nhánh B'),
  M('s3',1,'essay','Vận dụng cao','Một xét nghiệm y tế tìm virus có độ nhạy 98% (dương tính khi có bệnh) và tỷ lệ dương tính giả là 3% (dương tính khi không bệnh). Biết tỷ lệ mắc bệnh trong cộng đồng là 1%. Nếu một người xét nghiệm dương tính, hãy tính xác suất người đó thực sự mắc bệnh.',[],0,'Chiến lược giải: (1) Gọi $B$ là biến cố mắc bệnh ($P(B)=0,01$), $\\bar{B}$ là không bệnh ($0,99$); (2) Tính xác suất dương tính toàn phần $P(+)$ bằng công thức đầy đủ; (3) Áp dụng Bayes $P(B|+)=\\frac{P(B)P(+|B)}{P(+)}$.','$P(+)=0{,}01\\times0{,}98+0{,}99\\times0{,}03=0{,}0395$. Suy ra $P(B|+)=\\frac{0{,}0098}{0{,}0395}\\approx 24{,}81\\%$.','medical_3d',{p:0.25,label:'Xét nghiệm Y sinh Bayes'},'Bayes trong Y học;Chương 1|$P(B)=0,01; P(+|B)=0,98$;$P(+|\\bar{B})=0,03$|$P(B|+)=\\frac{P(B)P(+|B)}{P(+)}$|Tính $P(+)=0,0395$;Chia lấy thương'),
  M('s4',2,'mcq','Cơ bản','Biến ngẫu nhiên rời rạc $X$ có bảng phân phối: $P(X=0)=0{,}3$; $P(X=1)=0{,}5$; $P(X=2)=0{,}2$. Kỳ vọng $E(X)$ bằng?',['$0{,}7$','$0{,}9$','$1{,}0$','$1{,}2$'],1,'Chiến lược: Áp dụng công thức kỳ vọng rời rạc $E(X)=\\sum x_i p_i$.','$E(X)=0\\times0{,}3+1\\times0{,}5+2\\times0{,}2=0{,}9$.','dice_3d',{label:'Biến ngẫu nhiên X (0, 1, 2)'},'Kỳ vọng toán;Chương 2|3 giá trị $x_i: 0, 1, 2$;Xác suất $0,3; 0,5; 0,2$|$E(X)=\\sum x_i p_i$|Nhân từng cặp $x_i p_i$;Cộng tổng lại'),
  M('s5',2,'essay','Vận dụng cao','Lợi nhuận $X$ (triệu đồng) của một danh mục đầu tư có phân phối: $P(X=-10)=0{,}2$; $P(X=15)=0{,}5$; $P(X=30)=0{,}3$. Hãy tìm kỳ vọng lợi nhuận $E(X)$ và phương sai rủi ro $Var(X)$.',[],0,'Chiến lược giải: (1) Tính $E(X)=\\sum x_i p_i$; (2) Tính $E(X^2)=\\sum x_i^2 p_i$; (3) Tính phương sai $Var(X)=E(X^2)-[E(X)]^2$.','$E(X)=14{,}5$. $E(X^2)=402{,}5$. $Var(X)=402{,}5-14{,}5^2=192{,}25$.','finance_3d',{mu:1.4,label:'Đầu tư Cổ phiếu · Rủi ro σ²'},'Phương sai & Rủi ro;Chương 2|Lợi nhuận -10, 15, 30;Xác suất 0,2; 0,5; 0,3|$Var(X)=E(X^2)-[E(X)]^2$|Tính kỳ vọng $E(X)$;Tính $E(X^2)$ rồi trừ bình phương'),
  M('s6',3,'mcq','Vận dụng','Điểm IQ $X\\sim N(100; 15^2)$. Xác suất chọn ngẫu nhiên một người có IQ lớn hơn 115 là?',['$0{,}0228$','$0{,}1587$','$0{,}3413$','$0{,}8413$'],1,'Chiến lược: Đổi sang biến chuẩn tắc $Z=\\frac{X-\\mu}{\\sigma}$ và lấy $1-\\Phi(z)$.','$Z=\\frac{115-100}{15}=1 \\Rightarrow P(X>115)=1-\\Phi(1)\\approx 1-0{,}8413=0{,}1587$.','bellcurve_3d',{mu:100,sigma:15,label:'Phân phối Chuẩn N(100, 15²)'},'Phân phối Chuẩn;Chương 3|$\\mu=100; \\sigma=15$;Cần tính $P(X>115)$|$Z=\\frac{X-\\mu}{\\sigma}$|Đổi sang $Z=1$;Lấy $1-\\Phi(1)$'),
  M('s7',3,'mcq','Vận dụng cao','Tại một trạm thu phí cao tốc, trung bình mỗi phút có $\\lambda=3$ xe ô tô đi qua theo phân phối Poisson. Xác suất trong 1 phút có đúng 2 xe đi qua là?',['$0{,}1494$','$0{,}2240$','$0{,}3333$','$0{,}4232$'],1,'Chiến lược: Dùng công thức Poisson $P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}$ với $\\lambda=3, k=2$.','$P(X=2)=\\frac{e^{-3}\\cdot 3^2}{2!}=4{,}5\\cdot e^{-3}\\approx 0{,}2240$.','queue_3d',{label:'Trạm thu phí Poisson (λ=3)'},'Phân phối Poisson;Chương 3|Cường độ dòng $\\lambda=3$;Số sự kiện $k=2$|$P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}$|Thay $\\lambda=3, k=2$;Tính $4,5\\times e^{-3}$'),
  M('s8',4,'mcq','Vận dụng','Khảo sát mẫu 5 sản phẩm có trọng lượng (gam): 4, 6, 8, 10, 12. Phương sai mẫu hiệu chỉnh $s^2$ bằng?',['$8$','$10$','$12{,}5$','$40$'],1,'Chiến lược: Tính $\\bar{x}$, sau đó chia tổng bình phương độ lệch cho $n-1$.','Trung bình mẫu $\\bar{x}=8$. $\\sum(x_i-\\bar{x})^2=40 \\Rightarrow s^2=\\frac{40}{5-1}=10$.','sampling_3d',{label:'Lồng cầu lấy mẫu n=5, x̄=8'},'Đặc trưng mẫu;Chương 4|Mẫu $n=5$: 4, 6, 8, 10, 12|$s^2=\\frac{\\sum(x_i-\\bar{x})^2}{n-1}$|Tính $\\bar{x}=8$;Chia cho $n-1=4$'),
  M('s9',5,'mcq','Vận dụng cao','Đo thân nhiệt 100 bệnh nhân thu được $\\bar{x}=36{,}8^\\circ\\text{C}$, độ lệch chuẩn $\\sigma=0{,}5^\\circ\\text{C}$. Khoảng tin cậy 95% ($z_{0,025}=1{,}96$) cho thân nhiệt trung bình là?',['$(36{,}702;\\,36{,}898)$','$(36{,}500;\\,37{,}100)$','$(36{,}790;\\,36{,}810)$','$(36{,}600;\\,37{,}000)$'],0,'Chiến lược: Tính ngưỡng sai số $\\varepsilon = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$ rồi lấy $\\bar{x}\\pm \\varepsilon$.','$\\varepsilon = 1{,}96\\times\\frac{0{,}5}{10}=0{,}098 \\Rightarrow (36{,}702;\\,36{,}898)$.','medical_3d',{p:0.15,label:'Ước lượng Y tế n=100'},'Khoảng ước lượng;Chương 5|$n=100; \\bar{x}=36,8; \\sigma=0,5$;Độ tin cậy 95%|$\\bar{x}\\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$|Tính $\\varepsilon=0,098$;Cộng trừ vào $\\bar{x}$'),
  M('s10',6,'mcq','Vận dụng cao','Dây chuyền đóng gói cà phê định mức $\\mu_0=500\\text{g}$ ($\\sigma=12\\text{g}$). Kiểm tra mẫu $n=36$ gói thấy $\\bar{x}=495\\text{g}$. Giá trị thống kê kiểm định $Z$ là?',['$-2{,}5$','$-1{,}5$','$2{,}0$','$2{,}5$'],0,'Chiến lược: Áp dụng thống kê $Z=\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}$.','$Z=\\frac{495-500}{12/\\sqrt{36}}=\\frac{-5}{2}=-2{,}5$.','factory_3d',{p:0.08,label:'Kiểm định Dây chuyền μ0=500g'},'Kiểm định giả thuyết;Chương 6|$\\mu_0=500; n=36; \\bar{x}=495; \\sigma=12$|$Z=\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}$|Tính sai số chuẩn $12/6=2$;Lấy $-5/2=-2,5$'),
  M('s11',7,'mcq','Vận dụng cao','Thử nghiệm A/B Testing 2 giao diện web bán hàng: Giao diện A và B cùng khảo sát $n_1=n_2=50$ ngày, $\\sigma_1=\\sigma_2=10$ đơn, trung bình $\\bar{x}_A=105$ và $\\bar{x}_B=100$. Giá trị thống kê $Z$ so sánh 2 trung bình là?',['$1{,}25$','$2{,}50$','$3{,}50$','$5{,}00$'],1,'Chiến lược: Tính sai số chuẩn tổng hợp $SE=\\sqrt{\\frac{\\sigma_1^2}{n_1}+\\frac{\\sigma_2^2}{n_2}}$, sau đó lấy hiệu hai trung bình chia $SE$.','$SE=\\sqrt{2+2}=2 \\Rightarrow Z=\\frac{105-100}{2}=2{,}50$.','abtest_3d',{label:'A/B Testing: Giao diện A vs B'},'So sánh 2 trung bình;Chương 7|$n_1=n_2=50; \\sigma_1=\\sigma_2=10$;$\\bar{x}_A=105, \\bar{x}_B=100$|$Z=\\frac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1+\\sigma_2^2/n_2}}$|Tính $SE=2$;Lấy hiệu chia SE')
];

/* Bộ sinh nhanh bài toán tương tự (hỗ trợ cả Tự luận & Trắc nghiệm) */
function buildPracticePack(ch, count, forceType){
  var results = [];
  var mode = forceType || 'mcq';
  for(var i = 0; i < count; i++){
    var id = 'sim_' + mode + '_' + ch + '_' + Date.now() + '_' + i;
    if(ch === 1){
      var rateA = 50 + (i % 4) * 10, rateB = 100 - rateA;
      var errA = 1 + (i % 3), errB = 2 + (i % 4);
      var pL = (rateA * errA + rateB * errB) / 10000;
      var pBL = ((rateB * errB / 10000) / pL).toFixed(3);
      results.push(M(id,1,mode,'Vận dụng cao','[Bài tương tự #'+(i+1)+'] Nhà máy có 2 dây chuyền: Dây chuyền A sản xuất '+rateA+'% linh kiện (tỷ lệ lỗi '+errA+'%), Dây chuyền B sản xuất '+rateB+'% (tỷ lệ lỗi '+errB+'%). Chọn ngẫu nhiên 1 linh kiện thấy bị lỗi, tính xác suất nó thuộc dây chuyền B.',[pBL, (pBL*0.8).toFixed(3), (pBL*0.6).toFixed(3), '0.500'],0,'Chiến lược giải: Bước 1: Gọi $A, B$ là biến cố linh kiện do máy A, B sản xuất và $L$ là biến cố linh kiện lỗi. Bước 2: Dùng công thức xác suất đầy đủ $P(L)=P(A)P(L|A)+P(B)P(L|B)$. Bước 3: Dùng công thức Bayes $P(B|L)=\\frac{P(B)P(L|B)}{P(L)}$.','Tính $P(L)='+pL.toFixed(4)+'$, từ đó $P(B|L)='+pBL+'$.','factory_3d',{p:pL,label:'Nhà máy #'+(i+1)+' · Lỗi '+(pL*100).toFixed(1)+'%'},'Công thức Bayes;Chương 1|Tỷ lệ máy A: '+rateA+'%, B: '+rateB+'%|$P(B|L)=\\frac{P(B)P(L|B)}{P(L)}$|Tính xác suất lỗi tổng;Chia nhánh B'));
    } else if(ch === 2){
      var v1 = 10 + i*2, v2 = 20 + i*2, ex = (v1*0.4 + v2*0.6).toFixed(1);
      results.push(M(id,2,mode,'Vận dụng','[Bài tương tự #'+(i+1)+'] Doanh thu ngày $X$ (triệu đồng) của cửa hàng có phân phối: $P(X='+v1+')=0{,}4$ và $P(X='+v2+')=0{,}6$. Tìm kỳ vọng doanh thu $E(X)$.',[ex+' triệu',(ex-2).toFixed(1)+' triệu',(Number(ex)+2).toFixed(1)+' triệu',v2+' triệu'],0,'Chiến lược giải: Nhân từng giá trị của biến ngẫu nhiên $x_i$ với xác suất tương ứng $p_i$, sau đó cộng tổng theo công thức $E(X)=\\sum x_i p_i$.','$E(X)='+v1+'\\times0{,}4 + '+v2+'\\times0{,}6 = '+ex+'$ triệu đồng.','finance_3d',{mu:1.2,label:'Doanh thu kỳ vọng: '+ex+'tr'},'Biến ngẫu nhiên;Chương 2|Hai mức doanh thu '+v1+' và '+v2+'|$E(X)=\\sum x_i p_i$|Nhân giá trị với xác suất;Cộng tổng'));
    } else if(ch === 3){
      var lam = 2 + (i % 5);
      var p2 = (Math.exp(-lam)*Math.pow(lam,2)/2).toFixed(4);
      results.push(M(id,3,mode,'Vận dụng cao','[Bài tương tự #'+(i+1)+'] Tổng đài CSKH nhận trung bình $\\lambda='+lam+'$ cuộc gọi mỗi phút theo phân phối Poisson. Tính xác suất trong 1 phút nhận đúng 2 cuộc gọi.',[p2,'0.1250','0.3500','0.5000'],0,'Chiến lược giải: Nhận diện quy luật Poisson với tham số cường độ $\\lambda='+lam+'$ và số sự kiện cần tính $k=2$. Thay vào công thức $P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}$.','Thay $\\lambda='+lam+', k=2 \\Rightarrow P(X=2)='+p2+'$.','queue_3d',{label:'Tổng đài Poisson λ='+lam},'Phân phối Poisson;Chương 3|Trung bình $\\lambda='+lam+'$, cần $k=2$|$P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}$|Thay số vào công thức'));
    } else if(ch === 4){
      var base = 10 + i * 2;
      results.push(M(id,4,mode,'Vận dụng','[Bài tương tự #'+(i+1)+'] Khảo sát thời gian giao hàng (phút) của 5 đơn hàng: '+(base-4)+', '+(base-2)+', '+base+', '+(base+2)+', '+(base+4)+'. Tìm trung bình mẫu $\\bar{x}$ và phương sai mẫu hiệu chỉnh $s^2$.',['$\\bar{x}='+base+',\\, s^2=10$','$\\bar{x}='+base+',\\, s^2=8$','$\\bar{x}='+(base+2)+',\\, s^2=10$','$\\bar{x}='+base+',\\, s^2=40$'],0,'Chiến lược giải: Bước 1: Tính trung bình mẫu $\\bar{x}=\\frac{1}{n}\\sum x_i$. Bước 2: Tính tổng bình phương độ lệch $\\sum(x_i-\\bar{x})^2$. Bước 3: Chia cho $n-1$ để ra $s^2$.','Trung bình $\\bar{x}='+base+'$, tổng bình phương lệch là $40 \\Rightarrow s^2=40/4=10$.','sampling_3d',{label:'Mẫu n=5 · x̄='+base},'Đặc trưng mẫu;Chương 4|Mẫu 5 đơn hàng đối xứng quanh '+base+'|$s^2=\\frac{\\sum(x_i-\\bar{x})^2}{n-1}$|Tính $\\bar{x}='+base+'$;Chia cho $n-1=4$'));
    } else if(ch === 5){
      var xb = 150 + i * 2;
      results.push(M(id,5,mode,'Vận dụng cao','[Bài tương tự #'+(i+1)+'] Đo chiều cao mẫu $n=100$ cây giống thu được $\\bar{x}='+xb+'\\text{ cm}$, độ lệch chuẩn $\\sigma=10\\text{ cm}$. Tìm khoảng tin cậy 95% cho chiều cao trung bình.',['$('+(xb-1.96).toFixed(2)+';\\,'+(xb+1.96).toFixed(2)+')$','$('+(xb-1).toFixed(2)+';\\,'+(xb+1).toFixed(2)+')$','$('+(xb-3).toFixed(2)+';\\,'+(xb+3).toFixed(2)+')$','$('+(xb-0.5).toFixed(2)+';\\,'+(xb+0.5).toFixed(2)+')$'],0,'Chiến lược giải: Bước 1: Xác định phân vị chuẩn $z_{\\alpha/2}=1{,}96$ (ứng với 95%). Bước 2: Tính sai số $\\varepsilon = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$. Bước 3: Lập khoảng $(\\bar{x}-\\varepsilon;\\, \\bar{x}+\\varepsilon)$.','$\\varepsilon = 1{,}96\\times\\frac{10}{10}=1{,}96\\text{ cm}$.','medical_3d',{p:0.2,label:'Khoảng tin cậy 95% · x̄='+xb},'Khoảng ước lượng;Chương 5|$n=100, \\bar{x}='+xb+', \\sigma=10$|$\\bar{x}\\pm 1{,}96\\frac{\\sigma}{\\sqrt{n}}$|Tính sai số 1,96;Cộng trừ quanh $\\bar{x}$'));
    } else if(ch === 6){
      var mu0 = 200 + i*5, xb6 = mu0 + 4;
      results.push(M(id,6,mode,'Vận dụng cao','[Bài tương tự #'+(i+1)+'] Định mức dung lượng pin là $\\mu_0='+mu0+'\\text{ giờ}$ ($\\sigma=12\\text{ giờ}$). Thử nghiệm $n=36$ viên pin thấy $\\bar{x}='+xb6+'\\text{ giờ}$. Tính thống kê kiểm định $Z$.',['$2{,}0$','$1{,}5$','$3{,}0$','$-2{,}0$'],0,'Chiến lược giải: Đặt giả thuyết $H_0: \\mu='+mu0+'$. Tính sai số chuẩn $\\sigma/\\sqrt{n}$, sau đó tính $Z=\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}$.','$Z=\\frac{'+xb6+'-'+mu0+'}{12/6}=\\frac{4}{2}=2{,}0$.','bellcurve_3d',{mu:mu0,sigma:12,label:'Kiểm định Pin Z=2.0'},'Kiểm định giả thuyết;Chương 6|$\\mu_0='+mu0+', \\bar{x}='+xb6+', n=36, \\sigma=12$|$Z=\\frac{\\bar{x}-\\mu_0}{\\sigma/\\sqrt{n}}$|Sai số chuẩn bằng 2;Chia hiệu số cho 2'));
    } else {
      var diff = 4 + (i % 3) * 2, zval = (diff / 2).toFixed(1);
      results.push(M(id,7,mode,'Vận dụng cao','[Bài tương tự #'+(i+1)+'] So sánh doanh số 2 chiến dịch Marketing A và B trên $n_1=n_2=50$ cửa hàng ($\\sigma_1=\\sigma_2=10$). Biết $\\bar{x}_A - \\bar{x}_B = '+diff+'$. Tính thống kê $Z$.',[zval, (zval*0.5).toFixed(1), (zval*2).toFixed(1), '1.0'],0,'Chiến lược giải: Tính sai số chuẩn tổng hợp của 2 mẫu độc lập $SE=\\sqrt{\\frac{\\sigma_1^2}{n_1}+\\frac{\\sigma_2^2}{n_2}}$, rồi lấy hiệu $(\\bar{x}_A-\\bar{x}_B)$ chia cho $SE$.','$Z=\\frac{'+diff+'}{2}='+zval+'$.','abtest_3d',{label:'A/B Marketing · Chênh lệch '+diff},'So sánh 2 tham số;Chương 7|$n_1=n_2=50; \\sigma_1=\\sigma_2=10$|$Z=\\frac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1+\\sigma_2^2/n_2}}$|Tính $SE=2$;Chia chênh lệch cho 2'));
    }
  }
  return results;
}
var SAMPLE_EXAM = BANK.filter(function(q){ return q.type === 'mcq'; });
function allQ(){ return BANK.concat(ST.gen).concat(ST.simEssayList).concat(ST.simMcqList); }

/* Động cơ Mô phỏng 3D */
function rgb(c, k){ return 'rgb(' + c.map(function(v){ return Math.min(255, (v * k) | 0); }).join(',') + ')'; }
function box(x,y,z,w,h,d,c){
  var a=x-w/2, b=x+w/2, z0=z-d/2, z1=z+d/2, y1=y+h;
  var faces = [
    [[[a,y1,z0],[b,y1,z0],[b,y1,z1],[a,y1,z1]],c,1.12],
    [[[a,y,z0],[b,y,z0],[b,y1,z0],[a,y1,z0]],c,0.9],
    [[[a,y,z1],[b,y,z1],[b,y1,z1],[a,y1,z1]],c,0.7],
    [[[a,y,z0],[a,y,z1],[a,y1,z1],[a,y1,z0]],c,0.8],
    [[[b,y,z0],[b,y,z1],[b,y1,z1],[b,y1,z0]],c,0.6]
  ];
  return faces.map(function(f){ return {v:f[0], col:rgb(f[1],f[2])}; });
}
function scene(type, t, p){
  var o = {polys:[], dots:[], txt:[]};
  var hash = function(n){ return ((n * 9301 + 49297) % 233280) / 233280; };
  if(type === 'dice_3d'){
    var s = 60; o.polys = box(0,-s,0,2*s,2*s,2*s,[255,236,160]);
    [['1',[0,0,-s]],['6',[0,0,s]],['3',[-s,0,0]],['4',[s,0,0]],['2',[0,s,0]],['5',[0,-s,0]]].forEach(function(f){ o.txt.push({t:f[0],p:f[1]}); });
  } else if(type === 'factory_3d'){
    var pr = p.p || 0.1; o.polys = box(0,-16,0,460,16,80,[130,130,160]);
    for(var k=0;k<8;k++){
      var u = k*60 + t*50, id = k + 8*Math.floor(u/480), x = (u%480) - 240, bad = hash(id+1) < pr*2.2;
      o.polys.push.apply(o.polys, box(x,0,0,32,28,32, bad ? [255,120,130] : [120,225,175]));
    }
    o.polys.push.apply(o.polys, box(0,0,-44,6,70,6,[255,220,90]));
    o.polys.push.apply(o.polys, box(0,0,44,6,70,6,[255,220,90]));
    o.polys.push.apply(o.polys, box(0,64,0,6,6,94,[255,220,90]));
  } else if(type === 'bellcurve_3d'){
    var s2 = Math.max(0.3, (p.sigma || 15) / 15);
    for(var i=-6;i<=6;i++) for(var j=-3;j<=3;j++){
      var h = (150/Math.sqrt(s2))*Math.exp(-i*i/(8*s2*s2))*Math.exp(-j*j/6)*(1+0.08*Math.sin(t*3+i+j))+4;
      var k2 = Math.min(1, h/150);
      o.polys.push.apply(o.polys, box(i*26,0,j*26,22,h,22,[(180-70*k2)|0,(150+80*k2)|0,(255-60*k2)|0]));
    }
  } else if(type === 'medical_3d'){
    var pr2 = p.p || 0.2;
    for(var m=0;m<70;m++){
      var y = 1 - 2*m/69, r = Math.sqrt(Math.max(0, 1-y*y)), a = m*2.4 + t*0.5;
      o.dots.push({p:[95*r*Math.cos(a), 95*y, 95*r*Math.sin(a)], r:8, c: hash(m+3)<pr2 ? '#FF7A8A' : '#8FF0C8'});
    }
  } else if(type === 'queue_3d'){
    o.polys = box(0,-30,-70,120,60,60,[190,170,255]);
    for(var qk=0;qk<8;qk++){
      var qu = (qk*70 + t*60) % 560;
      o.polys.push.apply(o.polys, box(-280+qu,-10,40,26,26,26,[255,200,120]));
    }
  } else if(type === 'sampling_3d'){
    for(var sk=0;sk<60;sk++){
      var sy = 1 - 2*sk/59, sr = Math.sqrt(Math.max(0, 1-sy*sy)), sa = sk*2.4 + t*0.4, hi = hash(sk)<0.18;
      o.dots.push({p:[120*sr*Math.cos(sa), 120*sy, 120*sr*Math.sin(sa)], r: hi?11:6, c: hi?'#FFD166':'#B79CF5'});
    }
    o.txt.push({t:'x̄', p:[0,-140,0]});
  } else if(type === 'abtest_3d'){
    var hA = 90 + 30*Math.sin(t), hB = 115 + 30*Math.cos(t);
    o.polys.push.apply(o.polys, box(-90,0,0,90,hA,50,[120,225,175]));
    o.polys.push.apply(o.polys, box(90,0,0,90,hB,50,[255,150,160]));
    o.txt.push({t:'A',p:[-90,hA+20,0]},{t:'B',p:[90,hB+20,0]});
  } else if(type === 'dice_cards_3d'){
    for(var ci=0;ci<5;ci++){
      o.polys.push.apply(o.polys, box(ci*44-88, Math.sin(t*2+ci)*12, 0, 34, 52, 4, ci%2 ? [255,236,160] : [255,210,220]));
    }
  } else {
    for(var fi=0;fi<10;fi++){
      var fh = (40 + 85*Math.abs(Math.sin(fi*1.3+1)))*(1+0.12*Math.sin(t*2+fi));
      o.polys.push.apply(o.polys, box(fi*38-170,0,0,26,fh,40, fi%3!==0 ? [120,225,175] : [255,150,160]));
    }
  }
  return o;
}
function draw(c, dt){
  var g = c.getContext('2d'), q = QM[c.dataset.q]; if(!q) return;
  if(c.__run !== false) c.__t = (c.__t || 0) + dt;
  var t = c.__t || 0, W = c.width, H = c.height;
  var sc = scene(q.viz, t, q.vp || {});
  var ry = (c.__ry || 0) + (q.viz === 'dice_3d' ? t*0.8 : Math.sin(t*0.4)*0.5 + 0.4), rx = 0.5;
  var P = function(v){
    var x=v[0], y=v[1], z=v[2], co=Math.cos(ry), si=Math.sin(ry);
    var nx = x*co + z*si, nz = -x*si + z*co; x = nx; z = nz;
    co = Math.cos(rx); si = Math.sin(rx);
    var ny = y*co + z*si; nz = -y*si + z*co; y = ny; z = nz;
    var f = 420 / (420 + z);
    return [W/2 + x*f, H*0.62 - y*f, z, f];
  };
  var items = [];
  sc.polys.forEach(function(f){
    var pp = f.v.map(P);
    items.push({
      z: pp.reduce(function(s,a){ return s+a[2]; }, 0)/4,
      fn: function(){
        g.beginPath();
        pp.forEach(function(a,i){ if(i) g.lineTo(a[0],a[1]); else g.moveTo(a[0],a[1]); });
        g.closePath(); g.fillStyle = f.col; g.fill();
        g.strokeStyle = 'rgba(45,42,74,.6)'; g.stroke();
      }
    });
  });
  sc.dots.forEach(function(d){
    var a = P(d.p);
    items.push({ z:a[2], fn:function(){ g.beginPath(); g.arc(a[0],a[1],Math.max(2,d.r*a[3]),0,7); g.fillStyle=d.c; g.fill(); } });
  });
  sc.txt.forEach(function(d){
    var a = P(d.p);
    items.push({ z:a[2]-1, fn:function(){ g.fillStyle='#FFF1B8'; g.font='900 32px Nunito'; g.textAlign='center'; g.fillText(d.t,a[0],a[1]+10); } });
  });
  g.clearRect(0,0,W,H);
  items.sort(function(a,b){ return b.z - a.z; }).forEach(function(i){ i.fn(); });
  g.fillStyle = '#fff'; g.font = '800 13px Nunito'; g.textAlign = 'left';
  g.fillText('🎲 ' + ((q.vp && q.vp.label) || 'Mô phỏng 3D') + ' · Kéo chuột để xoay', 10, H - 10);
}
var lastT = performance.now();
function loop(n){
  var dt = Math.min(0.05, (n - lastT)/1000); lastT = n;
  document.querySelectorAll('canvas.sc').forEach(function(c){ try{ draw(c, dt); }catch(e){} });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
var drag = null;
document.addEventListener('pointerdown', function(e){ if(e.target.classList && e.target.classList.contains('sc')) drag = {c:e.target, x:e.clientX}; });
window.addEventListener('pointermove', function(e){ if(drag){ drag.c.__ry = (drag.c.__ry || 0) + (e.clientX - drag.x)*0.01; drag.x = e.clientX; } });
window.addEventListener('pointerup', function(){ drag = null; });
function runT(id){
  var c = document.querySelector('canvas[data-q="'+id+'"]'); if(!c) return;
  c.__run = (c.__run === false);
  var btn = document.getElementById('rb_'+id);
  if(btn) btn.textContent = c.__run ? '⏸ Dừng' : '▶ Chạy 3D';
}

/* Thẻ câu hỏi đa năng (Dùng cho Tự luận tương tự, Trắc nghiệm tương tự & Bản sao 4 bước Polya) */
var scoreOf = function(t){ var m = String(t).match(/(\d+(?:[.,]\d+)?)\s*\/\s*10/); return m ? parseFloat(m[1].replace(',','.')) : null; };
function recAtt(q, ok){
  var a = ATT[q.ch] || {n:0, ok:0}; a.n++; if(ok) a.ok++;
  ATT[q.ch] = a; ls.set('att', ATT);
}
function logMiss(q, mode){
  if(!q || !q.id) return;
  if(miss.some(function(m){ return m.id === q.id && m.mode === mode; })) return;
  miss.push({ id:q.id, ch:q.ch||1, mode:mode, q:q.q, ans: (q.type==='mcq' && q.opts && q.opts[q.ans]) ? q.opts[q.ans] : 'Xem chiến lược/lời giải', date:Date.now() });
  ls.set('miss', miss);
}
function clearMiss(){ miss = []; ls.set('miss', miss); render(); }

function qaHTML(q, mode){
  var u = U(q.id), rev = (mode === 'r'), strategyOnly = (mode === 'strategy');
  var pk = rev ? ST.ex.ans[q.id] : u.pick, shown = rev || (u.pick != null);
  var h = '<div class="font-bold text-lg my-2">' + q.q + '</div>';

  if(q.type === 'mcq'){
    q.opts.forEach(function(o, i){
      var c = 'opt';
      if(shown){ if(i === q.ans) c += ' ok'; else if(i === pk) c += ' bad'; }
      h += '<button class="'+c+'" '+(shown?'disabled':'')+' onclick="pick(\''+q.id+'\','+i+',\''+mode+'\')"><b>'+LB[i]+'.</b> '+o+'</button>';
    });
    if(shown){
      h += '<div class="font-black my-2">' + (pk === q.ans ? '🎉 Chính xác! (+1 câu đúng)' : (pk == null ? '⏰ Chưa chọn – Đáp án đúng là ' + LB[q.ans] : '💔 Sai rồi – Đáp án đúng là ' + LB[q.ans])) + '</div>';
      /* Nút Truy vấn "Tại sao?" đặc trưng của Tính năng (c) */
      h += '<div class="flex gap-2 flex-wrap my-2">' +
        '<button class="bt text-xs bg-[#D9C9FF]" onclick="askWhyMcq(\''+q.id+'\')">❓ Giải thích tại sao đáp án '+LB[q.ans]+' đúng &amp; các phương án khác sai?</button></div>' +
        (u.whyExp ? '<div class="p-3 rounded-2xl bg-[#EFFFF8] border-2 border-[#2D2A4A] text-sm my-2">'+u.whyExp+'</div>' : '');
    }
  } else {
    /* Chế độ Tự luận: Chỉ cung cấp Chiến lược giải trước để học sinh tự luyện */
    h += '<div class="p-3 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A] text-sm my-2"><b>🧭 Chiến lược giải (Gợi mở tư duy):</b><br>' + (q.hint || 'Xác định biến ngẫu nhiên, công thức trọng tâm và thay số.') + '</div>';
    h += '<textarea class="w-full text-sm mt-1" rows="3" placeholder="Trình bày lời giải của bạn dựa theo chiến lược trên..." oninput="U(\''+q.id+'\').essay=this.value">' + esc(u.essay || '') + '</textarea>' +
      '<div class="flex gap-2 flex-wrap mt-2"><button class="bt text-sm bg-[#BFF1DC]" onclick="grade(\''+q.id+'\',\''+mode+'\')">✍️ Nộp bài nhờ AI chấm &amp; Nhận xét</button></div>' +
      (u.grade ? '<div class="pc p-3 mt-3 bg-[#EFFFF8] text-sm">'+u.grade+'</div>' : '');
  }

  if(!rev && !strategyOnly){
    h += '<div class="flex gap-2 flex-wrap mt-2">' +
      '<button class="bt text-xs" onclick="U(\''+q.id+'\').hint=!U(\''+q.id+'\').hint;updQ(\''+q.id+'\',\''+mode+'\')">💡 Chiến lược / Gợi ý</button>' +
      '<button class="bt text-xs" onclick="U(\''+q.id+'\').sol=!U(\''+q.id+'\').sol;updQ(\''+q.id+'\',\''+mode+'\')">📖 Đáp án đối chiếu</button></div>';
  }
  if(u.hint && !rev && q.type === 'mcq') h += '<div class="mt-2 p-3 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A] text-sm">💡 ' + q.hint + '</div>';
  if((rev || u.sol) && !strategyOnly) h += '<div class="mt-2 p-3 rounded-2xl bg-[#E9DDFF] border-2 border-[#2D2A4A] text-sm"><b>📖 Lời giải:</b> ' + q.sol + '</div>';
  return h;
}

function qcard(q, mode, num){
  QM[q.id] = q; var id = q.id;
  return '<div class="pc p-4 my-4" id="c_'+id+'">' +
    '<div class="flex gap-2 flex-wrap items-center">' +
    '<span class="tag bg-[#D9C9FF]">'+(num ? 'Bài '+num+' · ' : '')+'Chương '+q.ch+'</span>' +
    '<span class="tag bg-[#FFD2D0]">'+esc(q.lv)+'</span>' +
    '<span class="tag bg-[#BFF1DC]">'+(q.type==='mcq'?'Trắc nghiệm chấm tức thì':'Tự luận chiến lược')+'</span></div>' +
    '<div class="grid md:grid-cols-5 gap-3 mt-2">' +
    '<div class="md:col-span-3"><div id="qa_'+id+'">'+qaHTML(q, mode)+'</div></div>' +
    '<div class="md:col-span-2"><div class="stage"><canvas class="sc" data-q="'+id+'" width="560" height="360"></canvas>' +
    '<button id="rb_'+id+'" class="bt" onclick="runT(\''+id+'\')">⏸ Dừng</button></div></div></div>' +
    '<div class="mt-3 p-3 rounded-2xl bg-[#F3EEFF] border-2 border-dashed border-[#2D2A4A]">' +
    '<b>🛟 Tương tác 4 tính năng ngay tại bài toán này:</b>' +
    '<div class="flex gap-2 flex-wrap mt-2">' +
    '<button class="bt text-xs" onclick="togMind(\''+id+'\')">🧠 Bản đồ tư duy bài này</button>' +
    '<button class="bt text-xs" onclick="togChat(\''+id+'\')">💬 Hỏi đáp Socratic tại sao?</button>' +
    '<button class="bt text-xs bg-[#FFF1B8]" onclick="openInPolya(\''+id+'\')">🧭 Đưa bài này vào Quy trình 4 bước Polya</button></div>' +
    '<div id="mm_'+id+'"></div><div id="ch_'+id+'"></div></div>' +
    vBlock('q'+id, id, false) + '</div>';
}

function updQ(id, mode){ var q = QM[id]; if($('#qa_'+id)){ $('#qa_'+id).innerHTML = qaHTML(q, mode); tx(); } }
function pick(id, i, mode){
  var q = QM[id], u = U(id);
  if(u.pick == null){
    ST.mcqScore.tot++;
    if(i === q.ans) ST.mcqScore.ok++;
  }
  u.pick = i;
  recAtt(q, i === q.ans);
  if(i === q.ans) markDone(id); else logMiss(q, 'mcq');
  updQ(id, mode || 'p');
  if($('#mcqScoreBar')) updateMcqScoreBar();
}
async function askWhyMcq(id){
  var q = QM[id], u = U(id);
  var pickedLetter = u.pick != null ? LB[u.pick] : 'chưa chọn';
  if(!KEY){
    u.whyExp = '<b>🦉 Giải thích bản chất:</b> Đáp án đúng là <b>'+LB[q.ans]+'</b> vì: '+q.sol+'<br><i>(Phương án bạn chọn là '+pickedLetter+'. Hãy chú ý điều kiện áp dụng công thức trong Chiến lược: '+q.hint+')</i>';
    return updQ(id, 'p');
  }
  u.whyExp = '🦉 Đang phân tích lý do đúng/sai...'; updQ(id, 'p');
  try{
    var res = await ai('Đề trắc nghiệm: '+q.q+'\nCác phương án: '+q.opts.map(function(o,idx){return LB[idx]+'. '+o;}).join(' | ')+'\nĐáp án đúng: '+LB[q.ans]+'\nHọc sinh đã chọn: '+pickedLetter+'\nHãy giải thích ngắn gọn: (1) Tại sao đáp án '+LB[q.ans]+' là đúng; (2) Tại sao phương án học sinh chọn (hoặc các phương án nhiễu khác) lại sai.', 'Bạn là Cú Đêm giải thích trắc nghiệm rõ ràng.');
    u.whyExp = res.replace(/\n/g,'<br>');
  }catch(e){ u.whyExp = 'Lỗi: ' + esc(e.message); }
  updQ(id, 'p');
}

async function grade(id, mode){
  var q = QM[id], u = U(id);
  if(!u.essay) return toast('Bạn hãy viết lời giải theo chiến lược trước nhé ✍️');
  if(!KEY){
    u.grade = '<b>🦉 Nhận xét theo Chiến lược:</b> Bạn đã thực hiện trình bày bài giải. Hãy đối chiếu từng bước với kết quả chuẩn sau:<br><b>Hướng giải chuẩn:</b> ' + q.sol;
    return updQ(id, mode || 'p');
  }
  u.grade = '🦉 Cú Đêm đang chấm bài của bạn...'; updQ(id, mode || 'p');
  try{
    u.grade = (await ai('Đề: '+q.q+'\nChiến lược: '+q.hint+'\nLời giải chuẩn: '+q.sol+'\nBài làm học sinh: '+u.essay+'\nHãy chấm thang 10 (ghi X/10), nhận xét học sinh đã làm đúng bước nào trong chiến lược và sửa lỗi sai nếu có. Dùng LaTeX $...$.')).replace(/\n/g,'<br>');
    markDone(id);
    var sc = scoreOf(u.grade);
    if(sc !== null){ recAtt(q, sc >= 5); if(sc < 5) logMiss(q, 'essay'); }
  }catch(e){ u.grade = 'Lỗi: ' + esc(e.message); }
  updQ(id, mode || 'p');
}

function mmHTML(q){
  var parts = (q.m || 'Dạng toán|Dữ kiện|Công thức|Bước giải').split('|');
  return '<div class="mm text-center mt-3"><div class="root">🧠 Chương '+q.ch+': '+CH[q.ch-1]+'</div>' +
    '<div class="grid md:grid-cols-4 gap-3 mt-3 text-left">' +
    LBL.map(function(lb, i){
      var p = parts[i] || lb[0];
      return '<div class="br" style="background:'+lb[1]+'"><b>'+lb[0]+'</b><ul>' +
        p.split(';').map(function(s){ return '<li>'+s.trim()+'</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div></div>';
}
async function togMind(id){
  var q = QM[id], u = U(id), el = $('#mm_'+id);
  if(u.mind){ u.mind = 0; el.innerHTML = ''; return; }
  if(!q.m && KEY){
    el.innerHTML = '<p class="mt-2 font-bold">🦉 Đang vẽ bản đồ tư duy...</p>';
    try{ q.m = (await ai('Đề: '+q.q+'\nLời giải: '+q.sol+'\nTrả về 4 nhánh cách nhau |: Dạng toán|Dữ kiện|Công thức|Các bước giải;Bẫy hay sai.')).replace(/\n/g,' ').trim(); }catch(e){}
  }
  u.mind = 1; el.innerHTML = mmHTML(q); tx();
}

function chatHTML(id){
  var u = U(id);
  return '<div class="mt-3 bg-white rounded-2xl border-2 border-[#2D2A4A] p-3">' +
    '<div class="max-h-72 overflow-y-auto" id="msgs_'+id+'">' +
    u.msgs.map(function(m){
      return '<div class="my-1 '+(m.r==='u'?'text-right':'')+'"><span class="inline-block px-3 py-1 rounded-2xl border-2 border-[#2D2A4A] '+(m.r==='u'?'bg-[#BFF1DC]':'bg-[#F3EEFF]')+'">'+(m.r==='u'?'':'🦉 ')+m.t+'</span></div>';
    }).join('') + '</div>' +
    '<div class="flex gap-2 mt-2"><input id="in_'+id+'" class="flex-1 text-sm" placeholder="Truy vấn AI: Tại sao dùng công thức này?..." onkeydown="if(event.key===\'Enter\')send(\''+id+'\')"><button class="bt text-sm" onclick="send(\''+id+'\')">Hỏi</button></div></div>';
}
function togChat(id){
  var u = U(id), el = $('#ch_'+id);
  if(u.chat){ u.chat = 0; el.innerHTML = ''; return; }
  u.chat = 1;
  if(!u.msgs.length) u.msgs.push({r:'m', t:'Chào bạn! Bạn muốn truy vấn tại sao chọn công thức đó hay cần gợi mở bước nào? 🦉'});
  el.innerHTML = chatHTML(id); tx();
}
async function send(id){
  var q = QM[id], u = U(id), inp = $('#in_'+id), v = inp.value.trim(); if(!v) return;
  u.msgs.push({r:'u', t:esc(v)}); u.msgs.push({r:'m', t:'🦉 Đang trả lời...'});
  $('#ch_'+id).innerHTML = chatHTML(id);
  var rep;
  try{
    var hist = u.msgs.slice(0,-1).map(function(m){ return {role: m.r==='u'?'user':'model', parts:[{text:m.t}]}; }).filter(function(m,i){ return !(i===0 && m.role==='model'); });
    rep = (await ai(hist, 'Bạn là Cú Đêm trợ giảng XSTK. Giải thích bản chất ngắn gọn, dễ hiểu. Đề: '+q.q+'\nChiến lược: '+q.hint+'\nLời giải: '+q.sol)).replace(/\n/g,'<br>');
  }catch(e){
    rep = (e.message === 'nokey') ? ('<b>Chiến lược của bài:</b> ' + q.hint + '<br><i>(Nhập API Key trên Header để hỏi đáp tự do nhé!)</i>') : ('Lỗi: ' + esc(e.message));
  }
  u.msgs[u.msgs.length-1] = {r:'m', t:rep};
  $('#ch_'+id).innerHTML = chatHTML(id);
  var boxEl = $('#msgs_'+id); if(boxEl) boxEl.scrollTop = boxEl.scrollHeight;
  tx();
}
function openInPolya(id){
  var q = QM[id]; if(!q) return;
  ST.polyaQ = q.q;
  ST.ch = q.ch;
  go('polya_clone');
}

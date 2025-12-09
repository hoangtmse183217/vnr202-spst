import { Question, MatchPack, HiddenKeywordData } from './types';

export const QUESTION_BANK: Question[] = [
  // ... (Keep existing Stage 1 questions - cutting for brevity, assume they are here)
  // CẤP ĐỘ 1: DỄ (4 câu)
  {
    id: 1,
    text: "Hội nghị Ban Chấp hành Trung ương tháng 7/1936 (mở đầu giai đoạn này) diễn ra tại địa điểm nào?",
    options: ["Ma Cao (Trung Quốc)", "Cửu Long (Hương Cảng)", "Thượng Hải (Trung Quốc)", "Quảng Châu (Trung Quốc)"],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: "Hội nghị diễn ra tại Thượng Hải (Trung Quốc)."
  },
  {
    id: 2,
    text: "Ai là người chủ trì Hội nghị Ban Chấp hành Trung ương tháng 7/1936?",
    options: ["Nguyễn Ái Quốc", "Lê Hồng Phong", "Hà Huy Tập", "Nguyễn Văn Cừ"],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "Lê Hồng Phong là người chủ trì hội nghị này."
  },
  {
    id: 3,
    text: "Thay vì khẩu hiệu 'Đánh đổ đế quốc', giai đoạn 1936-1939 Đảng đã nêu khẩu hiệu đấu tranh trực tiếp là gì?",
    options: ["Độc lập, Tự do, Hạnh phúc", "Tự do, dân chủ, cơm áo và hòa bình", "Người cày có ruộng, giảm tô giảm tức", "Đánh đuổi Nhật - Pháp, giành độc lập"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 4,
    text: "Kẻ thù nguy hiểm trước mắt của nhân dân Đông Dương được Đảng xác định trong giai đoạn này là ai?",
    options: ["Thực dân Pháp nói chung", "Địa chủ phong kiến và tư sản mại bản", "Bọn phản động thuộc địa và tay sai", "Phát xít Nhật và tay sai"],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 5,
    text: "Cuộc mít tinh công khai lớn nhất trong phong trào dân chủ diễn ra vào ngày 1/5/1938 tại đâu?",
    options: ["Quảng trường Ba Đình", "Nhà Đấu xảo Hà Nội", "Bến Nhà Rồng", "Chợ Bến Thành"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 6,
    text: "Tác phẩm 'Vấn đề dân cày' (1938) là sự kết hợp biên soạn của hai tác giả nào?",
    options: ["Trường Chinh và Phạm Văn Đồng", "Qua Ninh và Vân Đình", "Hải Triều và Hà Huy Tập", "Nguyễn Văn Cừ và Lê Duẩn"],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: "Qua Ninh (Trường Chinh) và Vân Đình (Võ Nguyên Giáp)."
  },
  {
    id: 7,
    text: "Tháng 3/1938, Hội nghị Trung ương Đảng đã quyết định đổi tên 'Mặt trận nhân dân phản đế Đông Dương' thành tên gì?",
    options: ["Mặt trận Việt Minh", "Mặt trận Liên Việt", "Mặt trận Dân chủ Đông Dương", "Mặt trận Thống nhất Dân tộc"],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 8,
    text: "Phong trào nào ra đời cuối năm 1937 nhằm mục đích chống nạn mù chữ và nâng cao dân trí?",
    options: ["Phong trào Bình dân học vụ", "Phong trào Đông du", "Phong trào Truyền bá Quốc ngữ", "Phong trào Duy tân"],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 9,
    text: "Tác giả của cuốn sách 'Chủ nghĩa mácxít phổ thông' được in và phát hành năm 1938 là ai?",
    options: ["Hải Triều", "Trần Huy Liệu", "Võ Nguyên Giáp", "Phan Đăng Lưu"],
    correctAnswer: 0,
    difficulty: 'easy'
  },
  {
    id: 10,
    text: "Vào tháng 3/1938, ai được bầu làm Tổng Bí thư của Đảng?",
    options: ["Hà Huy Tập", "Nguyễn Văn Cừ", "Trường Chinh", "Lê Hồng Phong"],
    correctAnswer: 1,
    difficulty: 'easy'
  },

  // CẤP ĐỘ 2: TRUNG BÌNH (3 câu)
  {
    id: 11,
    text: "Tại sao Đảng lại xác định kẻ thù là 'bọn phản động thuộc địa' chứ không phải 'toàn bộ thực dân Pháp'?",
    options: ["Vì thực dân Pháp đã trao trả độc lập cho ta.", "Để cô lập kẻ thù nguy hiểm nhất, tranh thủ Mặt trận Nhân dân Pháp.", "Vì thực dân Pháp lúc này đã quá suy yếu.", "Vì Đảng muốn thỏa hiệp lâu dài với Pháp."],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 12,
    text: "Hình thức tổ chức và đấu tranh trong giai đoạn 1936-1939 có điểm gì mới so với giai đoạn 1930-1931?",
    options: ["Chỉ đấu tranh vũ trang, bạo động.", "Hoạt động hoàn toàn bí mật, bất hợp pháp.", "Kết hợp công khai, hợp pháp với bí mật, bất hợp pháp.", "Chỉ đấu tranh nghị trường và báo chí."],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 13,
    text: "Mục đích chính của phong trào 'đón rước' phái viên Gôđa (Godart) và Toàn quyền Brêviê (Brévié) năm 1937 là gì?",
    options: ["Để biểu dương lực lượng và đưa yêu sách dân nguyện.", "Để ám sát các quan chức cấp cao của Pháp.", "Để thể hiện lòng hiếu khách của người dân thuộc địa.", "Để kêu gọi Pháp trao trả độc lập ngay lập tức."],
    correctAnswer: 0,
    difficulty: 'medium'
  },
  {
    id: 14,
    text: "Cuốn sách 'Tờrốtxky và phản cách mạng' (5/5/1937) do ai xuất bản nhằm phê phán các luận điệu 'tả' khuynh?",
    options: ["Nguyễn Văn Cừ", "Hà Huy Tập", "Lê Hồng Phong", "Nguyễn Ái Quốc"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 15,
    text: "Văn kiện nào của Đảng (tháng 10/1936) đã nêu quan điểm mới về mối quan hệ giữa 'dân tộc' và 'giai cấp'?",
    options: ["Luận cương chính trị", "Chung quanh vấn đề chiến sách mới", "Đường Kách mệnh", "Tự chỉ trích"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 16,
    text: "Theo chủ trương của Đảng giai đoạn này, nếu cuộc tranh đấu chia đất (điền địa) mà ngăn trở cuộc tranh đấu phản đế thì phải giải quyết thế nào?",
    options: ["Phải thực hiện chia đất bằng mọi giá.", "Phải lựa chọn vấn đề quan trọng hơn (phản đế) mà giải quyết trước.", "Thực hiện song song cả hai.", "Tạm dừng cả hai để chờ chỉ thị."],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 17,
    text: "Trong tác phẩm 'Tự chỉ trích', Tổng Bí thư Nguyễn Văn Cừ nhấn mạnh nguyên tắc nào khi Mặt trận Dân chủ gặp thất bại hoặc khó khăn?",
    options: ["Đổ lỗi cho khách quan.", "Công khai thừa nhận sai lầm để sửa chữa và rèn luyện.", "Giữ kín sai lầm.", "Đổ lỗi cho các đảng phái khác."],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 18,
    text: "Tờ báo nào dưới đây KHÔNG PHẢI là báo công khai của Đảng hoặc Mặt trận Dân chủ trong giai đoạn 1936-1939?",
    options: ["Báo Tiền phong", "Báo Dân chúng", "Báo Thanh Niên", "Báo Tin tức"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 19,
    text: "Sự kiện nào vào tháng 9/1939 đã chấm dứt phong trào dân chủ 1936-1939?",
    options: ["Nhật đảo chính Pháp.", "Chiến tranh thế giới thứ hai bùng nổ.", "Mặt trận Nhân dân Pháp lên nắm quyền.", "Nguyễn Ái Quốc về nước."],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 20,
    text: "Đâu là nhận định đúng nhất về kết quả của phong trào dân chủ 1936-1939 đối với lực lượng cách mạng?",
    options: ["Lực lượng vũ trang phát triển mạnh mẽ nhất.", "Xây dựng được đội quân chính trị quần chúng gồm hàng triệu người.", "Giải phóng được nhiều vùng nông thôn rộng lớn.", "Giành được chính quyền ở một số địa phương."],
    correctAnswer: 1,
    difficulty: 'medium'
  },

  // CẤP ĐỘ 3: KHÓ (3 câu)
  {
    id: 21,
    text: "Theo số liệu trong sách, tính đến tháng 10/1938, số lượng hội viên trong các tổ chức quần chúng (công, nông, phụ, học sinh...) là bao nhiêu?",
    options: ["Khoảng 10.000 người", "Chính xác 25.000 người", "Chính xác 35.009 người", "Hơn 50.000 người"],
    correctAnswer: 2,
    difficulty: 'hard'
  },
  {
    id: 22,
    text: "Câu nói: 'Cuộc dân tộc giải phóng không nhất thiết phải kết chặt với cuộc cách mạng điền địa' nằm trong văn kiện nào?",
    options: ["Nghị quyết Hội nghị Trung ương tháng 7/1936", "Chỉ thị của Ban Trung ương Đảng gửi các tổ chức của Đảng (26/7/1936)", "Tác phẩm Tự chỉ trích (1939)", "Văn kiện 'Chung quanh vấn đề chiến sách mới' (10/1936)"],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 23,
    text: "Ngoài Lê Hồng Phong, Hà Huy Tập, ai là người tham dự Hội nghị Ban Chấp hành Trung ương tháng 7/1936 tại Thượng Hải?",
    options: ["Phùng Chí Kiên", "Hoàng Văn Thụ", "Nguyễn Thị Minh Khai", "Võ Nguyên Giáp"],
    correctAnswer: 0,
    difficulty: 'hard'
  },
  {
    id: 24,
    text: "Một trong những nhận thức lý luận quan trọng của Đảng giai đoạn này là: 'Những yêu sách đòi tự do, dân chủ, cơm áo...' được coi là gì?",
    options: ["Mục đích cuối cùng của cách mạng.", "Phương tiện duy nhất để giành chính quyền.", "Không phải mục đích cuối cùng, mà là phương tiện để đi đến đích.", "Mục tiêu chiến lược xuyên suốt mọi giai đoạn."],
    correctAnswer: 2,
    difficulty: 'hard'
  },
  {
    id: 25,
    text: "Theo sách giáo trình, Hà Huy Tập giữ chức vụ Tổng Bí thư của Đảng trong khoảng thời gian chính xác nào?",
    options: ["Từ 3/1935 đến 7/1936", "Từ 8/1936 đến 3/1938", "Từ 7/1936 đến 10/1938", "Từ 10/1930 đến 4/1931"],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 26,
    text: "Năm 1939, Nguyễn Ái Quốc đã gửi nhiều thư cho Trung ương Đảng nhằm mục đích gì?",
    options: ["Chỉ đạo chuẩn bị khởi nghĩa vũ trang ngay lập tức.", "Truyền đạt quan điểm của Quốc tế Cộng sản và góp ý kiến về sự lãnh đạo của Đảng.", "Yêu cầu giải tán Mặt trận Dân chủ để lập Mặt trận Việt Minh.", "Thông báo về sự ra đời của Đội Việt Nam Tuyên truyền Giải phóng quân."],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 27,
    text: "Số lượng đảng viên hoạt động BÍ MẬT của Đảng tính đến trước khi Chiến tranh thế giới thứ hai bùng nổ là bao nhiêu?",
    options: ["Hơn 200 đảng viên", "1.597 đảng viên", "3.000 đảng viên", "5.000 đảng viên"],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 28,
    text: "Trong phong trào 1936-1939, Đảng đã khắc phục được hạn chế gì của Luận cương chính trị tháng 10/1930?",
    options: ["Đánh giá thấp vai trò của giai cấp công nhân.", "Không thấy được khả năng cách mạng của các giai cấp khác.", "Nhận thức lại mối quan hệ giữa hai nhiệm vụ phản đế và điền địa.", "Quá nhấn mạnh vai trò của tư sản dân tộc."],
    correctAnswer: 2,
    difficulty: 'hard'
  },
  {
    id: 29,
    text: "Tác phẩm 'Tự chỉ trích' (1939) được đánh giá có ý nghĩa lý luận và thực tiễn về vấn đề gì?",
    options: ["Xây dựng lực lượng vũ trang.", "Xây dựng Đảng, tự phê bình và phê bình.", "Phân chia lại ruộng đất cho nông dân.", "Ngoại giao với các nước phát xít."],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 30,
    text: "Câu trích dẫn: 'Việc gì đúng với nguyện vọng nhân dân thì được quần chúng nhân dân ủng hộ và hăng hái đấu tranh...' là bài học kinh nghiệm được rút ra từ văn kiện nào?",
    options: ["Chung quanh vấn đề chiến sách mới.", "Tuyên ngôn của Đảng Cộng sản Đông Dương.", "Văn kiện Đại hội VII Quốc tế Cộng sản.", "Thông cáo của Trung ương Đảng."],
    correctAnswer: 3,
    difficulty: 'hard'
  }
];

export const MATCHING_PACKS: MatchPack[] = [
  {
    id: 1,
    title: "GÓI 1: NGÒI BÚT CHIẾN SĨ",
    description: "Tác giả & Tác phẩm tiêu biểu (1936-1939)",
    pairs: [
      { id: 1, leftContent: "Nguyễn Văn Cừ", rightContent: "Tác phẩm \"Tự chỉ trích\" (1939)" },
      { id: 2, leftContent: "Hải Triều", rightContent: "Sách \"Chủ nghĩa mácxít phổ thông\" (1938)" },
      { id: 3, leftContent: "Qua Ninh & Vân Đình", rightContent: "Cuốn \"Vấn đề dân cày\" (1938)" },
      { id: 4, leftContent: "Hà Huy Tập", rightContent: "Sách \"Tờrốtxky và phản cách mạng\" (1937)" },
      { id: 5, leftContent: "Nhóm Tờ-rốt-kít", rightContent: "Đối tượng bị phê phán là \"phản cách mạng\"" }
    ]
  },
  {
    id: 2,
    title: "GÓI 2: DÒNG CHẢY THỜI GIAN",
    description: "Các sự kiện và mốc thời gian quan trọng",
    pairs: [
      { id: 1, leftContent: "Tháng 7 / 1936", rightContent: "Hội nghị BCH Trung ương tại Thượng Hải" },
      { id: 2, leftContent: "Ngày 1 / 5 / 1938", rightContent: "Mít tinh khổng lồ tại Nhà Đấu xảo Hà Nội" },
      { id: 3, leftContent: "Cuối năm 1937", rightContent: "Sự ra đời của Phong trào Truyền bá Quốc ngữ" },
      { id: 4, leftContent: "Tháng 9 / 1939", rightContent: "CTTG thứ hai bùng nổ, Đảng rút vào bí mật" },
      { id: 5, leftContent: "Tháng 3 / 1938", rightContent: "Thành lập Mặt trận Dân chủ Đông Dương" }
    ]
  },
  {
    id: 3,
    title: "GÓI 3: LÃNH ĐẠO & PHƯƠNG PHÁP",
    description: "Vai trò lãnh tụ và hình thức đấu tranh",
    pairs: [
      { id: 1, leftContent: "Lê Hồng Phong", rightContent: "Chủ trì Hội nghị BCH TƯ tháng 7/1936" },
      { id: 2, leftContent: "Nguyễn Văn Cừ", rightContent: "Được bầu làm Tổng Bí thư (3/1938)" },
      { id: 3, leftContent: "Gôđa (Godart)", rightContent: "Phái viên Pháp sang điều tra Đông Dương" },
      { id: 4, leftContent: "Đông Dương Đại hội", rightContent: "Phong trào thu thập \"dân nguyện\"" },
      { id: 5, leftContent: "Báo chí công khai", rightContent: "Tin tức, Tiền phong, Dân chúng, Lao động" }
    ]
  },
  {
    id: 4,
    title: "GÓI 4: THỬ THÁCH HỖN HỢP",
    description: "Tổng hợp địa danh, sự kiện và lý luận",
    pairs: [
      { id: 1, leftContent: "Thượng Hải (Trung Quốc)", rightContent: "Hội nghị chuyển hướng chỉ đạo chiến lược" },
      { id: 2, leftContent: "Phong trào \"Đón rước\"", rightContent: "Lợi dụng chuyến đi của quan chức Pháp" },
      { id: 3, leftContent: "Viện Dân biểu", rightContent: "Đấu tranh nghị trường" },
      { id: 4, leftContent: "Hà Huy Tập", rightContent: "Tổng Bí thư (8/1936 - 3/1938)" },
      { id: 5, leftContent: "Tự chỉ trích", rightContent: "Nâng cao tự phê bình và đấu tranh nội bộ" }
    ]
  }
];

export const HIDDEN_KEYWORD_DATA: HiddenKeywordData = {
  keyword: "TẬP DƯỢT THỨ HAI",
  description: "Đây là nhận định quan trọng nhất về ý nghĩa của phong trào 1936-1939 đối với Cách mạng Tháng Tám 1945.",
  questions: [
    {
      id: 1,
      question: "Qua phong trào, uy tín và ảnh hưởng của Đảng được mở rộng. Chủ nghĩa ... được phổ biến sâu rộng trong quần chúng.",
      answer: ["MÁC LÊNIN", "MÁC - LÊNIN", "MAC LENIN", "MAC - LENIN", "MÁC", "MAC"],
      hint: "Đây là nền tảng tư tưởng của Đảng."
    },
    {
      id: 2,
      question: "Kết quả to lớn của phong trào là Đảng đã xây dựng được một đội quân ... hùng hậu gồm hàng triệu người.",
      answer: ["CHÍNH TRỊ", "CHINH TRI"],
      hint: "Không phải đội quân vũ trang, mà là đội quân...?"
    },
    {
      id: 3,
      question: "Bài học kinh nghiệm lớn về chỉ đạo chiến lược là giải quyết đúng đắn mối quan hệ giữa mục tiêu chiến lược (lâu dài) và mục tiêu ... (trước mắt).",
      answer: ["CỤ THỂ", "CU THE"],
      hint: "Từ trái nghĩa với 'trừu tượng' hoặc 'chung chung'."
    },
    {
      id: 4,
      question: "Tháng 3/1938, Đảng quyết định thành lập Mặt trận ... Đông Dương để tập hợp rộng rãi lực lượng.",
      answer: ["DÂN CHỦ", "DAN CHU"],
      hint: "Tên phong trào giai đoạn này."
    }
  ]
};
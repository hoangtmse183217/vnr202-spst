import React from 'react';

interface Stage3IntroScreenProps {
  onComplete: () => void;
}

const Stage3IntroScreen: React.FC<Stage3IntroScreenProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 bg-vnRed flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-paper p-1 border-4 border-ink shadow-2xl max-w-3xl w-full">
         <div className="border-2 border-ink p-4 md:p-8 text-center flex flex-col items-center">
            
            <h2 className="text-ink text-base md:text-xl font-bold uppercase tracking-[0.3em] mb-2">
              Vòng Quyết Định
            </h2>
            
            <h1 className="text-vnRed text-3xl xs:text-4xl md:text-7xl font-black font-serif uppercase tracking-wider leading-tight mb-4 underline decoration-ink decoration-4">
              Ô CHỮ BÍ ẨN
            </h1>

            {/* Storytelling Narrative */}
            <div className="bg-ink p-3 md:p-4 mb-4 md:mb-6 w-full transform -rotate-1">
                <p className="text-paper font-serif text-base md:text-xl font-bold italic leading-relaxed">
                   "Báo đã in xong. Nhưng kẻ thù đang đến! Hãy giải mã từ khóa cuối cùng để <span className="text-vnRed underline">tiêu hủy tài liệu mật</span> trước khi bị bắt!"
                </p>
            </div>

            <div className="bg-[#fffdf5] border border-ink p-4 md:p-6 w-full text-left mb-6 md:mb-8 shadow-retro-sm">
               <h3 className="text-base md:text-lg font-bold text-ink uppercase border-b border-ink pb-1 mb-3">Hồ sơ mật:</h3>
               <ul className="space-y-2 md:space-y-3 text-ink font-serif text-base md:text-lg">
                  <li>• <strong className="text-vnRed">4 Mảnh ghép</strong> đang che khuất Từ Khóa.</li>
                  <li>• Trả lời đúng: <strong>+20 điểm</strong> / mở 1 mảnh.</li>
                  <li>• Đoán đúng Từ Khóa: <strong>+100 điểm</strong>.</li>
                  <li className="font-bold text-vnRed italic bg-red-100 p-1 border border-red-200 mt-2 text-center text-xs md:text-base">
                     ⚠️ CẢNH BÁO: Đoán SAI từ khóa = TRỪ 50% ĐIỂM!
                  </li>
               </ul>
            </div>

            <button 
                onClick={onComplete}
                className="bg-ink text-paper px-6 md:px-10 py-3 md:py-4 text-lg md:text-2xl font-bold font-serif uppercase tracking-widest hover:bg-sepia transition-colors shadow-retro w-full md:w-auto"
            >
                Mở Hồ Sơ
            </button>
         </div>
      </div>
    </div>
  );
};

export default Stage3IntroScreen;
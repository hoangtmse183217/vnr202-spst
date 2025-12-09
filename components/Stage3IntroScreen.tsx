import React from 'react';

interface Stage3IntroScreenProps {
  onComplete: () => void;
}

const Stage3IntroScreen: React.FC<Stage3IntroScreenProps> = ({ onComplete }) => {
  // Removed useEffect/setTimeout to allow user to click Ready manually

  return (
    <div className="fixed inset-0 bg-vnRed flex flex-col items-center justify-center z-50 overflow-hidden text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,0,0.2) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 text-center flex flex-col items-center p-4 w-full max-w-4xl">
        <h2 className="text-yellow-200 text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-4 animate-slide-in-top">
          Màn 3: Về Đích
        </h2>
        
        <div className="flex gap-4 items-center justify-center animate-zoom-in my-6">
           <div className="text-6xl md:text-8xl animate-bounce">❓</div>
           <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-wider drop-shadow-2xl text-left leading-tight">
             Ô CHỮ<br/><span className="text-yellow-400">BÍ ẨN</span>
           </h1>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/20 animate-fade-in delay-500 mb-10 max-w-2xl">
           <p className="text-lg font-bold mb-4 text-yellow-200 uppercase tracking-widest border-b border-white/20 pb-2">Luật chơi Vòng Quyết Định</p>
           <ul className="text-left text-base md:text-lg space-y-3 text-gray-100">
              <li className="flex items-start gap-2">
                <span className="text-2xl">🧩</span> 
                <span><strong>4 Mảnh ghép</strong> đang che khuất Từ Khóa Chủ Đề.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">✍️</span> 
                <span>Trả lời đúng câu hỏi để lật mảnh ghép (+20 điểm).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">🔑</span> 
                <span>Đoán đúng <strong>Từ Khóa</strong> để chiến thắng (+100 điểm).</span>
              </li>
              <li className="flex items-start gap-2 text-red-300 font-bold bg-black/20 p-2 rounded">
                <span className="text-2xl">⚠️</span> 
                <span>LƯU Ý: Đoán SAI từ khóa sẽ bị LOẠI ngay lập tức!</span>
              </li>
           </ul>
        </div>

        {/* READY BUTTON */}
        <button 
            onClick={onComplete}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-black text-vnRed transition-all duration-200 bg-yellow-400 font-sans rounded-full hover:bg-white hover:text-vnRed focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400 animate-bounce-in shadow-[0_0_20px_rgba(250,204,21,0.6)]"
            style={{ animationDelay: '2s', animationFillMode: 'backwards' }}
        >
            <span className="mr-3">🚀</span> TÔI ĐÃ SẴN SÀNG!
            <div className="absolute -inset-3 rounded-full border-2 border-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"></div>
        </button>
      </div>

      <style>{`
        @keyframes slide-in-top {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        .animate-slide-in-top { animation: slide-in-top 0.8s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.5s; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards 1s; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards; }
      `}</style>
    </div>
  );
};

export default Stage3IntroScreen;
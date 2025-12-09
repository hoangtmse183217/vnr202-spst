import React, { useEffect } from 'react';

interface Stage2IntroScreenProps {
  onComplete: () => void;
}

const Stage2IntroScreen: React.FC<Stage2IntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-t-4 border-l-4 border-yellow-400 opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-b-4 border-r-4 border-yellow-400 opacity-50"></div>
      </div>
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <h2 className="text-blue-300 text-3xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-4 animate-slide-in-top">
          Màn 2
        </h2>
        
        <div className="w-full h-0.5 bg-yellow-400 mb-8 animate-expand-width opacity-50"></div>
        
        <div className="flex gap-4 items-center justify-center animate-zoom-in">
           <div className="text-7xl md:text-8xl">🧩</div>
           <h1 className="text-yellow-400 text-5xl md:text-7xl font-extrabold uppercase tracking-wider drop-shadow-2xl text-left leading-tight">
             GHÉP NỐI<br/><span className="text-white">LỊCH SỬ</span>
           </h1>
        </div>

        <p className="text-gray-300 mt-10 text-xl font-light animate-fade-in delay-1000 max-w-md">
          Nối dữ kiện Cột A với Cột B để tái hiện lại bức tranh lịch sử.
        </p>
      </div>

      <style>{`
        @keyframes slide-in-top {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes expand-width {
          from { width: 0; }
          to { width: 300px; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-top { animation: slide-in-top 0.8s ease-out forwards; }
        .animate-expand-width { animation: expand-width 1s ease-in-out forwards 0.5s; }
        .animate-zoom-in { animation: zoom-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 1s; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards 2s; }
      `}</style>
    </div>
  );
};

export default Stage2IntroScreen;
import React, { useEffect } from 'react';

interface StageIntroScreenProps {
  onComplete: () => void;
}

const StageIntroScreen: React.FC<StageIntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Show intro for 3 seconds then switch to game
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-vnRed opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 text-center animate-fade-in-up">
        <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-4 opacity-0 animate-slide-in-top" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Màn 1
        </h2>
        
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 transform scale-x-0 animate-expand-width" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}></div>
        
        <h1 className="text-yellow-400 text-5xl md:text-8xl font-extrabold uppercase tracking-wider drop-shadow-2xl opacity-0 animate-zoom-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          GIẢI MẬT MÃ
        </h1>

        <p className="text-gray-300 mt-8 text-xl italic opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
          Sẵn sàng...
        </p>
      </div>

      <style>{`
        /* Keyframes */
        @keyframes slide-in-top {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes expand-width {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes zoom-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Animation Classes */
        .animate-slide-in-top {
          animation: slide-in-top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-expand-width {
          animation: expand-width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StageIntroScreen;
import React, { useEffect } from 'react';

interface StageIntroScreenProps {
  onComplete: () => void;
}

const StageIntroScreen: React.FC<StageIntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-paper flex flex-col items-center justify-center z-50">
      <div className="border-y-4 border-double border-ink w-full py-12 text-center bg-[#fffdf5]">
        <h2 className="text-sepia text-2xl font-bold uppercase tracking-[0.3em] mb-4">
          Màn 1
        </h2>
        
        <h1 className="text-vnRed text-5xl md:text-7xl font-black font-serif uppercase tracking-wider drop-shadow-[2px_2px_0_#1a1a1a]">
          GIẢI MẬT MÃ
        </h1>
      </div>
    </div>
  );
};

export default StageIntroScreen;
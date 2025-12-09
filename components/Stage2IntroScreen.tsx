import React, { useEffect } from 'react';

interface Stage2IntroScreenProps {
  onComplete: () => void;
}

const Stage2IntroScreen: React.FC<Stage2IntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center z-50 p-6">
      <div className="text-center border-4 border-paper p-6 md:p-10 max-w-2xl bg-ink relative w-full">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 md:w-6 h-4 md:h-6 border-t-4 border-l-4 border-vnRed"></div>
        <div className="absolute bottom-0 right-0 w-4 md:w-6 h-4 md:h-6 border-b-4 border-r-4 border-vnRed"></div>

        <h2 className="text-paper text-lg md:text-2xl font-bold uppercase tracking-[0.3em] mb-4 border-b border-paper pb-2 inline-block">
          Màn 2
        </h2>
        
        <h1 className="text-vnRed text-4xl xs:text-5xl md:text-7xl font-black font-serif uppercase tracking-wider mb-2">
          GHÉP NỐI
        </h1>
        <h1 className="text-paper text-3xl xs:text-4xl md:text-6xl font-black font-serif uppercase tracking-wider">
          LỊCH SỬ
        </h1>
        
        <div className="mt-6 md:mt-8 border-t border-gray-600 pt-4 md:pt-6">
             <p className="text-paper/90 font-serif text-base md:text-xl leading-relaxed italic">
              "Mật mã đã giải xong. Bây giờ bạn cần <strong className="text-vnRed not-italic">sắp xếp lại các tài liệu</strong> bị xáo trộn để gửi đi in báo."
            </p>
        </div>
      </div>
    </div>
  );
};

export default Stage2IntroScreen;
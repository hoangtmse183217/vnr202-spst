import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  onViewLeaderboard: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewLeaderboard }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng điền tên chiến sĩ!');
      return;
    }
    onStart(name);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      
      <div className="relative z-10 w-full max-w-2xl text-center py-8">
        {/* Masthead / Newspaper Title */}
        <div className="border-b-4 border-double border-ink mb-6 md:mb-8 pb-4 md:pb-6">
            <div className="flex justify-between items-end border-b-2 border-ink pb-2 mb-2">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sepia">Cơ quan tuyên truyền</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sepia">Số đặc biệt: 1936-1939</span>
            </div>
            
            <h1 className="text-5xl xs:text-6xl md:text-8xl font-black font-serif text-vnRed uppercase leading-none tracking-tight drop-shadow-sm">
                DÂN CHỦ
            </h1>
            <h2 className="text-lg xs:text-xl md:text-3xl font-bold font-serif text-ink uppercase tracking-widest mt-2 border-t-2 border-ink pt-2">
                Mặt trận Thống nhất Đông Dương
            </h2>
        </div>

        {/* Main Content Box */}
        <div className="bg-paper border-4 border-ink p-1 shadow-retro max-w-lg mx-auto transform rotate-1 transition-transform hover:rotate-0">
          <div className="border-2 border-ink p-4 xs:p-6 md:p-8 flex flex-col gap-4 md:gap-6">
            
            <div className="text-center">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-ink mb-2 uppercase decoration-vnRed underline decoration-4 underline-offset-4">
                    Ghi Danh Tham Dự
                </h3>
                {/* Storytelling Narrative */}
                <div className="bg-[#fffdf5] p-3 border border-sepia/30 shadow-inner my-2">
                    <p className="text-sepia font-serif text-sm md:text-base italic leading-relaxed">
                        "Bạn là một liên lạc viên trẻ tuổi năm 1936. Nhiệm vụ của bạn là giải mã các chỉ thị từ Trung ương."
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
              <div className="text-left">
                <label htmlFor="nickname" className="block text-ink font-bold mb-2 text-xs uppercase tracking-wider border-l-4 border-vnRed pl-2">
                  Họ và Tên Chiến Sĩ
                </label>
                <input
                  id="nickname"
                  type="text"
                  className="w-full px-4 py-3 bg-[#fffdf5] border-2 border-ink focus:border-vnRed focus:ring-0 outline-none text-base md:text-lg font-serif text-ink placeholder-gray-400 shadow-inner"
                  placeholder="Nhập tên của bạn..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  autoFocus
                />
                {error && <p className="text-vnRed text-sm mt-2 font-bold italic flex items-center gap-1">
                  ⚠️ {error}
                </p>}
              </div>

              <button
                type="submit"
                className="w-full bg-vnRed hover:bg-[#b91c15] text-white font-bold font-serif py-3 border-2 border-transparent hover:border-ink shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-lg md:text-xl uppercase tracking-wider flex items-center justify-center gap-2 group"
              >
                Vào Trận Địa
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <div className="flex justify-center border-t border-dashed border-ink pt-4">
                 <button
                    type="button"
                    onClick={onViewLeaderboard}
                    className="text-sepia hover:text-vnRed font-bold text-xs md:text-sm uppercase border-b border-sepia hover:border-vnRed transition-colors"
                  >
                    Xem Bảng Vàng Thành Tích
                  </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 text-sepia text-[10px] md:text-xs font-bold uppercase tracking-widest border-t border-ink pt-4 inline-block px-4 md:px-8">
          Việt Nam Độc Lập - Tự Do - Hạnh Phúc
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
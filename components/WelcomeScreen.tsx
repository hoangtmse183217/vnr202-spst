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
      setError('Vui lòng nhập tên chiến sĩ!');
      return;
    }
    onStart(name);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#fdfbf7]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Title Section */}
        <div className="mb-10">
          <div className="inline-block mb-4">
             <span className="text-6xl animate-bounce inline-block">⭐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-vnRed mb-2 drop-shadow-sm uppercase leading-tight">
            Phong trào Dân chủ
          </h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 uppercase tracking-widest">
            1936-1939
          </h2>
          <div className="mt-6 w-24 h-1.5 bg-vnRed mx-auto rounded-full"></div>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-left">
              <label htmlFor="nickname" className="block text-gray-600 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">
                Nhập tên chiến sĩ
              </label>
              <input
                id="nickname"
                type="text"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-vnRed focus:ring-4 focus:ring-red-100 transition-all outline-none text-lg font-semibold bg-white text-gray-800 placeholder-gray-400"
                placeholder="VD: Nguyễn Văn A..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {error}
              </p>}
            </div>

            <button
              type="submit"
              className="w-full bg-vnRed hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-xl transform hover:-translate-y-1 active:scale-95 transition-all duration-200 text-xl flex items-center justify-center gap-3 group mb-2"
            >
              BẮT ĐẦU CHƠI
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            
            {/* Elegant Leaderboard Link */}
            <div className="flex justify-center pt-2">
               <button
                  type="button"
                  onClick={onViewLeaderboard}
                  className="group flex items-center gap-3 px-5 py-2 rounded-full text-gray-500 hover:text-vnRed hover:bg-red-50 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200 group-hover:scale-110 group-hover:border-yellow-300 transition-transform shadow-sm">
                    <span className="text-sm">🏆</span>
                  </div>
                  <span className="font-semibold text-sm tracking-wide group-hover:underline decoration-red-200 underline-offset-4">
                    Xem Bảng Vàng Thành Tích
                  </span>
                </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-gray-400 text-xs font-medium opacity-60">
          Dự án Game Giáo dục Lịch sử Việt Nam
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
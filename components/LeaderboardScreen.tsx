import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Player } from '../types';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocal, setUsingLocal] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}p ${s}s`;
  };

  const fetchSupabaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(50);

      if (error) throw error;
      if (data) {
        setLeaderboard(data);
        setLoading(false);
      }
    } catch (error: any) {
      console.warn("Could not fetch Supabase data, switching to local storage.", error.message || error);
      fetchLocalData();
    }
  };

  const fetchLocalData = () => {
    setUsingLocal(true);
    const STORAGE_KEY = 'vn_history_leaderboard';
    const rawData = localStorage.getItem(STORAGE_KEY);
    const localPlayers: Player[] = rawData ? JSON.parse(rawData) : [];
    
    // Ensure sorted
    localPlayers.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time_seconds - b.time_seconds;
    });

    setLeaderboard(localPlayers);
    setLoading(false);
  };

  useEffect(() => {
    fetchSupabaseData();

    const channel = supabase
      .channel('public:players_leaderboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
        },
        () => {
          if (!usingLocal) {
             fetchSupabaseData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper for Top 3 Styling
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-50 border-yellow-400 shadow-yellow-100/50';
      case 1: return 'bg-gray-50 border-gray-300 shadow-gray-100/50';
      case 2: return 'bg-orange-50 border-orange-300 shadow-orange-100/50';
      default: return 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <span className="text-3xl filter drop-shadow-sm">🥇</span>;
      case 1: return <span className="text-3xl filter drop-shadow-sm">🥈</span>;
      case 2: return <span className="text-3xl filter drop-shadow-sm">🥉</span>;
      default: return <span className="text-gray-500 font-black text-xl w-8 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-6 relative bg-[#fdfbf7] overflow-hidden font-sans">
       {/* Background Decor */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#b45309 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col h-full max-h-[90vh]">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-vnRed font-bold bg-white/80 backdrop-blur px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all border border-red-100 hover:-translate-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Quay lại
          </button>

          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border shadow-sm font-bold ${usingLocal ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
             <span className={`w-2 h-2 rounded-full ${usingLocal ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`}></span>
             {usingLocal ? 'Offline Mode' : 'Live Update'}
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden flex-1 animate-fade-in-up">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-vnRed to-red-800 p-6 md:p-8 text-white shadow-lg relative overflow-hidden shrink-0">
               {/* Pattern Overlay */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
               
               <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-white/20 animate-bounce-small">
                     <span className="text-4xl">🏆</span>
                  </div>
                  <h3 className="font-black text-3xl md:text-4xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 drop-shadow-sm">
                    Bảng Vàng
                  </h3>
                  <p className="text-red-100 text-sm md:text-base mt-2 font-medium max-w-md">
                    Vinh danh những chiến sĩ xuất sắc nhất trong phong trào Dân chủ 1936-1939
                  </p>
               </div>
            </div>
            
            {/* Table Header Row (Sticky) */}
            <div className="bg-gray-100/90 backdrop-blur border-b border-gray-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 z-20 sticky top-0">
               <div className="col-span-2 md:col-span-2 text-center">Hạng</div>
               <div className="col-span-6 md:col-span-5">Chiến sĩ</div>
               <div className="col-span-2 md:col-span-3 text-right">Điểm</div>
               <div className="col-span-2 md:col-span-2 text-right">Thời gian</div>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 p-4 md:p-6 scroll-smooth scrollbar-thin">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-full gap-4 text-gray-400">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-vnRed border-t-transparent"></div>
                  <p className="animate-pulse font-medium text-sm">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={player.id || index} 
                      className={`
                        grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md
                        ${getRankStyle(index)}
                        animate-slide-up
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Rank */}
                      <div className="col-span-2 md:col-span-2 flex justify-center">
                        {getRankIcon(index)}
                      </div>

                      {/* Name */}
                      <div className="col-span-6 md:col-span-5">
                         <p className={`font-bold text-sm md:text-base truncate ${index < 3 ? 'text-gray-900' : 'text-gray-700'}`}>
                           {player.name}
                         </p>
                         {index < 3 && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide hidden md:block">Xuất sắc</p>}
                      </div>

                      {/* Score */}
                      <div className="col-span-2 md:col-span-3 text-right">
                         <div className="inline-block bg-white/50 px-3 py-1 rounded-lg">
                           <span className="font-black text-vnRed text-base md:text-lg">{player.score}</span>
                         </div>
                      </div>

                      {/* Time */}
                      <div className="col-span-2 md:col-span-2 text-right">
                        <span className="font-mono text-gray-500 text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">
                          {formatTime(player.time_seconds)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {leaderboard.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                        <div className="text-6xl mb-4 grayscale">📜</div>
                        <p className="text-lg font-bold">Chưa có dữ liệu</p>
                        <p className="text-sm">Hãy là người đầu tiên ghi danh!</p>
                     </div>
                  )}
                  
                  {/* End of list spacer */}
                  <div className="h-4"></div>
                </div>
              )}
            </div>
        </div>
      </div>
      
      <style>{`
         @keyframes bounce-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
         }
         .animate-bounce-small {
            animation: bounce-small 2s infinite ease-in-out;
         }
         @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
         }
         .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
            opacity: 0; /* Init hidden for animation */
         }
         @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
         }
         .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out forwards;
         }
         
         /* Custom Scrollbar for this container */
         .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
         }
         .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent; 
         }
         .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(218, 37, 29, 0.2);
            border-radius: 20px;
         }
         .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: rgba(218, 37, 29, 0.5);
         }
      `}</style>
    </div>
  );
};

export default LeaderboardScreen;
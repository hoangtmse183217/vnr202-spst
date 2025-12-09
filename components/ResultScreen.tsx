import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Player } from '../types';

interface ResultScreenProps {
  score: number;
  timeSeconds: number;
  playerName: string;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, timeSeconds, playerName, onRestart }) => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}p ${s}s`;
  };

  useEffect(() => {
    const submitScoreAndFetchLeaderboard = async () => {
      try {
        // 1. Try Submit Score to Supabase
        const { error: insertError } = await supabase
          .from('players')
          .insert([
            { name: playerName, score: score, time_seconds: timeSeconds }
          ]);

        if (insertError) {
          throw insertError;
        }

        // 2. If successful, setup Realtime subscription
        const channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'players',
            },
            () => {
              fetchSupabaseLeaderboard();
            }
          )
          .subscribe();

        // 3. Fetch initial data from Supabase
        await fetchSupabaseLeaderboard();

        return () => {
          supabase.removeChannel(channel);
        };

      } catch (e: any) {
        console.warn("Supabase connection issue. Switching to Local Storage mode.", e.message || e);
        // Fallback to Local Storage
        handleLocalStorageFallback();
      }
    };

    submitScoreAndFetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const fetchSupabaseLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(50); // Fetch top 50 for leaderboard scrolling

      if (error) throw error;
      if (data) {
        setLeaderboard(data);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error fetching Supabase leaderboard:', error.message || error);
    }
  };

  const handleLocalStorageFallback = () => {
    try {
      const STORAGE_KEY = 'vn_history_leaderboard';
      const rawData = localStorage.getItem(STORAGE_KEY);
      let localPlayers: Player[] = rawData ? JSON.parse(rawData) : [];
      
      // Add current player
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: playerName,
        score: score,
        time_seconds: timeSeconds,
        created_at: new Date().toISOString()
      };
      
      localPlayers.push(newPlayer);
      
      // Sort: High score first, then low time
      localPlayers.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time_seconds - b.time_seconds;
      });

      // Save back to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localPlayers));

      // Update State
      setLeaderboard(localPlayers.slice(0, 50));
      setLoading(false);
    } catch (err) {
      console.error("Local storage error:", err);
      setLoading(false);
    }
  };

  const isHighScore = score >= 150;

  return (
    <div className="w-full h-screen bg-[#fdfbf7] flex flex-col font-sans relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#b45309 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Header/Nav for Result Screen */}
      <div className="relative z-10 flex justify-between items-center p-4 md:p-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-vnRed text-white px-4 py-1 rounded-full font-bold shadow-lg flex items-center gap-2 animate-slide-in-left">
                <span>🏁</span> Kết Thúc
             </div>
          </div>
          <button
             onClick={onRestart}
             className="group flex items-center gap-2 text-gray-600 hover:text-vnRed font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all animate-slide-in-right"
          >
             <span className="text-xl group-hover:-translate-x-1 transition-transform">🏠</span>
             <span className="hidden sm:inline">Về Trang Chủ</span>
          </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
         
         {/* LEFT: Result Card */}
         <div className="w-full md:w-1/3 flex flex-col justify-center animate-slide-in-up">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 text-center border-t-8 border-vnRed relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-50 to-transparent opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="mb-4 md:mb-6 animate-bounce inline-block relative">
                        {isHighScore ? (
                        <span className="text-7xl md:text-8xl filter drop-shadow-md">🏆</span>
                        ) : (
                        <span className="text-7xl md:text-8xl filter drop-shadow-md">👏</span>
                        )}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/10 rounded-[50%] blur-sm"></div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-gray-800 mb-2 uppercase tracking-tight truncate">
                        {playerName}
                    </h2>
                    <p className="text-gray-500 mb-6 md:mb-8 font-medium">Hoàn thành xuất sắc nhiệm vụ!</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-red-50 p-3 md:p-4 rounded-2xl border border-red-100 group hover:scale-105 transition-transform">
                            <p className="text-[10px] md:text-xs text-red-400 uppercase font-bold tracking-widest mb-1">Tổng Điểm</p>
                            <p className="text-3xl md:text-4xl font-black text-vnRed">{score}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 md:p-4 rounded-2xl border border-yellow-100 group hover:scale-105 transition-transform">
                            <p className="text-[10px] md:text-xs text-yellow-600 uppercase font-bold tracking-widest mb-1">Thời gian</p>
                            <p className="text-xl md:text-2xl font-black text-yellow-600 mt-1 font-mono">{formatTime(timeSeconds)}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onRestart}
                        className="w-full bg-gradient-to-r from-vnRed to-red-700 hover:from-red-600 hover:to-red-800 text-white py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-base md:text-lg uppercase tracking-wide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Chơi Lại Ngay
                    </button>
                </div>
            </div>
         </div>

         {/* RIGHT: Leaderboard */}
         <div className="w-full md:w-2/3 flex flex-col h-full animate-slide-in-right delay-200 min-h-0">
             <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 flex flex-col h-full overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 md:p-5 text-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg md:text-xl flex items-center gap-3 uppercase tracking-wider">
                        <span className="text-xl md:text-2xl">📜</span> Bảng Xếp Hạng
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Cập nhật trực tiếp
                    </div>
                </div>
                
                <div className="overflow-y-auto flex-1 p-0 scrollbar-thin">
                    {loading ? (
                    <div className="flex flex-col justify-center items-center h-full gap-4 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-vnRed border-t-transparent"></div>
                        <p>Đang đồng bộ...</p>
                    </div>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/90 backdrop-blur sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-3 md:p-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Hạng</th>
                            <th className="p-3 md:p-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">Chiến sĩ</th>
                            <th className="p-3 md:p-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Điểm</th>
                            <th className="p-3 md:p-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thời gian</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                        {leaderboard.map((player, index) => (
                            <tr 
                                key={player.id || index} 
                                className={`
                                    transition-colors
                                    ${player.name === playerName ? "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400" : "hover:bg-white/50"}
                                `}
                            >
                            <td className="p-3 md:p-4 text-sm font-bold text-gray-600 text-center">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </td>
                            <td className="p-3 md:p-4 text-sm font-bold text-gray-800">
                                {player.name}
                                {player.name === playerName && <span className="ml-2 text-[10px] bg-vnRed text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">Bạn</span>}
                            </td>
                            <td className="p-3 md:p-4 text-sm font-black text-vnRed text-right">{player.score}</td>
                            <td className="p-3 md:p-4 text-sm text-gray-500 text-right font-mono">{formatTime(player.time_seconds)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    )}
                </div>
             </div>
         </div>

      </div>

      <style>{`
         @keyframes slide-in-left {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
         }
         .animate-slide-in-left { animation: slide-in-left 0.6s ease-out forwards; }
         
         @keyframes slide-in-right {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
         }
         .animate-slide-in-right { animation: slide-in-right 0.6s ease-out forwards; opacity: 0; animation-fill-mode: forwards; }

         @keyframes slide-in-up {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
         }
         .animate-slide-in-up { animation: slide-in-up 0.6s ease-out forwards; }

         .scrollbar-thin::-webkit-scrollbar { width: 6px; }
         .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
         .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 20px; }
         .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
};

export default ResultScreen;
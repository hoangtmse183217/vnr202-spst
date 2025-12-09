import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
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

  const getRankInfo = (score: number) => {
    if (score <= 50) return { title: "Học viên Tập sự", level: 1 };
    if (score <= 100) return { title: "Tân binh", level: 2 };
    if (score <= 200) return { title: "Chiến sĩ Dân chủ", level: 3 };
    if (score <= 300) return { title: "Kiện tướng Lịch sử", level: 4 };
    return { title: "Tinh Anh Lịch Sử", level: 5 };
  };

  const rankInfo = getRankInfo(score);

  // SVG Render Helper for Ranks
  const renderRankBadge = (level: number) => {
      switch(level) {
          case 1: // Học viên - Bút lông & Sổ
              return (
                <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 animate-fade-in drop-shadow-md">
                    <circle cx="50" cy="50" r="45" fill="#fdfbf7" stroke="#5c4033" strokeWidth="2" strokeDasharray="4 2"/>
                    {/* Notebook */}
                    <rect x="25" y="25" width="40" height="50" fill="#e8e4d9" stroke="#1a1a1a" strokeWidth="2"/>
                    <rect x="25" y="25" width="10" height="50" fill="#5c4033"/>
                    {/* Quill Pen */}
                    <path d="M75 15 C 80 15, 85 25, 60 80 L 55 85 L 65 75 C 80 40, 70 15, 75 15" fill="#DA251D" stroke="#1a1a1a" strokeWidth="1"/>
                    <text x="50" y="90" fontSize="10" fontFamily="serif" textAnchor="middle" fill="#5c4033">TẬP SỰ</text>
                </svg>
              );
          case 2: // Tân binh - Nón lá & Khăn rằn
              return (
                <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 animate-fade-in drop-shadow-md">
                    <circle cx="50" cy="50" r="45" fill="#fffdf5" stroke="#1a1a1a" strokeWidth="3"/>
                    {/* Nón lá */}
                    <path d="M15 65 L 50 15 L 85 65 Q 50 75 15 65 Z" fill="#D4AF37" stroke="#1a1a1a" strokeWidth="2"/>
                    <path d="M30 43 L 70 43" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.5"/>
                    <path d="M22 55 L 78 55" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.5"/>
                    {/* Star decoration */}
                    <path d="M50 30 L 53 40 L 63 40 L 55 46 L 58 56 L 50 50 L 42 56 L 45 46 L 37 40 L 47 40 Z" fill="#DA251D"/>
                    <text x="50" y="85" fontSize="12" fontFamily="serif" fontWeight="bold" textAnchor="middle" fill="#1a1a1a">TÂN BINH</text>
                </svg>
              );
          case 3: // Chiến sĩ - Loa
              return (
                <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 animate-fade-in drop-shadow-md">
                    <rect x="10" y="10" width="80" height="80" rx="10" fill="#1a1a1a" />
                    <rect x="12" y="12" width="76" height="76" rx="8" fill="#fdfbf7" />
                    {/* Megaphone */}
                    <path d="M30 35 L 70 20 L 70 80 L 30 65 Z" fill="#DA251D" stroke="#1a1a1a" strokeWidth="2"/>
                    <ellipse cx="30" cy="50" rx="5" ry="15" fill="#1a1a1a"/>
                    <rect x="65" y="45" width="20" height="10" fill="#1a1a1a"/>
                    {/* Sound waves */}
                    <path d="M75 30 Q 85 50 75 70" stroke="#DA251D" strokeWidth="3" fill="none"/>
                    <path d="M85 25 Q 100 50 85 75" stroke="#DA251D" strokeWidth="3" fill="none"/>
                    <text x="50" y="92" fontSize="10" fontFamily="serif" fontWeight="bold" textAnchor="middle" fill="#1a1a1a">TUYÊN TRUYỀN</text>
                </svg>
              );
          case 4: // Kiện tướng - Huy hiệu Sao
              return (
                <svg viewBox="0 0 100 100" className="w-36 h-36 md:w-44 md:h-44 animate-fade-in drop-shadow-md">
                     {/* Shield shape */}
                    <path d="M20 20 H 80 V 50 C 80 80 50 95 50 95 C 50 95 20 80 20 50 Z" fill="#DA251D" stroke="#D4AF37" strokeWidth="4"/>
                    {/* Big Star */}
                    <path d="M50 30 L 56 48 L 75 48 L 60 59 L 66 77 L 50 66 L 34 77 L 40 59 L 25 48 L 44 48 Z" fill="#D4AF37" stroke="#1a1a1a" strokeWidth="1"/>
                    {/* Ribbons */}
                    <path d="M20 20 L 10 10 L 10 40 L 20 30" fill="#1a1a1a"/>
                    <path d="M80 20 L 90 10 L 90 40 L 80 30" fill="#1a1a1a"/>
                    <text x="50" y="20" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#D4AF37" dy="-5">CHỈ HUY</text>
                </svg>
              );
          case 5: // Tinh anh - Vòng nguyệt quế & Cờ
              return (
                <svg viewBox="0 0 100 100" className="w-40 h-40 md:w-48 md:h-48 animate-fade-in drop-shadow-xl">
                    <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#aa8a2e" />
                        </linearGradient>
                    </defs>
                    {/* Wreath */}
                    <path d="M20 80 Q 10 50 50 10 Q 90 50 80 80" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
                    <path d="M20 80 Q 5 50 45 15" fill="none" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M80 80 Q 95 50 55 15" fill="none" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round"/>
                    
                    {/* Flag Center */}
                    <path d="M35 30 L 35 90" stroke="#5c4033" strokeWidth="3"/>
                    <path d="M35 30 L 80 40 L 35 55 Z" fill="#DA251D" stroke="#1a1a1a" strokeWidth="1"/>
                    {/* Star on Flag */}
                    <circle cx="45" cy="42" r="4" fill="#D4AF37"/>
                    
                    <text x="50" y="95" fontSize="12" fontFamily="serif" fontWeight="black" textAnchor="middle" fill="#DA251D">LÃNH TỤ</text>
                </svg>
              );
          default:
              return null;
      }
  };

  useEffect(() => {
    const submitScoreAndFetchLeaderboard = async () => {
      if (!isSupabaseConfigured()) {
        handleLocalStorageFallback();
        return;
      }
      try {
        const { error: insertError } = await supabase
          .from('players')
          .insert([{ name: playerName, score: score, time_seconds: timeSeconds }]);

        if (insertError) throw insertError;

        const channel = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, () => {
              fetchSupabaseLeaderboard();
          })
          .subscribe();

        await fetchSupabaseLeaderboard();
        return () => { supabase.removeChannel(channel); };
      } catch (e) {
        handleLocalStorageFallback();
      }
    };
    submitScoreAndFetchLeaderboard();
  }, []); 

  const fetchSupabaseLeaderboard = async () => {
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
    } catch (error) {}
  };

  const handleLocalStorageFallback = () => {
    try {
      const STORAGE_KEY = 'vn_history_leaderboard';
      const rawData = localStorage.getItem(STORAGE_KEY);
      let localPlayers: Player[] = rawData ? JSON.parse(rawData) : [];
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: playerName,
        score: score,
        time_seconds: timeSeconds,
        created_at: new Date().toISOString()
      };
      localPlayers.push(newPlayer);
      localPlayers.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time_seconds - b.time_seconds;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localPlayers));
      setLeaderboard(localPlayers.slice(0, 50));
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  return (
    <div className="w-full h-screen bg-[#F0E6D2] flex flex-col font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center p-3 md:p-4 border-b-4 border-double border-ink bg-[#fffdf5] shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-vnRed text-white px-4 md:px-6 py-2 font-bold font-serif uppercase tracking-widest shadow-retro-sm text-xs md:text-base">
                Tổng Kết
             </div>
          </div>
          <button
             onClick={onRestart}
             className="text-ink font-bold hover:text-vnRed hover:underline uppercase text-xs md:text-sm"
          >
             Trở về
          </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
         
         {/* LEFT: Certificate */}
         <div className="w-full md:w-1/3 flex flex-col justify-start md:justify-center shrink-0">
            <div className="bg-[#fffdf5] border-[4px] md:border-[6px] border-double border-ink p-4 md:p-8 text-center shadow-retro relative flex flex-col items-center">
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 w-4 md:w-8 h-4 md:h-8 border-t-4 border-l-4 border-vnRed"></div>
                <div className="absolute top-2 right-2 w-4 md:w-8 h-4 md:h-8 border-t-4 border-r-4 border-vnRed"></div>
                <div className="absolute bottom-2 left-2 w-4 md:w-8 h-4 md:h-8 border-b-4 border-l-4 border-vnRed"></div>
                <div className="absolute bottom-2 right-2 w-4 md:w-8 h-4 md:h-8 border-b-4 border-r-4 border-vnRed"></div>

                <h2 className="text-lg md:text-xl font-bold font-serif text-sepia uppercase tracking-[0.2em] mb-2 md:mb-4">Giấy Khen</h2>
                
                <h1 className="text-2xl md:text-4xl font-black font-serif text-ink uppercase mb-2 border-b-2 border-ink pb-2 md:pb-4 w-full break-words">
                    {playerName}
                </h1>
                
                {/* RANK VISUAL BADGE */}
                <div className="my-2 transform hover:scale-110 transition-transform duration-300">
                    {renderRankBadge(rankInfo.level)}
                </div>

                <div className="mb-2 md:mb-4">
                     <span className="text-xs md:text-sm font-bold uppercase text-sepia tracking-widest block mb-1">Cấp bậc phong tặng</span>
                     <span className={`text-lg md:text-xl font-black font-serif uppercase tracking-wider ${rankInfo.level >= 4 ? 'text-vnRed' : 'text-ink'}`}>
                       {rankInfo.title}
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 md:gap-4 w-full mb-4 md:mb-6">
                    <div className="border-2 border-ink p-2 bg-paper">
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sepia">Điểm số</p>
                        <p className="text-xl md:text-2xl font-black font-serif text-vnRed">{score}</p>
                    </div>
                    <div className="border-2 border-ink p-2 bg-paper">
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sepia">Thời gian</p>
                        <p className="text-base md:text-lg font-bold font-mono text-ink mt-1">{formatTime(timeSeconds)}</p>
                    </div>
                </div>
                
                <button
                    onClick={onRestart}
                    className="w-full bg-ink text-paper hover:bg-vnRed hover:text-white py-2 md:py-3 font-bold font-serif uppercase tracking-widest border-2 border-transparent transition-colors text-sm md:text-base"
                >
                    Thử thách lại
                </button>
            </div>
         </div>

         {/* RIGHT: Leaderboard */}
         <div className="w-full md:w-2/3 flex flex-col h-full min-h-0">
             <div className="bg-paper border-4 border-ink shadow-retro flex flex-col h-full overflow-hidden">
                <div className="bg-ink text-paper p-3 md:p-4 border-b-4 border-double border-paper shrink-0">
                    <h3 className="font-bold font-serif text-lg md:text-xl uppercase tracking-widest text-center">
                        Bảng Vàng Danh Dự
                    </h3>
                </div>
                
                <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
                    {loading ? (
                    <div className="flex justify-center items-center h-full p-4 text-sepia italic">
                        Đang cập nhật danh sách...
                    </div>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#e8e4d9] text-ink sticky top-0 z-10 border-b-2 border-ink">
                        <tr>
                            <th className="p-2 md:p-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center border-r border-ink">Hạng</th>
                            <th className="p-2 md:p-3 text-[10px] md:text-xs font-bold uppercase tracking-wider border-r border-ink">Chiến sĩ</th>
                            <th className="p-2 md:p-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-right border-r border-ink">Điểm</th>
                            <th className="p-2 md:p-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-right">T.Gian</th>
                        </tr>
                        </thead>
                        <tbody className="font-serif">
                        {leaderboard.map((player, index) => (
                            <tr 
                                key={player.id || index} 
                                className={`
                                    border-b border-gray-400
                                    ${player.name === playerName ? "bg-yellow-100" : "hover:bg-[#fffdf5]"}
                                `}
                            >
                            <td className="p-2 md:p-3 text-center font-bold border-r border-gray-400 text-sm md:text-base">
                                {index + 1}
                            </td>
                            <td className="p-2 md:p-3 font-bold border-r border-gray-400 text-ink text-sm md:text-base truncate max-w-[100px] md:max-w-none">
                                {player.name}
                                {player.name === playerName && <span className="ml-1 md:ml-2 text-[8px] md:text-[10px] border border-vnRed text-vnRed px-1 font-sans">BẠN</span>}
                            </td>
                            <td className="p-2 md:p-3 font-bold text-vnRed text-right border-r border-gray-400 text-sm md:text-base">{player.score}</td>
                            <td className="p-2 md:p-3 text-sepia text-right font-mono text-xs md:text-sm">{formatTime(player.time_seconds)}</td>
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
         .animate-fade-in { animation: fadeIn 0.5s ease-out; }
         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ResultScreen;
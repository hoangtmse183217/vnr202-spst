import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
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
    if (!isSupabaseConfigured()) throw new Error("Supabase credentials missing");
    const { data, error } = await supabase.from('players').select('*').order('score', { ascending: false }).order('time_seconds', { ascending: true }).limit(50);
    if (error) throw error;
    if (data) { setLeaderboard(data); setLoading(false); }
  };

  const fetchLocalData = () => {
    setUsingLocal(true);
    const rawData = localStorage.getItem('vn_history_leaderboard');
    const localPlayers: Player[] = rawData ? JSON.parse(rawData) : [];
    localPlayers.sort((a, b) => { if (b.score !== a.score) return b.score - a.score; return a.time_seconds - b.time_seconds; });
    setLeaderboard(localPlayers);
    setLoading(false);
  };

  useEffect(() => {
    fetchSupabaseData().catch(() => fetchLocalData());
    if (isSupabaseConfigured()) {
        const channel = supabase.channel('public:players_leaderboard').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' }, () => { if (!usingLocal) fetchSupabaseData().catch(() => {}); }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }
  }, [usingLocal]);

  return (
    <div className="min-h-screen w-full flex flex-col p-6 relative overflow-hidden font-sans bg-paper">
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col h-full max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-ink pb-4">
          <button onClick={onBack} className="text-ink font-bold hover:text-vnRed uppercase border-2 border-transparent hover:border-ink px-4 py-2 transition-all">
            ← Quay lại
          </button>
          <div className="text-xs font-bold uppercase tracking-widest text-sepia">
             {usingLocal ? 'Dữ liệu cục bộ' : 'Dữ liệu trực tuyến'}
          </div>
        </div>

        <div className="bg-[#fffdf5] border-4 border-ink shadow-retro flex flex-col overflow-hidden flex-1">
            <div className="bg-vnRed p-6 text-center border-b-4 border-double border-ink">
               <h3 className="font-black font-serif text-3xl md:text-4xl uppercase tracking-[0.2em] text-paper">
                 Bảng Vàng
               </h3>
               <p className="text-paper/80 font-serif italic mt-2">Vinh danh các chiến sĩ đạt thành tích cao</p>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6 scrollbar-thin">
              {loading ? (
                <div className="text-center p-10 font-serif italic text-sepia">Đang tải dữ liệu...</div>
              ) : (
                <table className="w-full border-collapse border-2 border-ink">
                    <thead className="bg-[#e8e4d9] text-ink font-bold font-serif uppercase text-sm">
                        <tr>
                            <th className="border border-ink p-3 text-center w-16">#</th>
                            <th className="border border-ink p-3 text-left">Chiến sĩ</th>
                            <th className="border border-ink p-3 text-right w-24">Điểm</th>
                            <th className="border border-ink p-3 text-right w-24">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody className="font-serif text-ink">
                        {leaderboard.map((player, index) => (
                            <tr key={index} className="odd:bg-white even:bg-[#f9f7ef] hover:bg-yellow-50">
                                <td className={`border border-ink p-3 text-center font-bold ${index < 3 ? 'text-vnRed' : ''}`}>
                                    {index + 1}
                                </td>
                                <td className="border border-ink p-3 font-medium">
                                    {player.name}
                                    {index < 3 && <span className="ml-2 text-[10px] text-vnRed font-sans font-bold uppercase border border-vnRed px-1">Top {index+1}</span>}
                                </td>
                                <td className="border border-ink p-3 text-right font-black">{player.score}</td>
                                <td className="border border-ink p-3 text-right font-mono text-sm">{formatTime(player.time_seconds)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
import React, { useState, useEffect, useRef } from 'react';
import { HIDDEN_KEYWORD_DATA } from '../constants';

interface GameScreenStage3Props {
  onFinish: (score: number, timeSeconds: number) => void;
  onExit: () => void;
  initialScore: number;
  initialTime: number;
}

const GameScreenStage3: React.FC<GameScreenStage3Props> = ({ onFinish, onExit, initialScore, initialTime }) => {
  const [currentScore, setCurrentScore] = useState(initialScore);
  const [totalTime, setTotalTime] = useState(initialTime);
  const [openedTiles, setOpenedTiles] = useState<boolean[]>([false, false, false, false]);
  
  // Game State
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [keywordGuess, setKeywordGuess] = useState("");
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isFinished, setIsFinished] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isFinished) {
        timerRef.current = setInterval(() => {
            setTotalTime(prev => prev + 1);
        }, 1000);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished]);

  const handleTileClick = (index: number) => {
    if (openedTiles[index] || isFinished) return;
    setActiveQuestionId(index);
    setFeedback('none');
    setUserAnswer("");
  };

  const normalizeText = (text: string) => {
    return text.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, ' '); // Normalize spaces
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuestionId === null) return;

    const questionData = HIDDEN_KEYWORD_DATA.questions[activeQuestionId];
    const normalizedUser = normalizeText(userAnswer);
    
    const isCorrect = questionData.answer.some(ans => normalizeText(ans) === normalizedUser);

    if (isCorrect) {
        setFeedback('correct');
        const newScore = currentScore + 20;
        setCurrentScore(newScore);
        
        setTimeout(() => {
            const newTiles = [...openedTiles];
            newTiles[activeQuestionId] = true;
            setOpenedTiles(newTiles);
            setActiveQuestionId(null);
            setFeedback('none');
        }, 1500);
    } else {
        setFeedback('wrong');
    }
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const normalizedGuess = normalizeText(keywordGuess);
      const normalizedKeyword = normalizeText(HIDDEN_KEYWORD_DATA.keyword);

      if (normalizedGuess === normalizedKeyword) {
          // WINNER
          finishGame(true);
      } else {
          // LOSER
          finishGame(false);
      }
  };

  const finishGame = (isWin: boolean) => {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      
      let finalScore = currentScore;
      
      if (isWin) {
          finalScore += 100;
          setResultMessage("CHÍNH XÁC! TUYỆT VỜI!");
          setCurrentScore(finalScore);
      } else {
          setResultMessage("RẤT TIẾC! SAI TỪ KHÓA RỒI!");
      }

      // Reveal everything
      setOpenedTiles([true, true, true, true]);
      setShowKeywordModal(false);

      setTimeout(() => {
          onFinish(finalScore, totalTime);
      }, 4000);
  };

  const activeQuestion = activeQuestionId !== null ? HIDDEN_KEYWORD_DATA.questions[activeQuestionId] : null;

  return (
    <div className="w-full h-screen bg-[#fdfbf7] flex flex-col font-sans relative overflow-hidden">
       {/* Decorative Background (Matched Stage 1 & 2) */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#b45309 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
       </div>

       {/* Header (Matched Stage 1 & 2) */}
       <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 py-2 flex justify-between items-center h-16 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-vnRed text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">3</div>
             <div className="flex flex-col">
                 <h1 className="text-gray-800 font-black uppercase text-sm md:text-base leading-none">Ô Chữ Bí Ẩn</h1>
                 <span className="text-xs text-red-500 font-bold">Về Đích</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right bg-red-50 px-4 py-1 rounded-lg border border-red-100 transition-all duration-300">
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Điểm số</p>
                <p className="text-xl font-black text-vnRed leading-none">{currentScore}</p>
             </div>
             <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
       </div>

       {/* Main Content Full Screen */}
       <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 relative z-10 overflow-hidden">
          
          {/* LEFT: Mystery Image Area (Flex Grow) */}
          <div className="flex-1 flex flex-col relative h-full">
             <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200 group">
                 {/* The Hidden Content (Revealed underneath) */}
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 text-center p-8">
                    <div className="flex flex-col items-center justify-center h-full w-full animate-pulse-slow">
                        <div className="border-b-4 border-vnRed pb-4 mb-4">
                             <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-vnRed uppercase drop-shadow-sm leading-tight">
                                {HIDDEN_KEYWORD_DATA.keyword}
                            </h2>
                        </div>
                        <p className="text-gray-700 font-serif italic text-xl md:text-2xl">{HIDDEN_KEYWORD_DATA.description}</p>
                    </div>
                 </div>

                 {/* The Tiles Overlay */}
                 <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    {openedTiles.map((isOpen, index) => (
                        <button
                           key={index}
                           disabled={isOpen || isFinished}
                           onClick={() => handleTileClick(index)}
                           className={`
                              relative border-2 border-white/50 transition-all duration-700 overflow-hidden flex items-center justify-center group/tile
                              ${isOpen ? 'opacity-0 pointer-events-none scale-95' : 'bg-[#2d3748] hover:bg-[#1a202c] cursor-pointer'}
                           `}
                        >
                           {!isOpen && (
                               <>
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                                 <span className="text-6xl md:text-8xl text-white/20 font-black z-10 transition-transform group-hover/tile:scale-110 duration-300">{index + 1}</span>
                                 <div className="absolute bottom-6 md:bottom-10 text-white/50 text-sm md:text-base font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm group-hover/tile:bg-vnRed group-hover/tile:text-white transition-colors">
                                     Nhấn để mở
                                 </div>
                               </>
                           )}
                        </button>
                    ))}
                 </div>
             </div>
          </div>

          {/* RIGHT: Sidebar Controls */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4 shrink-0 h-auto md:h-full justify-center">
             
             {/* Main Action Card */}
             <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-black text-gray-800 uppercase mb-1">Chốt Đáp Án</h3>
                    <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                        Bạn có thể đoán từ khóa bất cứ lúc nào.<br/>
                        <span className="text-green-600 font-bold">Đúng: +100 điểm</span> • <span className="text-red-500 font-bold">Sai: Dừng cuộc chơi</span>
                    </p>
                    
                    <button 
                       disabled={isFinished}
                       onClick={() => setShowKeywordModal(true)}
                       className="w-full bg-gradient-to-r from-vnRed to-red-600 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                       <span className="text-2xl group-hover:rotate-12 transition-transform">🔑</span> 
                       ĐOÁN TỪ KHÓA
                    </button>
                </div>
                {/* Decor */}
                <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 text-black rotate-12">?</div>
             </div>

             {/* Stats / Progress */}
             <div className="bg-yellow-50/80 backdrop-blur rounded-2xl border border-yellow-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-yellow-800 uppercase tracking-widest">Tiến độ mở ô</span>
                    <span className="text-xs font-bold text-yellow-800">{openedTiles.filter(Boolean).length}/4</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                     {openedTiles.map((isOpen, idx) => (
                         <div key={idx} className={`h-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                     ))}
                </div>
             </div>

             {/* Hint Box */}
             <div className="bg-blue-50/80 backdrop-blur rounded-2xl border border-blue-200 p-5 shadow-sm flex-1 md:flex-none">
                 <h4 className="flex items-center gap-2 text-blue-800 font-bold uppercase text-xs tracking-wider mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Gợi ý chiến thuật
                 </h4>
                 <p className="text-blue-900/80 text-sm italic leading-relaxed">
                    "Hãy tận dụng các ô số để tìm manh mối. Đừng vội đoán từ khóa khi chưa chắc chắn!"
                 </p>
             </div>
          </div>
       </div>

       {/* QUESTION MODAL */}
       {activeQuestionId !== null && activeQuestion && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-zoom-in relative border-t-8 border-vnRed">
                 <button 
                    onClick={() => { setActiveQuestionId(null); setFeedback('none'); }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>

                 <div className="bg-gray-50 p-8 border-b border-gray-200">
                     <div className="flex items-center gap-3 mb-4">
                         <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Mảnh ghép {activeQuestionId + 1}</span>
                         <span className="text-green-600 font-bold text-sm uppercase">+20 Điểm</span>
                     </div>
                     <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug font-serif">
                        {activeQuestion.question}
                     </h3>
                     <div className="mt-4 bg-yellow-50 border border-yellow-100 p-3 rounded-lg inline-block">
                        <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                            <span>💡</span> {activeQuestion.hint}
                        </p>
                     </div>
                 </div>

                 <div className="p-8 bg-white">
                     {feedback === 'none' ? (
                        <form onSubmit={checkAnswer} className="flex flex-col gap-6">
                            <div>
                                <input 
                                    type="text" 
                                    autoFocus
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    className="w-full text-2xl border-b-4 border-gray-300 px-4 py-4 focus:border-vnRed outline-none transition-all font-bold text-gray-800 placeholder-gray-300 uppercase text-center bg-transparent tracking-widest"
                                    placeholder="NHẬP ĐÁP ÁN..."
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-vnRed hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg uppercase tracking-wide"
                            >
                                Trả Lời
                            </button>
                        </form>
                     ) : (
                        <div className="text-center py-6">
                            {feedback === 'correct' ? (
                                <div className="animate-bounce">
                                    <div className="text-7xl mb-4">🎉</div>
                                    <h4 className="text-3xl font-black text-green-600 uppercase mb-2">Chính xác!</h4>
                                    <p className="text-gray-500 font-bold">Đang lật mảnh ghép...</p>
                                </div>
                            ) : (
                                <div className="animate-shake">
                                    <div className="text-7xl mb-4">❌</div>
                                    <h4 className="text-3xl font-black text-red-600 uppercase mb-4">Chưa đúng!</h4>
                                    <button 
                                        onClick={() => { setFeedback('none'); setUserAnswer(""); }}
                                        className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700 transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            )}
                        </div>
                     )}
                 </div>
             </div>
         </div>
       )}

       {/* KEYWORD GUESS MODAL */}
       {showKeywordModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-vnRed/90 backdrop-blur-xl p-4 animate-fade-in">
             <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-zoom-in text-center p-10 border-8 border-yellow-400 relative">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500"></div>
                 
                 <h3 className="text-3xl md:text-4xl font-black text-vnRed uppercase mb-2 tracking-tight">Quyết Định Táo Bạo!</h3>
                 <p className="text-gray-500 mb-8 font-medium">Nhập chính xác Từ Khóa Chủ Đề. <br/><span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">Nếu sai, bạn sẽ bị loại ngay lập tức!</span></p>

                 <form onSubmit={handleKeywordSubmit} className="flex flex-col gap-6">
                     <div className="relative">
                         <input 
                            type="text" 
                            autoFocus
                            value={keywordGuess}
                            onChange={(e) => setKeywordGuess(e.target.value)}
                            className="w-full text-3xl md:text-4xl text-center border-b-4 border-gray-300 px-4 py-4 focus:border-vnRed outline-none transition-all font-black text-gray-800 placeholder-gray-200 uppercase tracking-widest bg-transparent"
                            placeholder="TỪ KHÓA..."
                         />
                     </div>
                     <div className="flex gap-4 mt-4">
                        <button 
                            type="button"
                            onClick={() => setShowKeywordModal(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-xl text-lg transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-vnRed hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg uppercase"
                        >
                            Chốt Đáp Án
                        </button>
                     </div>
                 </form>
             </div>
         </div>
       )}

       {/* FINISH OVERLAY */}
       {isFinished && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
             <div className="text-center text-white animate-zoom-in max-w-3xl px-4">
                 <h2 className="text-4xl md:text-7xl font-black text-yellow-400 mb-6 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] uppercase leading-tight">
                    {resultMessage}
                 </h2>
                 <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 inline-block mb-8">
                     <p className="text-gray-300 text-lg uppercase tracking-widest mb-2">Tổng điểm cuối cùng</p>
                     <p className="text-6xl md:text-8xl font-black text-white">{currentScore}</p>
                 </div>
                 <div className="mt-4 flex flex-col items-center gap-3">
                     <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-lg font-medium animate-pulse">Đang tổng kết bảng vàng...</p>
                 </div>
             </div>
         </div>
       )}

       <style>{`
          @keyframes shake {
             0%, 100% { transform: translateX(0); }
             20% { transform: translateX(-8px); }
             40% { transform: translateX(8px); }
             60% { transform: translateX(-4px); }
             80% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
          .animate-pulse-slow { animation: pulse 3s infinite; }
          @keyframes zoom-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
       `}</style>
    </div>
  );
};

export default GameScreenStage3;
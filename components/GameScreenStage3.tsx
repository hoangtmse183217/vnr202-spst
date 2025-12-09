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
  
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [keywordGuess, setKeywordGuess] = useState("");
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isFinished, setIsFinished] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  
  // New state to track if user has already made a wrong guess
  const [hasGuessedWrong, setHasGuessedWrong] = useState(false);
  // Temporary UI feedback for penalty
  const [penaltyMessage, setPenaltyMessage] = useState("");

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
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, ' '); 
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
          finishGame(true);
      } else {
          // NEW RULE: Wrong guess -> -50% score, close modal, must open all tiles
          const penaltyScore = Math.floor(currentScore / 2);
          setCurrentScore(penaltyScore);
          setHasGuessedWrong(true);
          setShowKeywordModal(false);
          setPenaltyMessage("⚠️ Mật mã SAI! Bạn bị trừ 50% điểm. Hãy mở hết các tài liệu còn lại.");
          setTimeout(() => setPenaltyMessage(""), 4000);
      }
  };

  const finishGame = (isWin: boolean) => {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      let finalScore = currentScore;
      if (isWin) {
          finalScore += 100;
          setResultMessage("NHIỆM VỤ HOÀN THÀNH");
          setCurrentScore(finalScore);
      } else {
          setResultMessage("NHIỆM VỤ THẤT BẠI");
      }
      setOpenedTiles([true, true, true, true]);
      setShowKeywordModal(false);
      setTimeout(() => {
          onFinish(finalScore, totalTime);
      }, 4000);
  };

  const activeQuestion = activeQuestionId !== null ? HIDDEN_KEYWORD_DATA.questions[activeQuestionId] : null;
  const allTilesOpen = openedTiles.every(t => t === true);

  return (
    <div className="w-full h-screen relative flex flex-col font-sans overflow-hidden">
       {/* Penalty Toast */}
       {penaltyMessage && (
         <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-vnRed text-white px-6 py-4 z-[70] shadow-xl border-2 border-white animate-bounce font-bold text-center">
            {penaltyMessage}
         </div>
       )}

       {/* Header */}
       <div className="relative z-10 bg-[#fdfbf7] border-b-4 border-double border-ink px-4 py-2 flex justify-between items-center h-16 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-ink text-paper border border-ink flex items-center justify-center font-black font-serif text-xl">3</div>
             <div className="flex flex-col">
                 <h1 className="text-ink font-black font-serif uppercase text-lg leading-none">Hồ Sơ Mật</h1>
                 <span className="text-[10px] text-vnRed font-bold uppercase tracking-widest">Tuyệt mật</span>
             </div>
          </div>
          
          <div className="text-right">
             <p className="text-[10px] text-sepia uppercase font-bold tracking-widest">Tổng Điểm</p>
             <p className="text-xl font-black text-vnRed font-serif leading-none">{currentScore}</p>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 relative z-10 overflow-hidden">
          
          {/* LEFT: Image Area (Dossier File) */}
          <div className="flex-1 flex flex-col relative h-full bg-[#e8e4d9] border-4 border-ink p-1 shadow-retro">
             <div className="relative flex-1 border-2 border-ink overflow-hidden bg-white">
                 
                 {/* The Hidden Content */}
                 <div className="absolute inset-0 flex items-center justify-center bg-paper p-8">
                    <div className="flex flex-col items-center justify-center h-full w-full text-center">
                        <div className="border-4 border-double border-vnRed px-8 py-4 mb-4 transform -rotate-2">
                             <h2 className="text-4xl md:text-6xl font-black font-serif text-vnRed uppercase tracking-tight">
                                {HIDDEN_KEYWORD_DATA.keyword}
                            </h2>
                        </div>
                        <p className="text-ink font-serif italic text-xl">{HIDDEN_KEYWORD_DATA.description}</p>
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
                              relative border-2 border-ink flex items-center justify-center transition-all duration-500
                              ${isOpen ? 'opacity-0 pointer-events-none' : 'bg-[#2b2b2b] hover:bg-[#1a1a1a] cursor-pointer'}
                           `}
                        >
                           {!isOpen && (
                               <div className="flex flex-col items-center">
                                 <span className="text-6xl font-black font-serif text-[#3a3a3a]">?</span>
                                 <div className="mt-2 text-paper text-xs font-bold uppercase tracking-widest border border-paper px-2 py-1">
                                     Tài liệu số {index + 1}
                                 </div>
                               </div>
                           )}
                        </button>
                    ))}
                 </div>
             </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 h-auto md:h-full justify-center">
             
             {/* Action Card */}
             <div className="bg-paper border-2 border-ink p-6 shadow-retro">
                <h3 className="text-lg font-bold font-serif text-ink uppercase mb-2 border-b border-ink pb-2">Quyết Định</h3>
                
                {hasGuessedWrong && !allTilesOpen ? (
                   <div className="bg-red-50 p-2 border border-red-200 text-xs text-vnRed font-bold mb-4">
                      🔒 Đã đoán sai. Vui lòng mở hết các tài liệu còn lại để tiếp tục.
                   </div>
                ) : (
                   <p className="text-sepia text-sm mb-4 italic">
                       Đoán sai từ khóa sẽ bị <strong className="text-vnRed not-italic">TRỪ 50% SỐ ĐIỂM</strong>.
                   </p>
                )}
                
                <button 
                   disabled={isFinished || (hasGuessedWrong && !allTilesOpen)}
                   onClick={() => setShowKeywordModal(true)}
                   className={`
                      w-full font-bold font-serif py-4 border-2 shadow-sm transition-all text-lg uppercase flex items-center justify-center gap-2
                      ${isFinished || (hasGuessedWrong && !allTilesOpen) 
                        ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed' 
                        : 'bg-vnRed hover:bg-[#b91c15] text-white hover:border-ink cursor-pointer'
                      }
                   `}
                >
                   <span className="text-xl">✍️</span> 
                   Giải Mã
                </button>
             </div>

             {/* Stats */}
             <div className="bg-[#fffdf5] border-2 border-ink p-5">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-ink uppercase tracking-widest">Tiến độ giải mã</span>
                    <span className="text-xs font-bold text-ink">{openedTiles.filter(Boolean).length}/4</span>
                </div>
                <div className="grid grid-cols-4 gap-1 border border-ink p-1">
                     {openedTiles.map((isOpen, idx) => (
                         <div key={idx} className={`h-3 ${isOpen ? 'bg-green-700' : 'bg-gray-200'}`}></div>
                     ))}
                </div>
             </div>
          </div>
       </div>

       {/* QUESTION MODAL */}
       {activeQuestionId !== null && activeQuestion && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
             <div className="bg-paper max-w-2xl w-full border-4 border-double border-ink shadow-2xl relative">
                 <button 
                    onClick={() => { setActiveQuestionId(null); setFeedback('none'); }}
                    className="absolute top-2 right-2 text-ink hover:text-vnRed font-bold px-2 text-xl"
                 >
                    ✕
                 </button>

                 <div className="bg-[#e8e4d9] p-6 border-b-2 border-ink">
                     <span className="inline-block bg-ink text-paper text-xs font-bold px-2 py-1 mb-2 uppercase">Mật mã số {activeQuestionId + 1}</span>
                     <h3 className="text-2xl font-bold text-ink font-serif leading-snug">
                        {activeQuestion.question}
                     </h3>
                     <div className="mt-4 border-l-4 border-vnRed pl-3 italic text-sepia text-sm">
                        Gợi ý: {activeQuestion.hint}
                     </div>
                 </div>

                 <div className="p-8 bg-paper">
                     {feedback === 'none' ? (
                        <form onSubmit={checkAnswer} className="flex flex-col gap-6">
                            <input 
                                type="text" 
                                autoFocus
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className="w-full text-2xl border-b-2 border-ink bg-transparent px-2 py-2 focus:border-vnRed outline-none font-bold text-ink placeholder-gray-400 uppercase text-center font-serif"
                                placeholder="VIẾT ĐÁP ÁN VÀO ĐÂY..."
                            />
                            <button 
                                type="submit"
                                className="w-full bg-ink text-white hover:bg-sepia font-bold py-3 uppercase tracking-widest border-2 border-transparent hover:border-black"
                            >
                                Xác nhận
                            </button>
                        </form>
                     ) : (
                        <div className="text-center py-4">
                            {feedback === 'correct' ? (
                                <div>
                                    <h4 className="text-3xl font-black font-serif text-green-700 uppercase mb-2">Chính xác!</h4>
                                    <p className="text-ink">Đang mở tài liệu...</p>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-3xl font-black font-serif text-vnRed uppercase mb-4">Sai thông tin!</h4>
                                    <button 
                                        onClick={() => { setFeedback('none'); setUserAnswer(""); }}
                                        className="px-6 py-2 border-2 border-ink font-bold text-ink hover:bg-gray-200 uppercase"
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
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-vnRed/90 p-4">
             <div className="bg-paper max-w-lg w-full p-8 border-4 border-ink shadow-[10px_10px_0_#000] text-center">
                 <h3 className="text-3xl font-black font-serif text-vnRed uppercase mb-2 decoration-ink underline decoration-2 underline-offset-4">Mệnh Lệnh Cuối Cùng</h3>
                 <p className="text-ink mb-6 font-medium italic">Viết sai, bạn sẽ bị trừ 50% tổng điểm hiện có.</p>

                 <form onSubmit={handleKeywordSubmit} className="flex flex-col gap-6">
                     <input 
                        type="text" 
                        autoFocus
                        value={keywordGuess}
                        onChange={(e) => setKeywordGuess(e.target.value)}
                        className="w-full text-3xl text-center border-4 border-ink bg-white px-4 py-4 focus:ring-0 outline-none font-black text-ink uppercase tracking-widest"
                        placeholder="TỪ KHÓA..."
                     />
                     <div className="flex gap-4 mt-2">
                        <button 
                            type="button"
                            onClick={() => setShowKeywordModal(false)}
                            className="flex-1 bg-gray-200 border-2 border-ink text-ink font-bold py-3 uppercase"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-vnRed border-2 border-ink text-white font-bold py-3 uppercase hover:bg-[#b91c15]"
                        >
                            Gửi đi
                        </button>
                     </div>
                 </form>
             </div>
         </div>
       )}

       {/* FINAL RESULT OVERLAY */}
       {isFinished && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95">
             <div className="text-center bg-paper p-10 border-4 border-double border-vnRed max-w-2xl w-full shadow-2xl">
                 <h2 className="text-4xl md:text-5xl font-black font-serif text-vnRed mb-6 uppercase tracking-wider border-b-2 border-ink pb-4">
                    {resultMessage}
                 </h2>
                 <div className="mb-6">
                     <p className="text-sepia text-sm uppercase font-bold tracking-widest mb-2">Tổng kết điểm số</p>
                     <p className="text-7xl font-black text-ink font-serif">{currentScore}</p>
                 </div>
                 <p className="text-ink font-bold animate-pulse">Đang chuyển về Bảng Vàng...</p>
             </div>
         </div>
       )}
    </div>
  );
};

export default GameScreenStage3;
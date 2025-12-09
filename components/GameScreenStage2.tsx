import React, { useState, useEffect, useRef } from 'react';
import { MATCHING_PACKS } from '../constants';
import { MatchPack, MatchPair } from '../types';

interface GameScreenStage2Props {
  onFinish: (score: number, timeSeconds: number) => void;
  onExit: () => void;
  initialScore: number;
  initialTime: number;
}

interface ScoreFeedback {
  id: number;
  value: number;
  x: number;
  y: number;
}

const GameScreenStage2: React.FC<GameScreenStage2Props> = ({ onFinish, onExit, initialScore, initialTime }) => {
  const [gamePacks, setGamePacks] = useState<MatchPack[]>([]);
  const [packIndex, setPackIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(initialScore);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  
  // Game State
  const [leftSelected, setLeftSelected] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{left: number, right: number} | null>(null);
  const [scoreFeedbacks, setScoreFeedbacks] = useState<ScoreFeedback[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalBonus, setFinalBonus] = useState(0);
  const [bonusLabel, setBonusLabel] = useState("");
  
  // Shuffled Right Items
  const [rightItems, setRightItems] = useState<MatchPair[]>([]);

  // Refs for Line Drawing
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [lines, setLines] = useState<{x1: number, y1: number, x2: number, y2: number, id: number}[]>([]);

  // Timer Interval Ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Random Game (10 pairs -> 2 rounds of 5)
  useEffect(() => {
    // 1. Flatten all pairs from all packs
    const allPairs: MatchPair[] = MATCHING_PACKS.flatMap(p => p.pairs);
    
    // 2. Shuffle
    const shuffledAll = [...allPairs].sort(() => Math.random() - 0.5);
    
    // 3. Take 10 pairs
    const selectedPairs = shuffledAll.slice(0, 10);

    // 4. Chunk into 2 packs of 5, remapping IDs to 1-5 for UI logic
    const packs: MatchPack[] = [];
    for (let i = 0; i < 2; i++) {
        const chunk = selectedPairs.slice(i * 5, (i + 1) * 5).map((p, idx) => ({
            ...p,
            id: idx + 1 // Remap ID to 1-5 so local view logic (refs, matching) works simply
        }));
        
        packs.push({
            id: i,
            title: `Vòng ${i + 1} / 2`,
            description: "Ghép nối sự kiện lịch sử",
            pairs: chunk
        });
    }
    setGamePacks(packs);
  }, []);

  const currentPack = gamePacks[packIndex];

  // Timer Logic
  useEffect(() => {
    if (gamePacks.length === 0 || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Time is up! Finish game with current score
          onFinish(currentScore, initialTime + 120); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePacks, isFinished]); // Add isFinished dependency

  // Initialize Pack & Shuffle Items whenever pack changes
  useEffect(() => {
    if (!currentPack) return;
    const shuffled = [...currentPack.pairs].sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
    setLeftSelected(null);
    setMatchedIds([]);
    setLines([]);
    setWrongPair(null);
  }, [packIndex, currentPack]);

  // Update Line Positions
  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const newLines = matchedIds.map(id => {
        const leftEl = itemRefs.current[`left-${id}`];
        const rightEl = itemRefs.current[`right-${id}`];
        
        if (leftEl && rightEl) {
          const leftRect = leftEl.getBoundingClientRect();
          const rightRect = rightEl.getBoundingClientRect();

          return {
            id,
            x1: leftRect.right - containerRect.left,
            y1: leftRect.top + leftRect.height / 2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height / 2 - containerRect.top
          };
        }
        return null;
      }).filter(Boolean) as {x1: number, y1: number, x2: number, y2: number, id: number}[];

      setLines(newLines);
    };

    const to = setTimeout(updateLines, 100);
    window.addEventListener('resize', updateLines);
    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(to);
    };
  }, [matchedIds, rightItems]);

  const triggerScoreFeedback = (value: number, x: number, y: number) => {
    const id = Date.now();
    setScoreFeedbacks(prev => [...prev, { id, value, x, y }]);
    setTimeout(() => {
      setScoreFeedbacks(prev => prev.filter(item => item.id !== id));
    }, 1000);
  };

  const handleLeftClick = (id: number) => {
    if (matchedIds.includes(id) || wrongPair || isFinished) return;
    setLeftSelected(id);
  };

  const handleRightClick = (id: number, e: React.MouseEvent) => {
    if (matchedIds.includes(id) || wrongPair || isFinished) return;
    
    if (leftSelected === null) return;

    if (leftSelected === id) {
      // Correct Match
      const newScore = currentScore + 20; // 20 points per match
      setCurrentScore(newScore);
      setMatchedIds(prev => [...prev, id]);
      setLeftSelected(null);
      
      triggerScoreFeedback(20, e.clientX, e.clientY);

      // Check Round Complete
      if (matchedIds.length + 1 === currentPack.pairs.length) {
         setTimeout(() => {
           if (packIndex < gamePacks.length - 1) {
             setPackIndex(prev => prev + 1);
           } else {
             // Game Finished Logic
             finishGame(newScore);
           }
         }, 800);
      }
    } else {
      // Wrong Match
      setWrongPair({ left: leftSelected, right: id });
      
      // Penalty Logic: Deduct 5 points
      setCurrentScore(prev => Math.max(0, prev - 5)); 
      
      triggerScoreFeedback(-5, e.clientX, e.clientY);

      setTimeout(() => {
        setWrongPair(null);
        setLeftSelected(null);
      }, 800);
    }
  };

  const finishGame = (finalBaseScore: number) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // CALCULATE TIERED BONUS
    let bonus = 0;
    let label = "";

    if (timeLeft > 60) {
        bonus = 150;
        label = "Xuất sắc! (>60s)";
    } else if (timeLeft > 30) {
        bonus = 100;
        label = "Rất tốt! (>30s)";
    } else {
        bonus = 50;
        label = "Hoàn thành";
    }

    setFinalBonus(bonus);
    setBonusLabel(label);

    // Wait for animation, then call onFinish
    setTimeout(() => {
      const finalScore = finalBaseScore + bonus;
      const timeTaken = 120 - timeLeft;
      onFinish(finalScore, initialTime + timeTaken);
    }, 4500); // 4.5 seconds delay to show the animation
  };

  if (gamePacks.length === 0 || !currentPack) {
    return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center text-vnRed font-bold">Đang tải dữ liệu...</div>;
  }

  // Formatting Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col overflow-hidden relative">
       {/* Decorative Background */}
       <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#b45309 0.5px, transparent 0.5px)', 
              backgroundSize: '24px 24px' 
            }}>
       </div>

       {/* FINISH OVERLAY */}
       {isFinished && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden animate-zoom-in">
               {/* Confetti / Ray Effect */}
               <div className="absolute inset-0 bg-yellow-50 opacity-50 z-0"></div>
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-60"></div>

               <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4 animate-bounce">🏆</div>
                  <h2 className="text-3xl font-extrabold text-vnRed uppercase tracking-wide mb-6">Hoàn Thành Màn 2</h2>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2">
                        <span className="font-bold">Điểm cơ bản</span>
                        <span className="font-mono text-xl">{currentScore}</span>
                     </div>
                     
                     <div className="flex justify-between items-center text-blue-600 border-b border-blue-50 pb-2">
                         <div className="flex flex-col text-left">
                            <span className="font-bold">Thưởng thời gian</span>
                            <span className="text-xs text-blue-400">({bonusLabel})</span>
                         </div>
                         <span className="font-mono text-xl font-bold">+{finalBonus}</span>
                     </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-2">
                     <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Tổng điểm hiện tại</p>
                     <p className="text-5xl font-black text-vnRed animate-pulse-slow">
                        {currentScore + finalBonus}
                     </p>
                  </div>
                  
                  <p className="text-green-600 text-sm font-bold mt-4 flex items-center justify-center gap-2 animate-pulse">
                    Đến Màn 3: Về Đích...
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </p>
               </div>
            </div>
         </div>
       )}

       {/* Score Feedbacks Layer */}
       {scoreFeedbacks.map(fb => (
         <div
           key={fb.id}
           className={`fixed z-50 pointer-events-none font-black text-2xl drop-shadow-md ${fb.value > 0 ? 'text-green-600 animate-float-up' : 'text-red-600 animate-drop-down'}`}
           style={{ left: fb.x, top: fb.y }}
         >
           {fb.value > 0 ? '+' : ''}{fb.value}
         </div>
       ))}

       {/* Header */}
       <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-200 p-4 flex justify-between items-center z-30 relative sticky top-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-amber-900 uppercase flex items-center gap-2 tracking-wide">
              {currentPack.title}
            </h2>
            <p className="text-sm text-amber-700/60 font-medium hidden sm:block">{currentPack.description}</p>
          </div>
          
          {/* Timer Display */}
          <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 rounded-full border-2 ${timeLeft < 30 ? 'bg-red-50 border-red-500 animate-pulse' : 'bg-white border-amber-200 shadow-inner'}`}>
              <span className="text-xl">⏳</span>
              <span className={`text-3xl font-black font-mono leading-none ${timeLeft < 30 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right bg-red-50 px-4 py-1 rounded-lg border border-red-100 transition-all duration-300 transform hover:scale-105">
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Điểm số</p>
                <p className="text-2xl font-black text-vnRed">{currentScore}</p>
             </div>
             <button onClick={onExit} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="w-full bg-amber-100 h-2 z-20">
          <div 
            className="bg-gradient-to-r from-vnRed to-orange-500 h-2 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(218,37,29,0.5)]" 
            style={{ width: `${((packIndex * 5 + matchedIds.length) / 10) * 100}%` }}
          ></div>
       </div>

       {/* Game Area */}
       <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10" ref={containerRef}>
          {/* SVG Overlay for Lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
            {lines.map(line => (
              <line 
                key={line.id}
                x1={line.x1} 
                y1={line.y1} 
                x2={line.x2} 
                y2={line.y2} 
                stroke="#16a34a" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="10"
                className="animate-draw-line drop-shadow-md opacity-80"
              />
            ))}
          </svg>
          
          <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 md:gap-32 relative z-20 pb-10">
             
             {/* Left Column (Question/Subject) */}
             <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-2 justify-center opacity-60">
                    <span className="h-px bg-amber-800 w-12"></span>
                    <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">Cột A</h3>
                    <span className="h-px bg-amber-800 w-12"></span>
                </div>
                {currentPack.pairs.map(pair => {
                   const isMatched = matchedIds.includes(pair.id);
                   const isSelected = leftSelected === pair.id;
                   const isWrong = wrongPair?.left === pair.id;

                   return (
                     <div
                        key={pair.id}
                        ref={el => { itemRefs.current[`left-${pair.id}`] = el }}
                        onClick={() => handleLeftClick(pair.id)}
                        className={`
                          group relative pl-6 pr-4 py-6 rounded-r-lg rounded-l-sm border-l-4 cursor-pointer transition-all duration-200 select-none
                          flex items-center shadow-[4px_4px_0px_rgba(0,0,0,0.05)] min-h-[90px]
                          ${isMatched 
                             ? 'bg-emerald-50 border-emerald-500 text-emerald-900 opacity-60 grayscale-[50%]' 
                             : isSelected 
                               ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.3)] translate-x-2' 
                               : isWrong
                                 ? 'bg-red-50 border-red-500 text-red-900 animate-shake'
                                 : 'bg-white border-amber-300 hover:bg-amber-50 hover:border-amber-500 text-gray-800'
                          }
                        `}
                     >
                        <span className={`font-serif font-bold text-sm md:text-lg leading-snug ${isMatched ? 'line-through decoration-emerald-500/50' : ''}`}>
                            {pair.leftContent}
                        </span>
                        
                        {/* Connector Pin (Left) */}
                        <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 shadow-sm z-30 transition-colors
                            ${isMatched ? 'bg-emerald-500 border-white' : isSelected ? 'bg-blue-600 border-white scale-125' : 'bg-gray-300 border-white group-hover:bg-amber-400'}
                        `}></div>
                     </div>
                   )
                })}
             </div>

             {/* Right Column (Answer/Object) */}
             <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-2 justify-center opacity-60">
                    <span className="h-px bg-amber-800 w-12"></span>
                    <h3 className="font-bold text-amber-900 uppercase tracking-widest text-xs">Cột B</h3>
                    <span className="h-px bg-amber-800 w-12"></span>
                </div>
                {rightItems.map(pair => {
                   const isMatched = matchedIds.includes(pair.id);
                   const isWrong = wrongPair?.right === pair.id;
                   const canSelect = leftSelected !== null && !isMatched;
                   
                   return (
                     <div
                        key={pair.id}
                        ref={el => { itemRefs.current[`right-${pair.id}`] = el }}
                        onClick={(e) => handleRightClick(pair.id, e)}
                        className={`
                          group relative pr-6 pl-8 py-6 rounded-l-lg rounded-r-sm border-r-4 transition-all duration-200 select-none
                          flex items-center justify-end text-right shadow-[4px_4px_0px_rgba(0,0,0,0.05)] min-h-[90px]
                          ${isMatched 
                             ? 'bg-emerald-50 border-emerald-500 text-emerald-900 opacity-60 grayscale-[50%]' 
                             : isWrong
                               ? 'bg-red-50 border-red-500 text-red-900 animate-shake'
                               : canSelect 
                                 ? 'bg-white border-amber-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer text-gray-700'
                                 : 'bg-white border-gray-200 text-gray-500 cursor-default'
                          }
                        `}
                     >
                        {/* Connector Pin (Right) */}
                        <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 shadow-sm z-30 transition-colors
                            ${isMatched ? 'bg-emerald-500 border-white' : canSelect ? 'bg-gray-300 border-white group-hover:bg-blue-400' : 'bg-gray-200 border-white'}
                        `}></div>
                        
                        <span className={`font-medium text-sm md:text-base leading-snug ${isMatched ? 'line-through decoration-emerald-500/50' : ''}`}>
                            {pair.rightContent}
                        </span>
                     </div>
                   )
                })}
             </div>

          </div>
       </div>

       <style>{`
          @keyframes draw-line {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }
          .animate-draw-line {
            animation: draw-line 0.6s ease-out forwards;
          }
          @keyframes shake {
             0%, 100% { transform: translateX(0); }
             20% { transform: translateX(-8px) rotate(-1deg); }
             40% { transform: translateX(8px) rotate(1deg); }
             60% { transform: translateX(-4px); }
             80% { transform: translateX(4px); }
          }
          .animate-shake {
             animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes float-up {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
          }
          .animate-float-up {
            animation: float-up 0.8s ease-out forwards;
          }
          @keyframes drop-down {
            0% { transform: translateY(0); opacity: 1; }
            20% { transform: translateY(-5px); }
            100% { transform: translateY(20px); opacity: 0; }
          }
          .animate-drop-down {
            animation: drop-down 0.8s ease-in forwards;
          }
          @keyframes fade-in {
             from { opacity: 0; }
             to { opacity: 1; }
          }
          .animate-fade-in {
             animation: fade-in 0.3s ease-out forwards;
          }
          @keyframes zoom-in {
             from { transform: scale(0.8); opacity: 0; }
             to { transform: scale(1); opacity: 1; }
          }
          .animate-zoom-in {
             animation: zoom-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          @keyframes pulse-slow {
             0%, 100% { transform: scale(1); }
             50% { transform: scale(1.05); }
          }
          .animate-pulse-slow {
             animation: pulse-slow 2s infinite ease-in-out;
          }
       `}</style>
    </div>
  );
};

export default GameScreenStage2;
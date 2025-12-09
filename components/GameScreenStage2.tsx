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
  const [timeLeft, setTimeLeft] = useState(120); 
  
  const [leftSelected, setLeftSelected] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{left: number, right: number} | null>(null);
  const [scoreFeedbacks, setScoreFeedbacks] = useState<ScoreFeedback[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalBonus, setFinalBonus] = useState(0);
  const [bonusLabel, setBonusLabel] = useState("");
  
  const [rightItems, setRightItems] = useState<MatchPair[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [lines, setLines] = useState<{x1: number, y1: number, x2: number, y2: number, id: number}[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const allPairs: MatchPair[] = MATCHING_PACKS.flatMap(p => p.pairs);
    const shuffledAll = [...allPairs].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledAll.slice(0, 10);
    const packs: MatchPack[] = [];
    for (let i = 0; i < 2; i++) {
        const chunk = selectedPairs.slice(i * 5, (i + 1) * 5).map((p, idx) => ({
            ...p,
            id: idx + 1 
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

  useEffect(() => {
    if (gamePacks.length === 0 || isFinished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onFinish(currentScore, initialTime + 120); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePacks, isFinished, onFinish, currentScore, initialTime]);

  useEffect(() => {
    if (!currentPack) return;
    const shuffled = [...currentPack.pairs].sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
    setLeftSelected(null);
    setMatchedIds([]);
    setLines([]);
    setWrongPair(null);
  }, [packIndex, currentPack]);

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
          // Coordinates relative to the container content
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
    
    // Add Scroll Listener to update lines when scrolling on mobile
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateLines);
    }

    return () => {
      window.removeEventListener('resize', updateLines);
      if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', updateLines);
      }
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
      const newScore = currentScore + 20;
      setCurrentScore(newScore);
      setMatchedIds(prev => [...prev, id]);
      setLeftSelected(null);
      triggerScoreFeedback(20, e.clientX, e.clientY);
      if (matchedIds.length + 1 === currentPack.pairs.length) {
         setTimeout(() => {
           if (packIndex < gamePacks.length - 1) {
             setPackIndex(prev => prev + 1);
           } else {
             finishGame(newScore);
           }
         }, 800);
      }
    } else {
      setWrongPair({ left: leftSelected, right: id });
      setCurrentScore(prev => Math.max(0, prev - 2)); 
      triggerScoreFeedback(-2, e.clientX, e.clientY);
      setTimeout(() => {
        setWrongPair(null);
        setLeftSelected(null);
      }, 800);
    }
  };

  const finishGame = (finalBaseScore: number) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    let bonus = 0;
    let label = "";
    if (timeLeft > 60) { bonus = 150; label = "Xuất sắc!"; } 
    else if (timeLeft > 30) { bonus = 100; label = "Rất tốt!"; } 
    else { bonus = 50; label = "Hoàn thành"; }
    setFinalBonus(bonus);
    setBonusLabel(label);
    setTimeout(() => {
      const finalScore = finalBaseScore + bonus;
      const timeTaken = 120 - timeLeft;
      onFinish(finalScore, initialTime + timeTaken);
    }, 4500); 
  };

  if (gamePacks.length === 0 || !currentPack) {
    return <div className="min-h-screen bg-paper flex items-center justify-center text-ink font-serif">Đang tải hồ sơ...</div>;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
       
       {/* Finish Overlay */}
       {isFinished && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90">
            <div className="bg-paper border-4 border-double border-vnRed p-8 max-w-md w-full text-center shadow-2xl relative mx-4">
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-vnRed"></div>
               <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-vnRed"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-vnRed"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-vnRed"></div>

               <h2 className="text-2xl md:text-3xl font-black font-serif text-ink uppercase tracking-wider mb-6 border-b-2 border-ink pb-2">Nhiệm Vụ Hoàn Tất</h2>
               
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sepia border-b border-sepia/20 pb-2">
                     <span className="font-bold">Điểm cơ bản</span>
                     <span className="font-serif text-xl">{currentScore}</span>
                  </div>
                  <div className="flex justify-between items-center text-vnRed font-bold">
                      <span className="uppercase text-sm">Thưởng: {bonusLabel}</span>
                      <span className="font-serif text-xl">+{finalBonus}</span>
                  </div>
               </div>

               <div className="bg-ink text-paper p-4 border border-paper shadow-sm mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Tổng điểm hiện tại</p>
                  <p className="text-5xl font-black font-serif">
                     {currentScore + finalBonus}
                  </p>
               </div>
               <p className="text-sepia text-sm font-bold animate-pulse">Đang chuyển sang Màn 3...</p>
            </div>
         </div>
       )}

       {/* Score Feedback */}
       {scoreFeedbacks.map(fb => (
         <div
           key={fb.id}
           className={`fixed z-[99999] pointer-events-none font-black text-3xl font-serif ${fb.value > 0 ? 'text-green-800' : 'text-vnRed'}`}
           style={{ left: fb.x, top: fb.y }}
         >
           {fb.value > 0 ? '+' : ''}{fb.value}
         </div>
       ))}

       {/* Header */}
       <div className="bg-[#fdfbf7] border-b-4 border-double border-ink p-3 md:p-4 flex justify-between items-center z-30 sticky top-0 shadow-sm shrink-0">
          <div>
            <h2 className="text-sm md:text-xl font-bold font-serif text-ink uppercase tracking-wide border-b border-vnRed inline-block">
              {currentPack.title}
            </h2>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 border-2 border-ink bg-paper">
              <span className={`text-xl md:text-3xl font-bold font-mono leading-none ${timeLeft < 30 ? 'text-vnRed' : 'text-ink'}`}>
                {formatTime(timeLeft)}
              </span>
          </div>

          <div className="text-right">
             <p className="text-[10px] text-sepia uppercase font-bold tracking-widest">Điểm</p>
             <p className="text-xl md:text-2xl font-black text-vnRed font-serif">{currentScore}</p>
          </div>
       </div>

       {/* Game Board */}
       <div className="flex-1 overflow-y-auto p-2 md:p-4 relative z-10">
          <div className="max-w-5xl mx-auto relative min-h-full" ref={containerRef}>
             {/* SVG Connector Lines */}
             <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
               {lines.map(line => (
                 <line 
                   key={line.id}
                   x1={line.x1} 
                   y1={line.y1} 
                   x2={line.x2} 
                   y2={line.y2} 
                   stroke="#b91c15" 
                   strokeWidth="3" 
                   className="opacity-80"
                 />
               ))}
             </svg>
             
             <div className="grid grid-cols-2 gap-4 md:gap-24 relative z-20 pb-10">
                {/* Left Column */}
                <div className="flex flex-col gap-3 md:gap-6">
                   <div className="text-center mb-1">
                       <span className="bg-ink text-paper px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest">Dữ kiện A</span>
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
                             relative p-2 md:p-4 border-2 cursor-pointer transition-all duration-100 select-none min-h-[60px] md:min-h-[80px] flex items-center
                             ${isMatched 
                                ? 'bg-gray-200 border-gray-400 text-gray-400' 
                                : isSelected 
                                  ? 'bg-white border-vnRed text-ink shadow-retro translate-x-2' 
                                  : isWrong
                                    ? 'bg-red-100 border-red-500 text-red-900 animate-shake'
                                    : 'bg-white border-ink text-ink hover:bg-paper'
                             }
                           `}
                        >
                           <span className={`font-serif font-bold text-xs md:text-lg leading-snug ${isMatched ? 'line-through decoration-2' : ''}`}>
                               {pair.leftContent}
                           </span>
                           
                           {/* Dot */}
                           <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-ink z-30
                               ${isMatched ? 'bg-gray-400' : isSelected ? 'bg-vnRed' : 'bg-paper'}
                           `}></div>
                        </div>
                      )
                   })}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3 md:gap-6">
                   <div className="text-center mb-1">
                       <span className="bg-ink text-paper px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest">Dữ kiện B</span>
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
                             relative p-2 md:p-4 border-2 flex items-center justify-end text-right min-h-[60px] md:min-h-[80px] transition-all duration-100
                             ${isMatched 
                                ? 'bg-gray-200 border-gray-400 text-gray-400' 
                                : isWrong
                                  ? 'bg-red-100 border-red-500 text-red-900 animate-shake'
                                  : canSelect 
                                    ? 'bg-white border-ink hover:border-vnRed cursor-pointer'
                                    : 'bg-white border-gray-300 text-gray-500 cursor-default'
                             }
                           `}
                        >
                           {/* Dot */}
                           <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-ink z-30
                               ${isMatched ? 'bg-gray-400' : 'bg-paper'}
                           `}></div>
                           
                           <span className={`font-sans font-medium text-xs md:text-base leading-snug ${isMatched ? 'line-through decoration-2' : ''}`}>
                               {pair.rightContent}
                           </span>
                        </div>
                      )
                   })}
                </div>
             </div>
          </div>
       </div>

       <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
       `}</style>
    </div>
  );
};

export default GameScreenStage2;
import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK } from '../constants';
import { Question } from '../types';

interface GameScreenProps {
  onFinish: (score: number, timeSeconds: number) => void;
  onExit: () => void;
}

interface ScoreFeedback {
  id: number;
  primary: number;   // Điểm cơ bản + Streak
  secondary: number; // Điểm thưởng (time bonus)
  x: number;
  y: number;
}

const QUESTION_TIMER_SECONDS = 15;

const GameScreen: React.FC<GameScreenProps> = ({ onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [streak, setStreak] = useState(0);
  const [lastBonus, setLastBonus] = useState(0);

  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [timeBonusLabel, setTimeBonusLabel] = useState<string>("");

  const [scoreFeedbacks, setScoreFeedbacks] = useState<ScoreFeedback[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // 50:50 Lifeline State
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const easy = QUESTION_BANK.filter(q => q.difficulty === 'easy');
    const medium = QUESTION_BANK.filter(q => q.difficulty === 'medium');
    const hard = QUESTION_BANK.filter(q => q.difficulty === 'hard');
    const shuffle = (array: Question[]) => array.sort(() => 0.5 - Math.random());
    const selectedQuestions = [
      ...shuffle(easy).slice(0, 4),
      ...shuffle(medium).slice(0, 3),
      ...shuffle(hard).slice(0, 3)
    ];
    setQuestions(selectedQuestions);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFinished) {
        setTotalTimeSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  useEffect(() => {
    if (questions.length === 0 || isAnswered || isFinished) return;

    setTimeLeft(QUESTION_TIMER_SECONDS);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, isAnswered, questions.length, isFinished]);

  const triggerScoreFeedback = (primary: number, secondary: number, event?: React.MouseEvent) => {
    const id = Date.now();
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;
    setScoreFeedbacks(prev => [...prev, { id, primary, secondary, x, y }]);
    setTimeout(() => {
      setScoreFeedbacks(prev => prev.filter(item => item.id !== id));
    }, 1500);
  };

  const handleTimeout = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsAnswered(true);
    setFeedback('timeout');
    setStreak(0);
    setTimeBonusLabel("");
  };

  const handleOptionSelect = (index: number, e: React.MouseEvent) => {
    // CRITICAL: Spam prevention check
    if (isAnswered || isFinished) return;
    
    // Stop timer immediately
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    // Immediate state update to lock UI
    setIsAnswered(true);
    setSelectedOption(index);

    if (index === questions[currentQuestionIndex].correctAnswer) {
      let timeBonus = 0;
      let label = "";
      if (timeLeft > 10) { timeBonus = 30; label = "Thần tốc!"; } 
      else if (timeLeft > 5) { timeBonus = 20; label = "Nhanh!"; } 
      else { timeBonus = 10; label = "Đạt"; }

      const basePoints = 10;
      const streakBonus = streak * 5; // Tính điểm chuỗi thắng (mỗi lần streak +5)
      const totalPoints = basePoints + timeBonus + streakBonus;

      setScore((prev) => prev + totalPoints);
      setStreak((prev) => prev + 1);
      setLastBonus(streakBonus);
      setFeedback('correct');
      setTimeBonusLabel(label);
      
      // Gộp điểm cơ bản và điểm streak thành một số màu xanh (primary)
      // Điểm thời gian (bonus) hiển thị màu vàng bên cạnh (secondary)
      triggerScoreFeedback(basePoints + streakBonus, timeBonus, e);
      
    } else {
      setStreak(0);
      setLastBonus(0);
      setFeedback('wrong');
      setTimeBonusLabel("");
    }
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswered || isFinished) return;

    const currentQ = questions[currentQuestionIndex];
    const correctIdx = currentQ.correctAnswer;
    
    // Find incorrect indices
    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
    
    // Shuffle and pick 2 to hide
    const toHide = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    setHiddenOptions(toHide);
    setFiftyFiftyUsed(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
      setLastBonus(0);
      setTimeBonusLabel("");
      setHiddenOptions([]); // Reset hidden options for next question
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      setTimeout(() => {
         onFinish(score, totalTimeSeconds);
      }, 3000);
    }
  };

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen bg-paper"><div className="animate-spin rounded-full h-12 w-12 border-4 border-vnRed border-t-transparent"></div></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="w-full h-screen relative flex flex-col font-sans overflow-hidden">
       {/* Feedback Popups */}
       {scoreFeedbacks.map(fb => (
         <div
           key={fb.id}
           className="fixed z-[99999] pointer-events-none flex flex-row items-end gap-2 font-black font-serif"
           style={{ left: fb.x, top: fb.y, textShadow: '2px 2px 0px #fff' }}
         >
           <span className="text-5xl text-green-700">+{fb.primary}</span>
           {fb.secondary > 0 && (
             <span className="text-4xl text-vnYellow animate-bounce">+{fb.secondary}</span>
           )}
         </div>
       ))}

       {/* Finish Overlay */}
       {isFinished && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 animate-fade-in text-paper">
            <div className="bg-paper text-ink p-8 max-w-sm w-full border-4 border-double border-vnRed relative text-center shadow-[10px_10px_0px_rgba(255,255,255,0.1)]">
               <h2 className="text-3xl font-bold font-serif uppercase tracking-widest mb-4 border-b-2 border-ink pb-2">Hoàn Thành Màn 1</h2>
               <div className="bg-[#fffdf5] border-2 border-ink p-4 mb-4">
                  <p className="text-sepia font-bold uppercase text-xs tracking-widest">Tổng điểm</p>
                  <p className="text-6xl font-black text-vnRed font-serif">{score}</p>
               </div>
               <p className="text-ink font-bold animate-pulse font-serif uppercase">Đang chuyển quân...</p>
            </div>
         </div>
       )}

      {/* Top Bar: Newspaper Header Style */}
      <div className="relative z-10 bg-[#fdfbf7] border-b-4 border-double border-ink px-4 py-3 flex justify-between items-center h-20 shrink-0">
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-bold text-vnRed uppercase tracking-widest border border-vnRed px-1">Câu hỏi</span>
             <span className="text-3xl font-black font-serif text-ink leading-none">{currentQuestionIndex + 1}<span className="text-lg text-sepia">/{questions.length}</span></span>
          </div>

          <div className="hidden md:block text-center">
             <h1 className="text-2xl font-black font-serif text-ink uppercase tracking-widest border-b border-ink">Giải Mật Mã</h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] text-sepia uppercase font-bold tracking-widest">Điểm số</p>
                <p className="text-2xl font-black text-vnRed font-serif leading-none">{score}</p>
             </div>
             <button onClick={onExit} className="border-2 border-ink px-3 py-1 hover:bg-vnRed hover:text-white transition-colors font-bold uppercase text-xs">
                Thoát
             </button>
          </div>
      </div>

      {/* Progress Line - Flat */}
      <div className="w-full bg-gray-300 h-2 z-20 border-b border-ink">
          <div 
             className="bg-vnRed h-full transition-all duration-300 ease-linear"
             style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between relative z-10 w-full max-w-5xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)]">
         
         {/* Question Card: Clipped Article Style */}
         <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-0 relative">
            <div className="bg-[#fffdf5] border-2 border-ink w-full p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[25vh] relative shadow-retro">
               {/* Decorative corner */}
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-vnRed"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-vnRed"></div>
               
               <h3 className="text-xl md:text-3xl font-bold text-ink leading-relaxed font-serif">
                 {currentQuestion.text}
               </h3>
               
               {/* Timer Box */}
               {!isAnswered && !isFinished && (
                   <div className={`absolute -top-5 bg-ink text-paper px-4 py-1 font-mono font-bold border-2 border-paper shadow-sm ${timeLeft <= 5 ? 'text-vnRed animate-pulse' : ''}`}>
                      00:{Math.ceil(timeLeft).toString().padStart(2, '0')}
                   </div>
               )}

               {/* 50:50 Lifeline Button */}
               {!isAnswered && !isFinished && (
                  <button 
                     onClick={handleUseFiftyFifty}
                     disabled={fiftyFiftyUsed}
                     className={`
                        absolute -bottom-5 right-6
                        flex items-center gap-2 px-3 py-1 border-2 font-bold font-serif uppercase tracking-widest text-sm shadow-sm transition-all
                        ${fiftyFiftyUsed 
                           ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed line-through' 
                           : 'bg-vnYellow border-ink text-ink hover:bg-[#c29d2b] hover:-translate-y-1'
                        }
                     `}
                     title={fiftyFiftyUsed ? "Đã sử dụng quyền trợ giúp" : "Loại bỏ 2 phương án sai"}
                  >
                     <span>⛑️ Trợ giúp 50:50</span>
                  </button>
               )}
            </div>
         </div>

         {/* Options Grid: Stamped Style */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-auto md:h-[35vh]">
            {currentQuestion.options.map((option, index) => {
               // Check if option is hidden by 50:50
               const isHidden = hiddenOptions.includes(index);

               let stateClass = "bg-[#fffdf5] border-2 border-ink text-ink hover:bg-sepia/10";
               let badgeClass = "bg-ink text-paper";
               
               if (isHidden) {
                  stateClass = "opacity-0 pointer-events-none invisible"; // Completely hide
               } else if (isAnswered) {
                 if (index === currentQuestion.correctAnswer) {
                   stateClass = "bg-[#e6fffa] border-2 border-green-700 text-green-900 shadow-[inset_0_0_0_2px_#047857]"; 
                   badgeClass = "bg-green-700 text-white";
                 } else if (index === selectedOption) {
                    stateClass = "bg-[#fff5f5] border-2 border-vnRed text-vnRed opacity-90";
                    badgeClass = "bg-vnRed text-white";
                 } else {
                    stateClass = "bg-gray-100 border-gray-300 text-gray-400 opacity-60 cursor-not-allowed";
                    badgeClass = "bg-gray-400 text-white";
                 }
               }

               return (
                 <button
                   key={index}
                   onClick={(e) => handleOptionSelect(index, e)}
                   disabled={isAnswered || isFinished || isHidden}
                   className={`
                     relative w-full rounded-sm transition-transform duration-100 
                     flex items-center p-4 text-left group
                     ${stateClass} active:translate-y-1 active:shadow-none
                     ${!isAnswered && !isHidden && 'shadow-retro-sm'}
                   `}
                 >
                    {/* A,B,C,D Box */}
                    <div className={`w-8 h-8 border border-black flex items-center justify-center font-bold font-serif text-lg mr-4 shrink-0 ${badgeClass}`}>
                       {String.fromCharCode(65 + index)}
                    </div>

                    <div className="flex-1">
                       <span className="font-medium text-lg font-sans leading-snug">
                         {option}
                       </span>
                    </div>
                 </button>
               )
            })}
         </div>

         {/* Explanation / Next Area */}
         <div className="min-h-[100px] flex items-end justify-center mt-4">
             {isAnswered && !isFinished && (
               <div className="w-full bg-[#fffdf5] border-2 border-ink p-4 flex flex-col md:flex-row gap-4 items-center animate-fade-in shadow-retro">
                  <div className="flex-1 text-left border-l-4 border-vnRed pl-4">
                     <div className="flex items-center gap-2 mb-1">
                         <span className={`text-xl font-bold font-serif uppercase ${feedback === 'correct' ? 'text-green-700' : 'text-vnRed'}`}>
                            {feedback === 'correct' ? 'CHÍNH XÁC' : feedback === 'timeout' ? 'HẾT GIỜ' : 'SAI RỒI'}
                         </span>
                     </div>
                     {/* Explanation Text */}
                     {currentQuestion.explanation && (
                         <p className="text-sm text-sepia italic border-t border-gray-300 pt-1 mt-1">
                             <span className="font-bold not-italic mr-1">Giải thích:</span> 
                             {currentQuestion.explanation}
                         </p>
                     )}
                     {feedback !== 'correct' && (
                        <p className="text-sm mt-1">
                           Đáp án đúng: <span className="font-bold text-green-700">{String.fromCharCode(65 + currentQuestion.correctAnswer)}</span>
                        </p>
                     )}
                  </div>
                  <button
                    onClick={handleNext}
                    className="bg-vnRed hover:bg-[#b91c15] text-white px-8 py-3 font-bold font-serif uppercase tracking-widest border-2 border-transparent hover:border-ink shadow-sm transition-all whitespace-nowrap"
                  >
                    Tiếp theo →
                  </button>
               </div>
             )}
         </div>

      </div>
      
      <style>{`
         .animate-fade-in { animation: fadeIn 0.3s ease-out; }
         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default GameScreen;
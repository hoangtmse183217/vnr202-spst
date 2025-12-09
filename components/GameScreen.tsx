import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANK } from '../constants';
import { Question } from '../types';

interface GameScreenProps {
  onFinish: (score: number, timeSeconds: number) => void;
  onExit: () => void;
}

interface ScoreFeedback {
  id: number;
  value: number;
  label?: string; // Add label for feedback (e.g. "Thần tốc!")
  isBonus?: boolean;
  x: number;
  y: number;
}

const QUESTION_TIMER_SECONDS = 15;

const GameScreen: React.FC<GameScreenProps> = ({ onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Streak State
  const [streak, setStreak] = useState(0);
  const [lastBonus, setLastBonus] = useState(0);

  // Timers
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [timeBonusLabel, setTimeBonusLabel] = useState<string>("");

  // Effects
  const [scoreFeedbacks, setScoreFeedbacks] = useState<ScoreFeedback[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Game
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

  // Total Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFinished) {
        setTotalTimeSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Question Timer
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

  const triggerScoreFeedback = (value: number, isBonus: boolean, label: string = "", event?: React.MouseEvent) => {
    const id = Date.now();
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    setScoreFeedbacks(prev => [...prev, { id, value, isBonus, label, x, y }]);
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
    if (isAnswered || isFinished) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestionIndex].correctAnswer) {
      // SCORING LOGIC WITH 3 TIERS
      let timeBonus = 0;
      let label = "";

      if (timeLeft > 10) {
          timeBonus = 30;
          label = "Thần tốc!";
      } else if (timeLeft > 5) {
          timeBonus = 20;
          label = "Nhanh!";
      } else {
          timeBonus = 10;
          label = "Đạt";
      }

      const basePoints = 10;
      const streakBonus = streak * 5; // Streak bonus
      const totalPoints = basePoints + timeBonus + streakBonus;

      setScore((prev) => prev + totalPoints);
      setStreak((prev) => prev + 1);
      setLastBonus(streakBonus);
      setFeedback('correct');
      setTimeBonusLabel(label);

      // Trigger visual feedback
      // 1. Base + Time
      triggerScoreFeedback(basePoints + timeBonus, false, label, e);
      
      // 2. Streak (delayed slightly)
      if (streakBonus > 0) {
        setTimeout(() => triggerScoreFeedback(streakBonus, true, "Chuỗi thắng", e), 300);
      }

    } else {
      setStreak(0);
      setLastBonus(0);
      setFeedback('wrong');
      setTimeBonusLabel("");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
      setLastBonus(0);
      setTimeBonusLabel("");
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      setTimeout(() => {
         onFinish(score, totalTimeSeconds);
      }, 4000);
    }
  };

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen bg-[#fdfbf7]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vnRed"></div></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="w-full h-screen bg-[#fdfbf7] relative overflow-hidden flex flex-col font-sans">
       {/* Background Decor */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#b45309 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
       </div>

       {/* Floating Feedback */}
       {scoreFeedbacks.map(fb => (
         <div
           key={fb.id}
           className={`fixed z-[100] pointer-events-none flex flex-col items-center justify-center font-black drop-shadow-md animate-float-up ${fb.isBonus ? 'text-orange-500' : fb.value > 0 ? 'text-green-600' : 'text-red-500'}`}
           style={{ left: fb.x, top: fb.y }}
         >
           <span className="text-5xl">{fb.value > 0 ? '+' : ''}{fb.value}</span>
           {fb.label && <span className="text-lg uppercase tracking-wider bg-white/80 px-2 rounded-md shadow-sm mt-1">{fb.label}</span>}
         </div>
       ))}

       {/* STAGE 1 FINISH OVERLAY */}
       {isFinished && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in text-gray-800">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-zoom-in-bounce text-center border-4 border-vnRed">
               <h2 className="text-3xl font-extrabold text-vnRed uppercase tracking-wide mb-2">Hoàn Thành Màn 1</h2>
               <div className="text-6xl mb-4">🎉</div>
               <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                  <p className="text-gray-500 font-bold uppercase text-xs">Tổng điểm</p>
                  <p className="text-5xl font-black text-vnRed">{score}</p>
               </div>
               <p className="text-gray-600 font-bold animate-pulse">Đang chuyển sang Màn 2...</p>
            </div>
         </div>
       )}

      {/* TOP HEADER - Matches Stage 2 Style */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-4 py-2 flex justify-between items-center h-16 shrink-0">
          {/* Question Count */}
          <div className="flex flex-col items-center bg-gray-100 rounded-lg px-3 py-1">
             <span className="text-xs font-bold text-gray-500 uppercase">Câu hỏi</span>
             <span className="text-xl font-black text-gray-800 leading-none">{currentQuestionIndex + 1}<span className="text-gray-400 text-sm">/{questions.length}</span></span>
          </div>

          {/* Title */}
          <div className="hidden md:block text-vnRed font-black text-xl uppercase tracking-wider">
             Giải Mật Mã
          </div>

          {/* Score & Exit */}
          <div className="flex items-center gap-3">
             <div className="text-right bg-red-50 px-4 py-1 rounded-lg border border-red-100 transition-all duration-300">
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Điểm số</p>
                <p className="text-xl font-black text-vnRed leading-none">{score}</p>
             </div>
             <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-gray-200 h-1 z-20">
          <div 
             className="bg-vnRed h-full transition-all duration-300 ease-out"
             style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-between relative z-10 w-full max-w-5xl mx-auto p-4 md:p-6 h-[calc(100vh-68px)]">
         
         {/* Question Section */}
         <div className="flex-1 flex flex-col items-center justify-center mb-6 min-h-0 relative">
            {/* White Card for Question */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full p-6 md:p-10 text-center flex items-center justify-center min-h-[20vh] relative animate-fade-in-up">
               <h3 className="text-xl md:text-3xl font-bold text-gray-800 leading-relaxed font-serif">
                 {currentQuestion.text}
               </h3>
               
               {/* Timer Circle - Clean Style */}
               {!isAnswered && !isFinished && (
                   <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 font-black text-xl z-20 bg-white transition-colors duration-300 ${timeLeft <= 5 ? 'border-red-500 text-red-600 animate-pulse' : 'border-gray-100 text-gray-700'}`}>
                      {Math.ceil(timeLeft)}
                   </div>
               )}
            </div>

            {/* Streak Indicator */}
            {streak > 1 && (
               <div className="absolute -bottom-4 bg-orange-100 text-orange-600 border border-orange-200 px-4 py-1 rounded-full font-bold shadow-sm animate-bounce flex items-center gap-2 text-sm z-10">
                 <span>🔥</span> Chuỗi thắng: {streak}
               </div>
            )}
         </div>

         {/* Options Grid - Elegant Style (Not Kahoot) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[40vh] md:h-[35vh]">
            {currentQuestion.options.map((option, index) => {
               let stateClass = "bg-white border-2 border-gray-100 text-gray-700 hover:border-vnRed hover:bg-red-50/30";
               let badgeClass = "bg-gray-100 text-gray-500";
               
               if (isAnswered) {
                 if (index === currentQuestion.correctAnswer) {
                   stateClass = "bg-green-50 border-green-500 text-green-900 shadow-md ring-1 ring-green-500"; 
                   badgeClass = "bg-green-600 text-white";
                 } else if (index === selectedOption) {
                    stateClass = "bg-red-50 border-red-500 text-red-900 opacity-90";
                    badgeClass = "bg-red-600 text-white";
                 } else {
                    stateClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50 grayscale";
                    badgeClass = "bg-gray-200 text-gray-400";
                 }
               }

               return (
                 <button
                   key={index}
                   onClick={(e) => handleOptionSelect(index, e)}
                   disabled={isAnswered || isFinished}
                   className={`
                     relative w-full h-full rounded-xl transition-all duration-200 
                     flex items-center p-4 md:p-6 text-left group
                     ${stateClass} active:scale-[0.99]
                   `}
                 >
                    {/* A,B,C,D Badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 shrink-0 transition-colors ${badgeClass}`}>
                       {String.fromCharCode(65 + index)}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                       <span className="font-medium text-lg md:text-xl leading-snug">
                         {option}
                       </span>
                    </div>

                    {/* Result Icon */}
                    {isAnswered && (
                       <div className="ml-2">
                          {index === currentQuestion.correctAnswer ? (
                            <svg className="w-8 h-8 text-green-600 animate-bounce-small" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                             index === selectedOption && <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                       </div>
                    )}
                 </button>
               )
            })}
         </div>

         {/* Bottom Feedback Area */}
         <div className="h-20 flex items-center justify-center mt-2 relative">
             {isAnswered && !isFinished && (
               <div className="w-full flex justify-between items-center bg-white p-3 rounded-xl shadow-lg border border-gray-200 animate-slide-in-bottom">
                  <div className="flex-1 pl-2">
                     <div className="flex items-center gap-2">
                         <p className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback === 'correct' ? 'Chính xác! 🎉' : feedback === 'timeout' ? 'Hết giờ! ⏰' : 'Sai rồi! 😢'}
                         </p>
                         {timeBonusLabel && feedback === 'correct' && (
                             <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded border border-yellow-200 font-bold uppercase">{timeBonusLabel}</span>
                         )}
                     </div>
                     {feedback !== 'correct' && (
                        <p className="text-sm text-gray-600 mt-0.5">
                           Đáp án đúng: <span className="font-bold text-green-700">{String.fromCharCode(65 + currentQuestion.correctAnswer)}</span>
                        </p>
                     )}
                  </div>
                  <button
                    onClick={handleNext}
                    className="bg-vnRed hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-transform hover:scale-105 active:scale-95 text-base flex items-center gap-2"
                  >
                    Tiếp theo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </button>
               </div>
             )}
         </div>

      </div>

      <style>{`
        @keyframes float-up {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
            animation: float-up 1.5s ease-out forwards;
        }
        @keyframes zoom-in-bounce {
             0% { transform: scale(0); opacity: 0; }
             60% { transform: scale(1.1); opacity: 1; }
             100% { transform: scale(1); }
        }
        .animate-zoom-in-bounce {
            animation: zoom-in-bounce 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        @keyframes slide-in-bottom {
           from { transform: translateY(20px); opacity: 0; }
           to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-bottom {
           animation: slide-in-bottom 0.3s ease-out forwards;
        }
        .animate-bounce-small {
           animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default GameScreen;
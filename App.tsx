import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import StageIntroScreen from './components/StageIntroScreen';
import Stage2IntroScreen from './components/Stage2IntroScreen';
import Stage3IntroScreen from './components/Stage3IntroScreen';
import GameScreen from './components/GameScreen';
import GameScreenStage2 from './components/GameScreenStage2';
import GameScreenStage3 from './components/GameScreenStage3';
import ResultScreen from './components/ResultScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import { GameStage } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.WELCOME);
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const handleStart = (name: string) => {
    setPlayerName(name);
    // Transition to the intro stage first
    setStage(GameStage.STAGE_INTRO);
  };

  const handleIntroComplete = () => {
    setStage(GameStage.PLAYING);
  };

  // Handler for Stage 1 Completion
  const handleStage1Finish = (stage1Score: number, stage1Time: number) => {
    setScore(stage1Score);
    setTimeSeconds(stage1Time);
    // Direct transition to Stage 2 Intro
    setStage(GameStage.STAGE_2_INTRO);
  };

  const handleStage2IntroComplete = () => {
    setStage(GameStage.PLAYING_STAGE_2);
  };

  // Handler for Stage 2 Completion
  const handleStage2Finish = (stage2Score: number, stage2Time: number) => {
    setScore(stage2Score);
    setTimeSeconds(stage2Time);
    setStage(GameStage.STAGE_3_INTRO);
  };

  const handleStage3IntroComplete = () => {
    setStage(GameStage.PLAYING_STAGE_3);
  }

  // Handler for Stage 3 (Final) Completion
  const handleFinalFinish = (finalScore: number, finalTime: number) => {
    setScore(finalScore);
    setTimeSeconds(finalTime);
    setStage(GameStage.FINISHED);
  };

  const handleRestart = () => {
    setStage(GameStage.WELCOME);
    setPlayerName('');
    setScore(0);
    setTimeSeconds(0);
  };

  const handleViewLeaderboard = () => {
    setStage(GameStage.LEADERBOARD);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fdfbf7] overflow-hidden">
      {/* Main Content - Always Full Screen */}
      <main className="flex-1 flex flex-col h-screen relative">
        {stage === GameStage.WELCOME && (
          <WelcomeScreen 
            onStart={handleStart} 
            onViewLeaderboard={handleViewLeaderboard} 
          />
        )}
        
        {stage === GameStage.STAGE_INTRO && (
          <StageIntroScreen onComplete={handleIntroComplete} />
        )}

        {stage === GameStage.PLAYING && (
          <GameScreen 
            onFinish={handleStage1Finish} 
            onExit={handleRestart} 
          />
        )}
        
        {stage === GameStage.STAGE_2_INTRO && (
           <Stage2IntroScreen onComplete={handleStage2IntroComplete} />
        )}

        {stage === GameStage.PLAYING_STAGE_2 && (
           <GameScreenStage2 
              onFinish={handleStage2Finish}
              onExit={handleRestart}
              initialScore={score}
              initialTime={timeSeconds}
           />
        )}

        {stage === GameStage.STAGE_3_INTRO && (
           <Stage3IntroScreen onComplete={handleStage3IntroComplete} />
        )}

        {stage === GameStage.PLAYING_STAGE_3 && (
            <GameScreenStage3
                onFinish={handleFinalFinish}
                onExit={handleRestart}
                initialScore={score}
                initialTime={timeSeconds}
            />
        )}
        
        {stage === GameStage.FINISHED && (
          <ResultScreen 
            score={score} 
            timeSeconds={timeSeconds} 
            playerName={playerName} 
            onRestart={handleRestart}
          />
        )}
        
        {stage === GameStage.LEADERBOARD && (
          <LeaderboardScreen onBack={handleRestart} />
        )}
      </main>
    </div>
  );
};

export default App;
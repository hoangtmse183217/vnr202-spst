export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
  difficulty: Difficulty;
}

export interface MatchPair {
  id: number; // Unique ID for the logic pairing
  leftContent: string;
  rightContent: string;
}

export interface MatchPack {
  id: number;
  title: string;
  description: string;
  pairs: MatchPair[];
}

export interface HiddenKeywordData {
  keyword: string;
  description: string;
  questions: {
    id: number;
    question: string;
    answer: string[]; // Array of acceptable answers (for fuzzy matching)
    hint: string;
  }[];
}

export interface Player {
  id?: string;
  name: string;
  score: number;
  time_seconds: number;
  created_at?: string;
}

export enum GameStage {
  WELCOME,
  STAGE_INTRO,
  PLAYING,
  FINISHED,
  LEADERBOARD,
  STAGE_2_INTRO,
  PLAYING_STAGE_2,
  STAGE_3_INTRO,
  PLAYING_STAGE_3
}
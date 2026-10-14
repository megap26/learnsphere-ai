export type MaterialType = 'pdf' | 'slides' | 'video' | 'notes';

export interface ChunkLocation {
  page?: number;
  slide?: number;
  timestamp?: string;
  paragraph?: number;
}

export interface MaterialChunk {
  id: string;
  materialId: string;
  materialTitle: string;
  materialType: MaterialType;
  location: ChunkLocation;
  locationString: string;
  text: string;
  topic: string;
  subtopic: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  course: string;
  type: MaterialType;
  description: string;
  topics: string[];
  uploadDate: string;
  itemCountLabel: string; // e.g. "14 Pages" or "18 Slides" or "42:15 Mins"
  chunks: MaterialChunk[];
  videoUrl?: string;
  hasTranscript?: boolean;
}

export interface ConceptNode {
  id: string;
  label: string;
  course: string;
  description: string;
  prerequisites: string[];
  subtopics: string[];
  masteryTarget: string;
  chunkIds: string[];
}

export interface Citation {
  id: string;
  materialId: string;
  materialTitle: string;
  materialType: MaterialType;
  locationString: string;
  excerpt: string;
  confidenceScore: number;
}

export type ExplanationStyle = 'standard' | 'simple' | 'step-by-step' | 'worked-example';

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  citations?: Citation[];
  isRefusal?: boolean;
  outsideKnowledgeNote?: string;
  followUpQuestions?: string[];
  explanationStyle?: ExplanationStyle;
}

export type QuestionType = 'mcq' | 'numerical' | 'short_answer';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  type: QuestionType;
  topic: string;
  subtopic: string;
  difficulty: QuestionDifficulty;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  citation: Citation;
  verified: boolean;
  verificationMethod: 'deterministic_calc' | 'source_exact_match' | 'llm_dual_check';
  verificationNotes?: string;
}

export interface QuestionResponse {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSession {
  id: string;
  topic: string;
  difficulty: QuestionDifficulty | 'Adaptive';
  startedAt: number;
  completedAt?: number;
  questions: Question[];
  responses: Record<string, QuestionResponse>;
  score?: number;
  totalQuestions?: number;
}

export interface TopicMastery {
  topic: string;
  pMastery: number; // Probability of mastery (0.0 to 1.0)
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  lastPracticed: number;
  status: 'Mastered' | 'Practicing' | 'Needs Attention';
  recommendedAction: string;
  bktParams: {
    pL0: number; // Initial mastery probability
    pT: number;  // Transition probability (learning rate)
    pG: number;  // Guess probability
    pS: number;  // Slip probability
  };
}

export interface EvaluationBenchmarkItem {
  id: string;
  query: string;
  expectedSupportingChunkIds: string[];
  expectedRefusal: boolean;
  groundTruthAnswer: string;
  topic: string;
}

export interface EvaluationMetricReport {
  faithfulnessScore: number;
  answerRelevancyScore: number;
  contextPrecisionScore: number;
  contextRecallScore: number;
  citationAccuracyScore: number;
  refusalPrecisionScore: number;
  totalEvaluated: number;
  evaluationTimestamp: string;
  framework: string;
}

export interface SimulatedLearnerExperiment {
  learnerProfile: string;
  description: string;
  startingMastery: number;
  guessRate: number;
  slipRate: number;
  transitRate: number;
  sessions: {
    sessionNumber: number;
    score: number;
    masteryAfter: number;
  }[];
}

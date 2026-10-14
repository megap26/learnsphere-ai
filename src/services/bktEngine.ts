import { TopicMastery, Question, QuestionDifficulty } from '../types';

export interface BKTParameters {
  pL0: number; // Prior probability of knowing concept (default 0.30)
  pT: number;  // Probability of learning concept on an opportunity (default 0.15)
  pG: number;  // Probability of guessing correctly without mastery (default 0.20)
  pS: number;  // Probability of slipping / making mistake despite mastery (default 0.10)
}

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.30,
  pT: 0.15,
  pG: 0.20,
  pS: 0.10
};

/**
 * Standard Bayesian Knowledge Tracing Update Rule (Corbett & Anderson, 1994)
 * Calculates posterior probability of mastery after observing a student response.
 */
export function computeBKTUpdate(
  currentPL: number,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): number {
  const { pT, pG, pS } = params;
  let pLGivenObs: number;

  if (isCorrect) {
    // P(L_t | Correct) = (P(L_{t-1}) * (1 - pS)) / (P(L_{t-1}) * (1 - pS) + (1 - P(L_{t-1})) * pG)
    const numerator = currentPL * (1.0 - pS);
    const denominator = numerator + (1.0 - currentPL) * pG;
    pLGivenObs = denominator > 0 ? numerator / denominator : currentPL;
  } else {
    // P(L_t | Incorrect) = (P(L_{t-1}) * pS) / (P(L_{t-1}) * pS + (1 - P(L_{t-1})) * (1 - pG))
    const numerator = currentPL * pS;
    const denominator = numerator + (1.0 - currentPL) * (1.0 - pG);
    pLGivenObs = denominator > 0 ? numerator / denominator : currentPL;
  }

  // Next step incorporates transition probability P(T):
  // P(L_t) = P(L_t | Obs) + (1 - P(L_t | Obs)) * pT
  const nextPL = pLGivenObs + (1.0 - pLGivenObs) * pT;

  // Clamp probability between 0.01 and 0.99 for numerical stability
  return Math.min(0.99, Math.max(0.01, Number(nextPL.toFixed(4))));
}

export function updateTopicMastery(
  current: TopicMastery,
  isCorrect: boolean
): TopicMastery {
  const newPL = computeBKTUpdate(current.pMastery, isCorrect, current.bktParams);
  const totalAttempts = current.totalAttempts + 1;
  const correctAttempts = current.correctAttempts + (isCorrect ? 1 : 0);
  const accuracy = Number((correctAttempts / totalAttempts).toFixed(3));

  let status: 'Mastered' | 'Practicing' | 'Needs Attention';
  if (newPL >= 0.80) {
    status = 'Mastered';
  } else if (newPL >= 0.50) {
    status = 'Practicing';
  } else {
    status = 'Needs Attention';
  }

  const recommendedAction = generateExplainableRecommendation(newPL, status, current.topic);

  return {
    ...current,
    pMastery: newPL,
    totalAttempts,
    correctAttempts,
    accuracy,
    lastPracticed: Date.now(),
    status,
    recommendedAction
  };
}

export function generateExplainableRecommendation(
  pMastery: number,
  status: 'Mastered' | 'Practicing' | 'Needs Attention',
  topic: string
): string {
  if (pMastery < 0.45) {
    return `Priority revision required: BKT estimate is ${Math.round(pMastery * 100)}%. We recommend reviewing introductory slides and taking a targeted Easy diagnostic.`;
  } else if (pMastery < 0.80) {
    return `Active reinforcement: BKT estimate is ${Math.round(pMastery * 100)}%. Step up to Medium-level numerical and conceptual problems to solidify the chain rule and formulas.`;
  } else {
    return `High mastery achieved: BKT estimate is ${Math.round(pMastery * 100)}%. Challenge yourself with Hard multi-step synthesis and edge-case exam problems.`;
  }
}

export function selectAdaptiveQuestions(
  availableQuestions: Question[],
  masteryMap: Record<string, TopicMastery>,
  pastAttemptedIds: Set<string>,
  targetCount: number = 3
): Question[] {
  // Filter out recently attempted questions to prevent duplicate repetition
  const unattempted = availableQuestions.filter(q => !pastAttemptedIds.has(q.id));
  const pool = unattempted.length >= targetCount ? unattempted : availableQuestions;

  // Sort topics by ascending mastery (weakest first)
  const topicWeights = Object.values(masteryMap).sort((a, b) => a.pMastery - b.pMastery);

  const selected: Question[] = [];

  for (const topicRecord of topicWeights) {
    if (selected.length >= targetCount) break;

    // Determine target difficulty based on BKT probability
    let targetDifficulty: QuestionDifficulty = 'Medium';
    if (topicRecord.pMastery < 0.50) {
      targetDifficulty = 'Easy';
    } else if (topicRecord.pMastery >= 0.80) {
      targetDifficulty = 'Hard';
    }

    // Match candidate question
    const candidate = pool.find(
      q => q.topic === topicRecord.topic &&
           q.difficulty === targetDifficulty &&
           !selected.some(s => s.id === q.id)
    ) || pool.find(
      q => q.topic === topicRecord.topic &&
           !selected.some(s => s.id === q.id)
    );

    if (candidate) {
      selected.push(candidate);
    }
  }

  // Fill remaining slots if any
  for (const q of pool) {
    if (selected.length >= targetCount) break;
    if (!selected.some(s => s.id === q.id)) {
      selected.push(q);
    }
  }

  return selected;
}

export function initializeColdStartMastery(topics: string[], diagnosticAccuracy?: number): Record<string, TopicMastery> {
  const result: Record<string, TopicMastery> = {};
  const basePL = diagnosticAccuracy !== undefined ? Math.max(0.15, Math.min(0.85, diagnosticAccuracy)) : DEFAULT_BKT_PARAMS.pL0;

  for (const topic of topics) {
    result[topic] = {
      topic,
      pMastery: basePL,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
      lastPracticed: Date.now(),
      status: basePL >= 0.8 ? 'Mastered' : basePL >= 0.5 ? 'Practicing' : 'Needs Attention',
      recommendedAction: `Initial diagnostic baseline established at ${Math.round(basePL * 100)}% prior mastery.`,
      bktParams: { ...DEFAULT_BKT_PARAMS }
    };
  }

  return result;
}

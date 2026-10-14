import { describe, it, expect } from 'vitest';
import { computeBKTUpdate, DEFAULT_BKT_PARAMS, selectAdaptiveQuestions, initializeColdStartMastery } from '../services/bktEngine';
import { Question, TopicMastery } from '../types';

describe('Bayesian Knowledge Tracing (BKT) Engine', () => {
  it('should increase mastery probability upon observing a correct answer', () => {
    const prior = 0.30;
    const posterior = computeBKTUpdate(prior, true, DEFAULT_BKT_PARAMS);
    
    // With P(L0)=0.30, P(T)=0.15, P(G)=0.20, P(S)=0.10:
    // P(L|Corr) = (0.3*0.9) / (0.3*0.9 + 0.7*0.2) = 0.27 / (0.27 + 0.14) = 0.27 / 0.41 ≈ 0.6585
    // P(L_next) = 0.6585 + (1 - 0.6585)*0.15 ≈ 0.7097
    expect(posterior).toBeGreaterThan(prior);
    expect(posterior).toBeCloseTo(0.71, 1);
  });

  it('should decrease mastery probability upon observing an incorrect answer (accounting for slip)', () => {
    const prior = 0.70;
    const posterior = computeBKTUpdate(prior, false, DEFAULT_BKT_PARAMS);

    // P(L|Incorr) = (0.7*0.1) / (0.7*0.1 + 0.3*0.8) = 0.07 / (0.07 + 0.24) = 0.07 / 0.31 ≈ 0.2258
    // P(L_next) = 0.2258 + (1 - 0.2258)*0.15 ≈ 0.3419
    expect(posterior).toBeLessThan(prior);
  });

  it('should adaptively select questions for the weakest topics first', () => {
    const sampleMastery: Record<string, TopicMastery> = {
      'Optimization': {
        topic: 'Optimization',
        pMastery: 0.85,
        totalAttempts: 5,
        correctAttempts: 4,
        accuracy: 0.8,
        lastPracticed: Date.now(),
        status: 'Mastered',
        recommendedAction: 'Hard questions.',
        bktParams: { ...DEFAULT_BKT_PARAMS }
      },
      'Backpropagation': {
        topic: 'Backpropagation',
        pMastery: 0.25,
        totalAttempts: 3,
        correctAttempts: 1,
        accuracy: 0.33,
        lastPracticed: Date.now(),
        status: 'Needs Attention',
        recommendedAction: 'Revision needed.',
        bktParams: { ...DEFAULT_BKT_PARAMS }
      }
    };

    const dummyQuestions: Question[] = [
      {
        id: 'q-opt',
        type: 'mcq',
        topic: 'Optimization',
        subtopic: 'Gradient Descent',
        difficulty: 'Hard',
        questionText: 'Optimization Q',
        correctAnswer: 'A',
        explanation: 'Exp',
        citation: { id: 'c1', materialId: 'm1', materialTitle: 'T', materialType: 'pdf', locationString: 'p1', excerpt: '', confidenceScore: 1 },
        verified: true,
        verificationMethod: 'source_exact_match'
      },
      {
        id: 'q-backprop',
        type: 'mcq',
        topic: 'Backpropagation',
        subtopic: 'Chain Rule',
        difficulty: 'Easy',
        questionText: 'Backpropagation Q',
        correctAnswer: 'B',
        explanation: 'Exp',
        citation: { id: 'c2', materialId: 'm2', materialTitle: 'T', materialType: 'pdf', locationString: 'p2', excerpt: '', confidenceScore: 1 },
        verified: true,
        verificationMethod: 'source_exact_match'
      }
    ];

    const selected = selectAdaptiveQuestions(dummyQuestions, sampleMastery, new Set(), 1);
    expect(selected.length).toBe(1);
    // Should prioritize Backpropagation since its mastery (0.25) < Optimization (0.85)
    expect(selected[0].topic).toBe('Backpropagation');
  });

  it('should initialize cold-start baseline mastery with correct defaults', () => {
    const topics = ['Topic A', 'Topic B'];
    const coldStart = initializeColdStartMastery(topics, 0.40);
    expect(coldStart['Topic A'].pMastery).toBe(0.40);
    expect(coldStart['Topic B'].pMastery).toBe(0.40);
  });
});

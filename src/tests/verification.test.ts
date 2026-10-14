import { describe, it, expect } from 'vitest';
import { PRE_VERIFIED_QUESTIONS } from '../data/sampleCoursePack';

describe('Deterministic Question & Calculation Verification', () => {
  it('should deterministically verify linear neuron and ReLU forward calculation', () => {
    // Problem from TA Recitation Notes:
    // x1=2.0, x2=3.0, w1=0.5, w2=-1.0, b=0.1
    const x1 = 2.0, x2 = 3.0;
    const w1 = 0.5, w2 = -1.0;
    const b = 0.1;

    const z = (x1 * w1) + (x2 * w2) + b;
    expect(z).toBeCloseTo(-1.9, 5);

    const relu = Math.max(0, z);
    expect(relu).toBe(0.0);

    const question = PRE_VERIFIED_QUESTIONS.find(q => q.id === 'q-opt-num');
    expect(question).toBeDefined();
    expect(question?.correctAnswer).toBe('0');
    expect(question?.verified).toBe(true);
    expect(question?.verificationMethod).toBe('deterministic_calc');
  });

  it('should verify maximum sigmoid derivative calculation', () => {
    // d/dz (1 / (1 + e^-z)) at z=0:
    // sigmoid(0) = 0.5; derivative = 0.5 * (1 - 0.5) = 0.25
    const sig0 = 1 / (1 + Math.exp(0));
    const dSig0 = sig0 * (1 - sig0);
    expect(dSig0).toBe(0.25);

    const question = PRE_VERIFIED_QUESTIONS.find(q => q.id === 'q-act-vanish');
    expect(question).toBeDefined();
    expect(question?.correctAnswer).toBe('0.25 at z = 0');
    expect(question?.verified).toBe(true);
  });

  it('should ensure all pre-verified questions have explicit citations and explanations', () => {
    for (const q of PRE_VERIFIED_QUESTIONS) {
      expect(q.citation).toBeDefined();
      expect(q.citation.materialTitle.length).toBeGreaterThan(0);
      expect(q.citation.locationString.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.verified).toBe(true);
    }
  });
});

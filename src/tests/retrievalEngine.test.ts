import { describe, it, expect } from 'vitest';
import { searchKnowledgeBase, tokenize } from '../services/retrievalEngine';
import { SAMPLE_MATERIALS } from '../data/sampleCoursePack';

describe('Retrieval & Citation Engine', () => {
  const allChunks = SAMPLE_MATERIALS.flatMap(m => m.chunks);

  it('should accurately tokenize and remove standard English stopwords', () => {
    const text = 'What is the gradient descent optimization rule and how does it work?';
    const tokens = tokenize(text);
    expect(tokens).toContain('gradient');
    expect(tokens).toContain('descent');
    expect(tokens).toContain('optimization');
    expect(tokens).not.toContain('what');
    expect(tokens).not.toContain('the');
    expect(tokens).not.toContain('and');
  });

  it('should retrieve relevant chunk and valid slide citation for attention questions', () => {
    const query = 'Why divide by sqrt(d_k) in Scaled Dot-Product Attention?';
    const result = searchKnowledgeBase(query, allChunks);

    expect(result.isConfident).toBe(true);
    expect(result.topPassages.length).toBeGreaterThan(0);
    
    // Top passage must match slide 5 chunk on scaled dot-product
    const topChunk = result.topPassages[0].chunk;
    expect(topChunk.materialType).toBe('slides');
    expect(topChunk.locationString).toBe('Slide 5');
    expect(topChunk.text).toContain('scaling factor 1/sqrt(d_k)');

    // Citations must be populated with confidence score
    expect(result.bestCitation).toBeDefined();
    expect(result.bestCitation?.confidenceScore).toBeGreaterThan(0.7);
  });

  it('should honestly trigger refusal when queried on unsupported concepts', () => {
    const trickQuery = 'How does quantum entanglement accelerate BERT pretraining in superconducting circuits?';
    const result = searchKnowledgeBase(trickQuery, allChunks);

    expect(result.isConfident).toBe(false);
    expect(result.topPassages.length).toBe(0);
    expect(result.refusalReason).toContain('do not contain sufficient evidence');
  });
});

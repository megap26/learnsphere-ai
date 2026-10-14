import { MaterialChunk, Citation } from '../types';

export interface RetrievalResult {
  chunk: MaterialChunk;
  score: number;
  matchedTerms: string[];
}

export interface GroundedSearchOutput {
  topPassages: RetrievalResult[];
  isConfident: boolean;
  refusalReason?: string;
  bestCitation?: Citation;
  allCitations: Citation[];
}

// Stopwords to exclude during tokenization
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more',
  'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'ought', 'our', 'ours', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Deterministic TF-IDF styled retrieval over indexed chunks.
 * Computes term frequencies, document inverse frequencies, and passage scoring.
 */
export function searchKnowledgeBase(
  query: string,
  chunks: MaterialChunk[],
  filterTopic?: string,
  minConfidenceThreshold: number = 0.22
): GroundedSearchOutput {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0 || chunks.length === 0) {
    return {
      topPassages: [],
      isConfident: false,
      refusalReason: 'Query contains insufficient meaningful keywords to search materials.',
      allCitations: []
    };
  }

  // Calculate Document Frequency for query terms across corpus
  const docFrequency: Record<string, number> = {};
  for (const token of queryTokens) {
    docFrequency[token] = 0;
    for (const chunk of chunks) {
      const chunkLower = chunk.text.toLowerCase() + ' ' + chunk.topic.toLowerCase() + ' ' + chunk.subtopic.toLowerCase();
      if (chunkLower.includes(token)) {
        docFrequency[token]++;
      }
    }
  }

  const N = chunks.length;
  const scoredChunks: RetrievalResult[] = [];

  for (const chunk of chunks) {
    if (filterTopic && chunk.topic.toLowerCase() !== filterTopic.toLowerCase()) {
      continue;
    }

    const chunkContent = `${chunk.text} ${chunk.topic} ${chunk.subtopic} ${chunk.materialTitle}`.toLowerCase();
    const chunkTokens = tokenize(chunkContent);
    const chunkTokenCount = chunkTokens.length || 1;

    let totalScore = 0;
    const matchedTerms: string[] = [];

    for (const token of queryTokens) {
      // Term count in chunk
      const termCount = chunkTokens.filter(t => t === token || t.includes(token) || token.includes(t)).length;

      if (termCount > 0) {
        matchedTerms.push(token);
        const tf = termCount / chunkTokenCount;
        const df = docFrequency[token] || 1;
        const idf = Math.log(1 + (N / (1 + df)));

        // Bonus for matches in topic / subtopic
        const topicBonus = chunk.topic.toLowerCase().includes(token) ? 1.5 : 1.0;
        totalScore += tf * idf * topicBonus * 10;
      }
    }

    if (totalScore > 0) {
      scoredChunks.push({
        chunk,
        score: Number(totalScore.toFixed(4)),
        matchedTerms
      });
    }
  }

  // Sort by score descending
  scoredChunks.sort((a, b) => b.score - a.score);

  const topPassages = scoredChunks.slice(0, 3);
  const best = topPassages[0];

  // Grounding check: Refusal when top score falls below confidence threshold
  if (!best || best.score < minConfidenceThreshold) {
    return {
      topPassages: [],
      isConfident: false,
      refusalReason: `The uploaded course materials do not contain sufficient evidence to answer this question reliably. Please provide a relevant PDF, slide deck, or lecture transcript.`,
      allCitations: []
    };
  }

  const citations: Citation[] = topPassages.map((p, idx) => ({
    id: `cit-${p.chunk.id}-${idx}`,
    materialId: p.chunk.materialId,
    materialTitle: p.chunk.materialTitle,
    materialType: p.chunk.materialType,
    locationString: p.chunk.locationString,
    excerpt: p.chunk.text.length > 220 ? p.chunk.text.substring(0, 220) + '...' : p.chunk.text,
    confidenceScore: Math.min(0.99, Number((0.75 + p.score * 0.1).toFixed(2)))
  }));

  return {
    topPassages,
    isConfident: true,
    bestCitation: citations[0],
    allCitations: citations
  };
}

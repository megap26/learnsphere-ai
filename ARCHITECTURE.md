# LearnSphere AI — Technical Architecture & Implementation Details

## 1. System Overview

LearnSphere AI is designed as a multimodal, source-grounded intelligent tutoring and adaptive assessment platform. It eliminates the risks of LLM hallucination in education by coupling strict citation retrieval with a probabilistic Bayesian learner model.

---

## 2. Component Architecture

```
[Student / Judge Web Client]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│  React 18 + Vite + TypeScript UI Layer                 │
│  - Dark Navy & Slate Theme with Semantic Tokens        │
│  - 8 Specialized Working Views                         │
│  - Interactive Knowledge Graph & Prerequisite Canvas   │
│  - Floating Verbatim Citation Excerpt Inspector        │
└───────────────────────┬────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
┌────────────────────────┐   ┌───────────────────────────┐
│ Local Deterministic    │   │ Python FastAPI Backend    │
│ Browser Engine         │   │ (Optional REST API)       │
│ - TF-IDF Search        │   │ - `/api/chat`             │
│ - Math Verification    │   │ - `/api/mastery/update`   │
│ - BKT State Tracker    │   │ - `/api/quiz/verify`      │
│ - LocalStorage Store   │   │ - `/api/evaluation/run`   │
└────────────────────────┘   └───────────────────────────┘
```

---

## 3. Data Schema & Models

### 3.1 Study Material & Content Chunks
```typescript
interface MaterialChunk {
  id: string;
  materialId: string;
  materialTitle: string;
  materialType: 'pdf' | 'slides' | 'video' | 'notes';
  location: {
    page?: number;        // Extracted PDF page number
    slide?: number;       // Slide index in PPTX deck
    timestamp?: string;   // Video timestamp (MM:SS)
    paragraph?: number;   // Paragraph anchor in notes
  };
  locationString: string; // e.g. "Page 14, ¶2" or "Slide 5"
  text: string;           // Verbatim passage text
  topic: string;          // Course topic tag
  subtopic: string;       // Granular concept tag
}
```

### 3.2 Citation Structure
```typescript
interface Citation {
  id: string;
  materialId: string;
  materialTitle: string;
  materialType: MaterialType;
  locationString: string;
  excerpt: string;
  confidenceScore: number;
}
```

### 3.3 Bayesian Knowledge Tracing State
```typescript
interface TopicMastery {
  topic: string;
  pMastery: number;         // Posterior probability P(L_t) ∈ [0.01, 0.99]
  totalAttempts: number;    // Count of recorded responses
  correctAttempts: number;  // Correct answers
  accuracy: number;         // Observed empirical accuracy
  lastPracticed: number;    // Epoch timestamp
  status: 'Mastered' | 'Practicing' | 'Needs Attention';
  recommendedAction: string; // Explainable pedagogical guidance
  bktParams: {
    pL0: number; // Prior (0.30)
    pT: number;  // Transition (0.15)
    pG: number;  // Guess (0.20)
    pS: number;  // Slip (0.10)
  };
}
```

---

## 4. Ingestion & Provenance Preservation

1. **Multimodal Ingestion**:
   - Ingests raw text or transcripts from 4 primary formats: PDFs, Slide Decks, Video Transcripts, and Lab Notes.
2. **Chunking Strategy**:
   - Segments text along natural syntactic boundaries (paragraphs, bullet clusters, slide headers, or timestamp segments).
   - Preserves source metadata throughout the processing lifecycle.
3. **Retrieval Pipeline**:
   - Tokenizes input queries with stopword filtering.
   - Computes Term Frequency (TF) and Inverse Document Frequency (IDF) over the corpus.
   - Evaluates a confidence threshold (0.22): queries that score below this threshold are flagged as unsupported, triggering an honest refusal.

---

## 5. Bayesian Knowledge Tracing Formulation

The learner model tracks latent mastery through four orthogonal probability parameters:

```
          ┌──────────────────────────────────────────────┐
          │               Latent State                   │
          │         L_t: Concept Mastered (1 / 0)        │
          └──────────────┬───────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    True Mastery                     No Mastery
   P(Obs=1) = 1 - P(S)              P(Obs=1) = P(G)
   (Slip Rate: 0.10)               (Guess Rate: 0.20)
```

1. **Prior Step**: Initial mastery initialized to $P(L_0) = 0.30$.
2. **Observation Update**:
   - On Correct answer:
     $$P(L_t \mid \text{Correct}) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$
   - On Incorrect answer:
     $$P(L_t \mid \text{Incorrect}) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$
3. **Transition Step**:
   $$P(L_{t+1}) = P(L_t \mid \text{Obs}) + (1 - P(L_t \mid \text{Obs})) \cdot P(T)$$

---

## 6. Deterministic Verification Pipeline

To ensure assessment integrity:
1. **Mathematical Verification**: Arithmetic questions are computed deterministically (e.g. forward linear activation pass $z = \mathbf{w}^T \mathbf{x} + b$ followed by $\max(0, z)$).
2. **Key Consistency**: Ensures options contain the exact verified key and match source citations.
3. **Mastery Isolation**: Unverified questions are flagged and prohibited from mutating latent mastery estimates.

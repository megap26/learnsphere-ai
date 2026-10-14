import { StudyMaterial, ConceptNode, Question, EvaluationBenchmarkItem } from '../types';

export const SAMPLE_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-pdf-deeplearning',
    title: 'Foundations of Deep Neural Networks (Textbook Excerpt)',
    course: 'CS 229: Machine Learning & Deep Architectures',
    type: 'pdf',
    description: 'Core chapters covering gradient optimization, loss landscapes, backpropagation chain rule, and activation dynamics.',
    topics: ['Optimization', 'Backpropagation', 'Activation Functions'],
    uploadDate: '2026-09-12',
    itemCountLabel: '24 Pages Extracted',
    chunks: [
      {
        id: 'chunk-pdf-1',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf',
        location: { page: 14, paragraph: 2 },
        locationString: 'Page 14, ¶2',
        topic: 'Optimization',
        subtopic: 'Gradient Descent',
        text: 'Gradient descent minimizes the scalar cost function J(θ) by updating model parameters in the opposite direction of the gradient ∇θ J(θ). The learning rate η determines the step size: θ := θ - η ∇θ J(θ). If η is too small, convergence is prohibitively slow; if η is excessively large, updates overshoot the minimum and may diverge.'
      },
      {
        id: 'chunk-pdf-2',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf',
        location: { page: 28, paragraph: 3 },
        locationString: 'Page 28, ¶3',
        topic: 'Backpropagation',
        subtopic: 'Chain Rule Derivation',
        text: 'Backpropagation computes the partial derivative of the error loss L with respect to each weight Wij across hidden layers. By applying the multivariate chain rule: ∂L/∂Wij = (∂L/∂aj) * (∂aj/∂zj) * (∂zj/∂Wij), where zj = ∑ Wjk ak-1 + bj. The error signal δj = ∂L/∂zj is recursively propagated backwards from layer l+1 to layer l using δ_l = ((W_{l+1})^T δ_{l+1}) ⊙ σ\'(z_l).'
      },
      {
        id: 'chunk-pdf-3',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf',
        location: { page: 42, paragraph: 1 },
        locationString: 'Page 42, ¶1',
        topic: 'Activation Functions',
        subtopic: 'Vanishing Gradient Problem',
        text: 'Saturating activation functions such as sigmoid σ(z) = 1/(1+e^{-z}) and tanh(z) produce derivatives that quickly approach zero as |z| increases (maximum sigmoid derivative is 0.25 at z=0). In deep networks with many layers, multiplying these small fractions repeatedly causes the gradient δ_l to diminish exponentially toward early layers, preventing weights from updating.'
      },
      {
        id: 'chunk-pdf-4',
        materialId: 'mat-pdf-deeplearning',
        materialTitle: 'Foundations of Deep Neural Networks',
        materialType: 'pdf',
        location: { page: 56, paragraph: 4 },
        locationString: 'Page 56, ¶4',
        topic: 'Optimization',
        subtopic: 'Momentum & Adam',
        text: 'Stochastic Gradient Descent with Momentum accelerates vectors in directions of persistent gradient descent while dampening oscillations along high-curvature ravines. Adam (Adaptive Moment Estimation) combines first-order momentum (running average of gradients m_t) with second-order momentum (running average of squared gradients v_t) with bias corrections.'
      }
    ]
  },
  {
    id: 'mat-slides-transformers',
    title: 'Lecture 07: Attention Mechanisms & Transformer Architectures',
    course: 'CS 229: Machine Learning & Deep Architectures',
    type: 'slides',
    description: 'Official slide deck explaining scaled dot-product attention, multi-head projections, and sequence-to-sequence encoder-decoder pipelines.',
    topics: ['Attention Mechanisms', 'Transformers'],
    uploadDate: '2026-09-18',
    itemCountLabel: '32 Slides Extracted',
    chunks: [
      {
        id: 'chunk-slide-1',
        materialId: 'mat-slides-transformers',
        materialTitle: 'Lecture 07: Attention Mechanisms & Transformers',
        materialType: 'slides',
        location: { slide: 5 },
        locationString: 'Slide 5',
        topic: 'Attention Mechanisms',
        subtopic: 'Scaled Dot-Product Attention',
        text: 'Scaled Dot-Product Attention computes weights using Query (Q), Key (K), and Value (V) matrices: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V. The scaling factor 1/sqrt(d_k) prevents the dot products from growing excessively large in high dimensions, which would otherwise push softmax into regions with vanishingly small gradients.'
      },
      {
        id: 'chunk-slide-2',
        materialId: 'mat-slides-transformers',
        materialTitle: 'Lecture 07: Attention Mechanisms & Transformers',
        materialType: 'slides',
        location: { slide: 12 },
        locationString: 'Slide 12',
        topic: 'Transformers',
        subtopic: 'Multi-Head Attention',
        text: 'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions. MultiHead(Q,K,V) = Concat(head_1, ..., head_h) * W^O, where each head_i = Attention(Q * W_i^Q, K * W_i^K, V * W_i^V). It captures syntactic, positional, and semantic dependencies simultaneously.'
      },
      {
        id: 'chunk-slide-3',
        materialId: 'mat-slides-transformers',
        materialTitle: 'Lecture 07: Attention Mechanisms & Transformers',
        materialType: 'slides',
        location: { slide: 19 },
        locationString: 'Slide 19',
        topic: 'Transformers',
        subtopic: 'Positional Encodings',
        text: 'Because self-attention operations are permutation invariant and contain no recurrent sequence loops, positional encodings must be injected into input token embeddings. Sinusoidal positional encodings use frequencies: PE(pos, 2i) = sin(pos / 10000^{2i/d_model}) and PE(pos, 2i+1) = cos(pos / 10000^{2i/d_model}) to allow relative position interpolation.'
      }
    ]
  },
  {
    id: 'mat-video-optimization',
    title: 'MIT OpenCourse: Deep Learning Optimization in Practice (Video)',
    course: 'CS 229: Machine Learning & Deep Architectures',
    type: 'video',
    description: 'Video lecture discussing practical hyperparameter tuning, learning rate schedules, and cross-entropy loss formulation.',
    topics: ['Optimization', 'Loss Functions'],
    uploadDate: '2026-09-25',
    itemCountLabel: '48:30 Mins Timestamped',
    videoUrl: 'https://www.youtube.com/watch?v=sample-deep-learning-opt',
    hasTranscript: true,
    chunks: [
      {
        id: 'chunk-vid-1',
        materialId: 'mat-video-optimization',
        materialTitle: 'MIT OpenCourse: Deep Learning Optimization',
        materialType: 'video',
        location: { timestamp: '14:22' },
        locationString: 'Timestamp 14:22',
        topic: 'Loss Functions',
        subtopic: 'Cross-Entropy Loss',
        text: '[14:22] For multi-class classification with one-hot targets y and predicted probability distributions p, the Categorical Cross-Entropy loss is defined as L = - ∑ y_i * log(p_i). It penalizes confident wrong predictions with severe exponential penalties, providing steep gradients that speed up training.'
      },
      {
        id: 'chunk-vid-2',
        materialId: 'mat-video-optimization',
        materialTitle: 'MIT OpenCourse: Deep Learning Optimization',
        materialType: 'video',
        location: { timestamp: '27:45' },
        locationString: 'Timestamp 27:45',
        topic: 'Optimization',
        subtopic: 'Learning Rate Warmup & Decay',
        text: '[27:45] In transformer training, setting a high learning rate immediately causes divergence because attention weights are randomly initialized. We employ Linear Warmup for the initial 2,000 steps, gradually ramping up η from 0 to η_max, followed by Cosine Annealing decay towards zero.'
      }
    ]
  },
  {
    id: 'mat-notes-calc',
    title: 'Teaching Assistant Recitation Notes: Backpropagation by Hand',
    course: 'CS 229: Machine Learning & Deep Architectures',
    type: 'notes',
    description: 'Handwritten calculation walk-through for a single hidden layer MLP with numerical verification examples.',
    topics: ['Backpropagation'],
    uploadDate: '2026-10-02',
    itemCountLabel: 'Recitation Notes',
    chunks: [
      {
        id: 'chunk-notes-1',
        materialId: 'mat-notes-calc',
        materialTitle: 'TA Recitation Notes: Backprop by Hand',
        materialType: 'notes',
        location: { paragraph: 4 },
        locationString: 'Section 2, ¶4',
        topic: 'Backpropagation',
        subtopic: 'Numerical Example',
        text: 'Consider a linear neuron z = w1*x1 + w2*x2 + b with x1=2.0, x2=3.0, w1=0.5, w2=-1.0, b=0.1. Forward pass: z = (2.0*0.5) + (3.0*-1.0) + 0.1 = 1.0 - 3.0 + 0.1 = -1.9. If activation σ(z) = ReLU(z) = max(0, z), output a = 0.0. Since z < 0, local gradient ∂a/∂z = 0, which zeroes out all upstream gradients through this path.'
      }
    ]
  }
];

export const CONCEPT_GRAPH: ConceptNode[] = [
  {
    id: 'c-opt',
    label: 'Optimization & Gradient Descent',
    course: 'CS 229',
    description: 'Mechanisms for iteratively adjusting model parameters along cost function gradients.',
    prerequisites: [],
    subtopics: ['Gradient Descent', 'Learning Rate', 'Momentum', 'Adam Optimizer'],
    masteryTarget: 'Master parameter updates, convergence conditions, and hyperparameter sensitivity.',
    chunkIds: ['chunk-pdf-1', 'chunk-pdf-4', 'chunk-vid-2']
  },
  {
    id: 'c-act',
    label: 'Activation Functions & Dynamics',
    course: 'CS 229',
    description: 'Non-linear transformations introducing expressive power and gradient saturation behavior.',
    prerequisites: [],
    subtopics: ['Sigmoid', 'ReLU', 'Tanh', 'Vanishing Gradients'],
    masteryTarget: 'Evaluate derivative bounds and identify causes of vanishing/exploding gradients.',
    chunkIds: ['chunk-pdf-3', 'chunk-notes-1']
  },
  {
    id: 'c-loss',
    label: 'Loss Functions',
    course: 'CS 229',
    description: 'Objective formulations measuring discrepancy between predicted and target distributions.',
    prerequisites: [],
    subtopics: ['Mean Squared Error', 'Categorical Cross-Entropy', 'Log Loss'],
    masteryTarget: 'Formulate objective functions and analyze their gradient characteristics.',
    chunkIds: ['chunk-vid-1']
  },
  {
    id: 'c-backprop',
    label: 'Backpropagation & Chain Rule',
    course: 'CS 229',
    description: 'Reverse-mode automatic differentiation algorithm calculating parameter error gradients.',
    prerequisites: ['c-opt', 'c-act'],
    subtopics: ['Multivariate Chain Rule', 'Error Signal δ', 'Jacobian Vector Products'],
    masteryTarget: 'Derive error signals layer-by-layer and trace numerical forward/backward passes.',
    chunkIds: ['chunk-pdf-2', 'chunk-notes-1']
  },
  {
    id: 'c-att',
    label: 'Attention Mechanisms',
    course: 'CS 229',
    description: 'Dynamic weighting mechanism computing relevance between query and key vectors.',
    prerequisites: ['c-opt', 'c-backprop'],
    subtopics: ['Scaled Dot-Product', 'Query-Key-Value', 'Softmax Scaling'],
    masteryTarget: 'Formulate QKV calculations and explain why dimension scaling prevents vanishing gradients.',
    chunkIds: ['chunk-slide-1']
  },
  {
    id: 'c-trans',
    label: 'Transformers & Multi-Head Attention',
    course: 'CS 229',
    description: 'Modern non-recurrent sequence architecture relying entirely on parallel self-attention.',
    prerequisites: ['c-att'],
    subtopics: ['Multi-Head Projections', 'Positional Encodings', 'Feedforward Layers'],
    masteryTarget: 'Explain why positional encoding is required and how multi-head projections operate.',
    chunkIds: ['chunk-slide-2', 'chunk-slide-3', 'chunk-vid-2']
  }
];

export const PRE_VERIFIED_QUESTIONS: Question[] = [
  {
    id: 'q-opt-1',
    type: 'mcq',
    topic: 'Optimization',
    subtopic: 'Gradient Descent',
    difficulty: 'Easy',
    questionText: 'In standard Gradient Descent, what occurs when the learning rate η is set excessively high?',
    options: [
      'The model converges to the global minimum in a single iteration',
      'Parameter updates overshoot the minimum and the cost function may diverge',
      'The gradients δ_l vanish to absolute zero across early layers',
      'The parameter vector θ remains strictly frozen and unchanging'
    ],
    correctAnswer: 'Parameter updates overshoot the minimum and the cost function may diverge',
    explanation: 'As stated in Foundations of Deep Neural Networks (p. 14, ¶2), an excessively high learning rate causes parameter updates to overshoot the loss valley and diverge, whereas too small an η makes progress prohibitively slow.',
    citation: {
      id: 'cit-q-1',
      materialId: 'mat-pdf-deeplearning',
      materialTitle: 'Foundations of Deep Neural Networks',
      materialType: 'pdf',
      locationString: 'Page 14, ¶2',
      excerpt: 'If η is too small, convergence is prohibitively slow; if η is excessively large, updates overshoot the minimum and may diverge.',
      confidenceScore: 0.98
    },
    verified: true,
    verificationMethod: 'source_exact_match',
    verificationNotes: 'Strict textual equivalence with textbook page 14.'
  },
  {
    id: 'q-opt-num',
    type: 'numerical',
    topic: 'Backpropagation',
    subtopic: 'Numerical Example',
    difficulty: 'Medium',
    questionText: 'For a neuron with inputs x1=2.0, x2=3.0, weights w1=0.5, w2=-1.0, and bias b=0.1 with ReLU activation, what is the output activation a?',
    correctAnswer: '0',
    options: ['0', '1.0', '-1.9', '0.1'],
    explanation: 'The linear sum is z = (2.0 * 0.5) + (3.0 * -1.0) + 0.1 = 1.0 - 3.0 + 0.1 = -1.9. Since ReLU(z) = max(0, z), and -1.9 < 0, the output is 0.0. Verified deterministically against TA Recitation Notes Section 2.',
    citation: {
      id: 'cit-q-2',
      materialId: 'mat-notes-calc',
      materialTitle: 'TA Recitation Notes: Backprop by Hand',
      materialType: 'notes',
      locationString: 'Section 2, ¶4',
      excerpt: 'Forward pass: z = (2.0*0.5) + (3.0*-1.0) + 0.1 = 1.0 - 3.0 + 0.1 = -1.9. If activation σ(z) = ReLU(z) = max(0, z), output a = 0.0.',
      confidenceScore: 0.99
    },
    verified: true,
    verificationMethod: 'deterministic_calc',
    verificationNotes: 'Calculation verified: z = -1.9; max(0, -1.9) = 0.'
  },
  {
    id: 'q-att-scale',
    type: 'mcq',
    topic: 'Attention Mechanisms',
    subtopic: 'Scaled Dot-Product Attention',
    difficulty: 'Medium',
    questionText: 'Why does Scaled Dot-Product Attention divide the query-key dot products by sqrt(d_k)?',
    options: [
      'To enforce that all attention matrices are strictly orthogonal',
      'To prevent large dot products from pushing softmax into regions with vanishingly small gradients',
      'To eliminate the need for Value (V) matrix projection',
      'To ensure the total attention weights sum to 100 instead of 1'
    ],
    correctAnswer: 'To prevent large dot products from pushing softmax into regions with vanishingly small gradients',
    explanation: 'Lecture 07 slide 5 confirms that as key dimension d_k increases, the dot products grow large, pushing softmax into extreme regions where gradients are near zero. Scaling by 1/sqrt(d_k) stabilizes the variance.',
    citation: {
      id: 'cit-q-3',
      materialId: 'mat-slides-transformers',
      materialTitle: 'Lecture 07: Attention Mechanisms & Transformers',
      materialType: 'slides',
      locationString: 'Slide 5',
      excerpt: 'The scaling factor 1/sqrt(d_k) prevents the dot products from growing excessively large in high dimensions, which would otherwise push softmax into regions with vanishingly small gradients.',
      confidenceScore: 0.97
    },
    verified: true,
    verificationMethod: 'source_exact_match',
    verificationNotes: 'Direct match with Slide 5 rationale.'
  },
  {
    id: 'q-act-vanish',
    type: 'mcq',
    topic: 'Activation Functions',
    subtopic: 'Vanishing Gradient Problem',
    difficulty: 'Hard',
    questionText: 'What is the theoretical maximum value of the derivative of the standard sigmoid activation function σ(z)?',
    options: [
      '1.0 at z = 0',
      '0.5 at z = 1.0',
      '0.25 at z = 0',
      '0.0 at z = ±∞'
    ],
    correctAnswer: '0.25 at z = 0',
    explanation: 'The derivative σ\'(z) = σ(z)(1 - σ(z)). Since σ(0) = 0.5, the maximum occurs at z=0 with value 0.5 * 0.5 = 0.25. (Foundations of Deep Neural Networks, p. 42, ¶1).',
    citation: {
      id: 'cit-q-4',
      materialId: 'mat-pdf-deeplearning',
      materialTitle: 'Foundations of Deep Neural Networks',
      materialType: 'pdf',
      locationString: 'Page 42, ¶1',
      excerpt: 'maximum sigmoid derivative is 0.25 at z=0. In deep networks with many layers, multiplying these small fractions repeatedly causes the gradient δ_l to diminish exponentially...',
      confidenceScore: 0.99
    },
    verified: true,
    verificationMethod: 'deterministic_calc',
    verificationNotes: 'Verified: d/dz (1/(1+e^-z)) at z=0 is 0.25.'
  },
  {
    id: 'q-trans-pos',
    type: 'mcq',
    topic: 'Transformers',
    subtopic: 'Positional Encodings',
    difficulty: 'Medium',
    questionText: 'Why are Positional Encodings strictly necessary in Transformer encoder architectures?',
    options: [
      'Because self-attention is permutation-invariant and carries no inherent sequence ordering',
      'Because GPU memory is allocated chronologically by sentence length',
      'To prevent the multi-head attention weights from becoming complex imaginary numbers',
      'To replace the need for the Feedforward MLP layer'
    ],
    correctAnswer: 'Because self-attention is permutation-invariant and carries no inherent sequence ordering',
    explanation: 'Slide 19 points out that self-attention contains no recurrent loops or convolutions, meaning swapping word order leaves the attention representation unchanged unless positional encodings are injected.',
    citation: {
      id: 'cit-q-5',
      materialId: 'mat-slides-transformers',
      materialTitle: 'Lecture 07: Attention Mechanisms & Transformers',
      materialType: 'slides',
      locationString: 'Slide 19',
      excerpt: 'Because self-attention operations are permutation invariant and contain no recurrent sequence loops, positional encodings must be injected into input token embeddings.',
      confidenceScore: 0.96
    },
    verified: true,
    verificationMethod: 'source_exact_match'
  },
  {
    id: 'q-opt-warmup',
    type: 'mcq',
    topic: 'Optimization',
    subtopic: 'Learning Rate Warmup & Decay',
    difficulty: 'Hard',
    questionText: 'Why do practitioner pipelines employ Linear Warmup before applying standard learning rates in Transformer models?',
    options: [
      'To warm up the physical silicon of the GPU tensor cores',
      'Because randomly initialized attention weights produce unstable gradients early on that cause catastrophic divergence',
      'To ensure that cross-entropy loss reaches zero in step 1',
      'To convert float16 weights into integer precision'
    ],
    correctAnswer: 'Because randomly initialized attention weights produce unstable gradients early on that cause catastrophic divergence',
    explanation: 'From MIT OpenCourse video at 27:45: Setting high learning rates early on when attention weights are completely unaligned destabilizes optimization, requiring a gradual ramp from 0 to η_max.',
    citation: {
      id: 'cit-q-6',
      materialId: 'mat-video-optimization',
      materialTitle: 'MIT OpenCourse: Deep Learning Optimization',
      materialType: 'video',
      locationString: 'Timestamp 27:45',
      excerpt: 'In transformer training, setting a high learning rate immediately causes divergence because attention weights are randomly initialized. We employ Linear Warmup for the initial 2,000 steps...',
      confidenceScore: 0.95
    },
    verified: true,
    verificationMethod: 'source_exact_match'
  }
];

export const EVALUATION_BENCHMARK: EvaluationBenchmarkItem[] = [
  {
    id: 'eval-1',
    query: 'How does backpropagation compute gradients through hidden layers using the chain rule?',
    expectedSupportingChunkIds: ['chunk-pdf-2'],
    expectedRefusal: false,
    groundTruthAnswer: 'Backpropagation uses the multivariate chain rule to calculate ∂L/∂Wij = (∂L/∂aj) * (∂aj/∂zj) * (∂zj/∂Wij), recursively propagating the error signal δj backwards through layers.',
    topic: 'Backpropagation'
  },
  {
    id: 'eval-2',
    query: 'Why is the scaling factor 1/sqrt(d_k) applied in scaled dot-product attention?',
    expectedSupportingChunkIds: ['chunk-slide-1'],
    expectedRefusal: false,
    groundTruthAnswer: 'It prevents the dot product from growing large in high dimensions, which would otherwise push the softmax into saturated regions with vanishingly small gradients.',
    topic: 'Attention Mechanisms'
  },
  {
    id: 'eval-3',
    query: 'What is the formula and rationale for Categorical Cross-Entropy loss?',
    expectedSupportingChunkIds: ['chunk-vid-1'],
    expectedRefusal: false,
    groundTruthAnswer: 'Categorical Cross-Entropy is defined as L = - ∑ y_i * log(p_i), which severely penalizes confident wrong predictions and provides steep gradients for rapid convergence.',
    topic: 'Loss Functions'
  },
  {
    id: 'eval-4-unsupported',
    query: 'How does quantum entanglement accelerate BERT pretraining in superconducting qubits?',
    expectedSupportingChunkIds: [],
    expectedRefusal: true,
    groundTruthAnswer: 'REFUSAL_EXPECTED: The uploaded course materials on CS 229 contain no information regarding quantum computing, qubits, or quantum entanglement.',
    topic: 'Quantum Deep Learning (Unsupported)'
  },
  {
    id: 'eval-5-unsupported',
    query: 'What are the mitochondrial gene mutations associated with Leber hereditary optic neuropathy?',
    expectedSupportingChunkIds: [],
    expectedRefusal: true,
    groundTruthAnswer: 'REFUSAL_EXPECTED: The uploaded course materials focus exclusively on Deep Learning and Neural Architectures, with zero medical genetics or mitochondrial biology content.',
    topic: 'Genetics (Unsupported)'
  }
];

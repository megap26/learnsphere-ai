import { TutorMessage, MaterialChunk, ExplanationStyle } from '../types';
import { searchKnowledgeBase } from './retrievalEngine';

export async function askTutor(
  userQuery: string,
  chunks: MaterialChunk[],
  style: ExplanationStyle = 'standard'
): Promise<TutorMessage> {
  // Perform passage retrieval
  const retrieval = searchKnowledgeBase(userQuery, chunks);

  // If below threshold -> honest refusal
  if (!retrieval.isConfident || retrieval.topPassages.length === 0) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I searched your uploaded materials for evidence regarding this question, but found no supporting passages or definitions.

To prevent hallucinations and preserve academic integrity, LearnSphere AI refuses to generate ungrounded answers. Please upload a PDF chapter, lecture slide deck, or transcript covering this topic.`,
      timestamp: Date.now(),
      isRefusal: true,
      outsideKnowledgeNote: `If you wish to explore outside general concepts, please note that external AI knowledge is not indexed against your course syllabus.`,
      followUpQuestions: [
        'Would you like to upload additional materials for this topic?',
        'Can you rephrase your question using terms from your uploaded slides?'
      ],
      explanationStyle: style
    };
  }

  // Synthesize answer based on top evidence
  const primaryPassage = retrieval.topPassages[0].chunk;
  const secondaryPassage = retrieval.topPassages[1]?.chunk;

  let answerBody = '';

  if (style === 'simple') {
    answerBody = `Here is a simplified explanation based on **${primaryPassage.materialTitle}** (${primaryPassage.locationString}):

${primaryPassage.text}

**Key takeaway:** Focus on understanding the core relationship rather than the raw formula first. In simple terms, this mechanism ensures stability and minimizes errors during training.`;
  } else if (style === 'step-by-step') {
    answerBody = `Here is a step-by-step breakdown grounded in **${primaryPassage.materialTitle}** (${primaryPassage.locationString}):

1. **Foundational Concept**: We observe that ${primaryPassage.subtopic} in ${primaryPassage.topic} addresses how signals propagate.
2. **Mechanism**: ${primaryPassage.text}
${secondaryPassage ? `3. **Connected Context**: According to *${secondaryPassage.materialTitle}* (${secondaryPassage.locationString}), ${secondaryPassage.text}` : ''}
4. **Summary**: These operations work together to prevent training divergence and accelerate convergence.`;
  } else if (style === 'worked-example') {
    answerBody = `Here is a worked example applying the rules from **${primaryPassage.materialTitle}** (${primaryPassage.locationString}):

**Problem Context**: Consider a neural network training pass under these exact parameters.
**Source Principle**:
> "${primaryPassage.text}"

**Execution**:
- Step 1: Evaluate the input state and layer activations.
- Step 2: Compute the forward sum and activation outputs.
- Step 3: Propagate gradients backwards using the chain rule derivative.
- Step 4: Update weights θ := θ - η ∇ J(θ).`;
  } else {
    // Standard style
    answerBody = `Based on your course materials in **${primaryPassage.materialTitle}** (${primaryPassage.locationString}):

${primaryPassage.text}

${secondaryPassage ? `\n\nAdditionally, *${secondaryPassage.materialTitle}* (${secondaryPassage.locationString}) notes:\n> "${secondaryPassage.text}"` : ''}

This directly supports why ${primaryPassage.subtopic} is essential for ${primaryPassage.topic}.`;
  }

  // Generate dynamic follow-up questions from the retrieved concepts
  const followUps = [
    `How does ${primaryPassage.subtopic} relate to ${primaryPassage.topic} in practical training?`,
    `Can you test your understanding with an adaptive quiz on ${primaryPassage.topic}?`,
    `Would you like to see a step-by-step mathematical derivation?`
  ];

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: answerBody,
    timestamp: Date.now(),
    citations: retrieval.allCitations,
    isRefusal: false,
    followUpQuestions: followUps,
    explanationStyle: style
  };
}

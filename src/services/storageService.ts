import { StudyMaterial, ConceptNode, Question, TopicMastery, QuizSession, TutorMessage } from '../types';
import { SAMPLE_MATERIALS, CONCEPT_GRAPH, PRE_VERIFIED_QUESTIONS } from '../data/sampleCoursePack';
import { initializeColdStartMastery } from './bktEngine';

const KEYS = {
  MATERIALS: 'learnsphere_materials_v1',
  CONCEPTS: 'learnsphere_concepts_v1',
  QUESTIONS: 'learnsphere_questions_v1',
  MASTERY: 'learnsphere_mastery_v1',
  QUIZ_HISTORY: 'learnsphere_quiz_history_v1',
  TUTOR_CHAT: 'learnsphere_tutor_chat_v1'
};

export function loadStoredMaterials(): StudyMaterial[] {
  try {
    const raw = localStorage.getItem(KEYS.MATERIALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load materials from storage:', e);
  }
  return SAMPLE_MATERIALS;
}

export function saveStoredMaterials(materials: StudyMaterial[]): void {
  try {
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(materials));
  } catch (e) {
    console.warn('Could not save materials:', e);
  }
}

export function loadStoredConcepts(): ConceptNode[] {
  try {
    const raw = localStorage.getItem(KEYS.CONCEPTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load concepts:', e);
  }
  return CONCEPT_GRAPH;
}

export function loadStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(KEYS.QUESTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load questions:', e);
  }
  return PRE_VERIFIED_QUESTIONS;
}

export function saveStoredQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (e) {
    console.warn('Could not save questions:', e);
  }
}

export function loadStoredMastery(): Record<string, TopicMastery> {
  try {
    const raw = localStorage.getItem(KEYS.MASTERY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load mastery:', e);
  }
  const defaultTopics = ['Optimization', 'Backpropagation', 'Activation Functions', 'Attention Mechanisms', 'Transformers', 'Loss Functions'];
  return initializeColdStartMastery(defaultTopics);
}

export function saveStoredMastery(mastery: Record<string, TopicMastery>): void {
  try {
    localStorage.setItem(KEYS.MASTERY, JSON.stringify(mastery));
  } catch (e) {
    console.warn('Could not save mastery:', e);
  }
}

export function loadStoredQuizHistory(): QuizSession[] {
  try {
    const raw = localStorage.getItem(KEYS.QUIZ_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load quiz history:', e);
  }
  return [];
}

export function saveQuizSession(session: QuizSession): void {
  try {
    const history = loadStoredQuizHistory();
    history.unshift(session);
    localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(history.slice(0, 30)));
  } catch (e) {
    console.warn('Could not save quiz session:', e);
  }
}

export function resetToDemoCourse(): void {
  try {
    localStorage.removeItem(KEYS.MATERIALS);
    localStorage.removeItem(KEYS.CONCEPTS);
    localStorage.removeItem(KEYS.QUESTIONS);
    localStorage.removeItem(KEYS.MASTERY);
    localStorage.removeItem(KEYS.QUIZ_HISTORY);
    localStorage.removeItem(KEYS.TUTOR_CHAT);
  } catch (e) {
    console.warn('Could not reset demo:', e);
  }
}

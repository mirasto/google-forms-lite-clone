// Global Props Interface for React Components
// This replaces React.FC and other inline component typing
export interface Props {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------
// Data Models (Migrated from types.ts)
// ----------------------------------------------------------------------

export const QuestionType = {
  TEXT: 'TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  CHECKBOX: 'CHECKBOX',
  DATE: 'DATE',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  required?: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  values: string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

export interface CreateFormInput {
  title: string;
  description?: string;
  questions: Omit<Question, 'id'>[];
}

export interface SubmitResponseInput {
  formId: string;
  answers: { questionId: string; values: string[] }[];
}

// ----------------------------------------------------------------------
// Store Types (Migrated from store/store.ts)
// ----------------------------------------------------------------------

import { store } from './store/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ----------------------------------------------------------------------
// Hook Specific Types (Migrated from useFormBuilder.ts)
// ----------------------------------------------------------------------

export interface DraftOption {
  id: string;
  value: string;
}

export interface DraftQuestion extends Omit<Question, 'id'> {
  tempId: string;
  options?: DraftOption[];
}

// ----------------------------------------------------------------------
// Store Types (Migrated from store/store.ts)
// ----------------------------------------------------------------------

// We can't import store here to avoid circular dependencies if store imports types.
// However, typically RootState/AppDispatch are derived from the store instance.
// For this migration, we will define them in store.ts and re-export or just keep them there
// if they depend on the runtime store object, BUT the prompt asks to centralize types.
// A common pattern to avoid circular deps with Redux inference is to keep them in store.ts
// OR to separate the store creation.
// Given the prompt: "All types must be defined in type.ts", we will attempt to
// declare interfaces that match the Redux state, OR we accept that for Redux inference,
// we might need to keep specific inference types near the store, but we can export them.

// For now, let's keep Redux inference in store.ts but we can define the SHAPE here if needed.
// But Redux best practice is inference. We will stick to the plan of moving what we can.
// Since RootState depends on the implementation of the store, moving it here requires importing the store.
// Let's defer Redux types to be imported FROM store.ts INTO here if we want a single entry point,
// or simply allow store.ts to be the exception for INFERRED types, but explicit types go here.

// ----------------------------------------------------------------------
// Type Guards (Migrated from types.ts)
// ----------------------------------------------------------------------

export function isQuestionType(value: unknown): value is QuestionType {
  return typeof value === 'string' && Object.values(QuestionType).includes(value as QuestionType);
}

export function isQuestion(value: unknown): value is Question {
  if (typeof value !== 'object' || value === null) return false;
  const q = value as Question;
  return (
    typeof q.id === 'string' &&
    typeof q.text === 'string' &&
    isQuestionType(q.type)
  );
}

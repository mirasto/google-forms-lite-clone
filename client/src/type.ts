import React from 'react';
export interface Props {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

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

import { store } from './store/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface DraftOption {
  id: string;
  value: string;
}

export interface DraftQuestion extends Omit<Question, 'id'> {
  tempId: string;
  options?: DraftOption[];
}

export function isQuestionType(value: unknown): value is QuestionType {
  return typeof value === 'string' && Object.values(QuestionType).includes(value as QuestionType);
}

export function isQuestion(value: unknown): value is Question {
  if (typeof value !== 'object' || value === null) return false;
  const q = value as Question;
  return typeof q.id === 'string' && typeof q.text === 'string' && isQuestionType(q.type);
}

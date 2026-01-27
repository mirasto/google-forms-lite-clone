import {
  QuestionType,
  type Question,
  type Option,
  type Form,
  type Answer,
  type Response,
  type QuestionInput,
  type CreateFormInput,
  type AnswerInput,
  type SubmitResponseInput,
} from '@forms/shared';

export { QuestionType };
export type {
  Question,
  Option,
  Form,
  Answer,
  Response,
  QuestionInput,
  CreateFormInput,
  AnswerInput,
  SubmitResponseInput,
};
import React from 'react';
import { store } from '../store/store';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type DraftOption = Option;

export interface DraftQuestion extends Omit<Question, 'id' | 'options'> {
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

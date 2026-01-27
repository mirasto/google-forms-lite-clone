import React from 'react';
import { store } from '@store/store';
import {
  QuestionType,
  type Form,
  type Response,
  type Question,
  type Option,
  type Answer,
  type QuestionInput,
  type AnswerInput,
  type CreateFormMutationVariables,
  type SubmitResponseMutationVariables
} from '@store/api.generated';
export type CreateFormInput = CreateFormMutationVariables;
export type SubmitResponseInput = SubmitResponseMutationVariables;

export { QuestionType };
export type {
  Question,
  Option,
  Form,
  Answer,
  Response,
  QuestionInput,
  AnswerInput,
};

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
  
  const candidate = value as Record<string, unknown>;
  
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    isQuestionType(candidate.type)
  );
}

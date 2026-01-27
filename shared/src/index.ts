export const QuestionType = {
  TEXT: 'TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  CHECKBOX: 'CHECKBOX',
  DATE: 'DATE',
} as const;

export type QuestionType = keyof typeof QuestionType;

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  required: boolean;
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

export interface QuestionInput {
  text: string;
  type: QuestionType;
  options?: Option[];
  required: boolean;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  questions: QuestionInput[];
}

export interface AnswerInput {
  questionId: string;
  values: string[];
}

export interface SubmitResponseInput {
  formId: string;
  answers: AnswerInput[];
}

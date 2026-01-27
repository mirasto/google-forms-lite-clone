import type { GraphQLResolveInfo } from 'graphql';

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

export interface Context {
  userId?: string;
}

export type ResolverFn<TResult, TParent = {}, TArgs = {}> = (
  parent: TParent,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export interface Resolvers {
  Query: {
    forms: ResolverFn<Form[]>;
    form: ResolverFn<Form | null, {}, { id: string }>;
    responses: ResolverFn<Response[], {}, { formId: string }>;
  };
  Mutation: {
    createForm: ResolverFn<Form, {}, CreateFormInput>;
    submitResponse: ResolverFn<Response, {}, SubmitResponseInput>;
  };
  Answer?: {
    value: ResolverFn<string | null, Answer>;
  };
  [key: string]: unknown;
}

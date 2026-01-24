export const QuestionType = {
  TEXT: 'TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  CHECKBOX: 'CHECKBOX',
  DATE: 'DATE',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
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

export interface QuestionInput {
  text: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export interface AnswerInput {
  questionId: string;
  values: string[];
}

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: any
) => Promise<TResult> | TResult;

export interface Resolvers {
  Query: {
    forms: ResolverFn<Form[], any, any, any>;
    form: ResolverFn<Form | undefined, any, any, { id: string }>;
    responses: ResolverFn<Response[], any, any, { formId: string }>;
  };
  Mutation: {
    createForm: ResolverFn<Form, any, any, { title: string; description?: string; questions?: QuestionInput[] }>;
    submitResponse: ResolverFn<Response, any, any, { formId: string; answers: AnswerInput[] }>;
  };
}

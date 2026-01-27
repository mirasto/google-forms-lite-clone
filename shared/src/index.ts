/**
 * Supported question types as a read-only object for type safety and runtime checks.
 */
export const QuestionType = {
  TEXT: 'TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  CHECKBOX: 'CHECKBOX',
  DATE: 'DATE',
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

/**
 * Represents a choice option for MULTIPLE_CHOICE or CHECKBOX questions.
 */
export interface Option {
  readonly id: string;
  readonly value: string;
}

/**
 * Base properties shared by all question types.
 */
interface QuestionBase {
  readonly id: string;
  readonly text: string;
  readonly required: boolean;
}

export interface TextQuestion extends QuestionBase {
  readonly type: typeof QuestionType.TEXT;
  readonly options?: never;
}

export interface DateQuestion extends QuestionBase {
  readonly type: typeof QuestionType.DATE;
  readonly options?: never;
}

export interface ChoiceQuestion extends QuestionBase {
  readonly type: typeof QuestionType.MULTIPLE_CHOICE | typeof QuestionType.CHECKBOX;
  readonly options: readonly Option[];
}
export type Question = TextQuestion | DateQuestion | ChoiceQuestion;

export interface Form {
  readonly id: string;
  readonly title: string;
  readonly description?: string; 
  readonly questions: readonly Question[];
  readonly createdAt: string;
}

export interface Answer {
  readonly questionId: string;
  readonly values: readonly string[];
}

export interface Response {
  readonly id: string;
  readonly formId: string;
  readonly answers: readonly Answer[];
  readonly createdAt: string;
}
export type OptionInput = Omit<Option, 'id'> & { id?: string };

export type QuestionInput =
  | (Omit<TextQuestion, 'id' | 'options'> & { id?: string; options?: never })
  | (Omit<DateQuestion, 'id' | 'options'> & { id?: string; options?: never })
  | (Omit<ChoiceQuestion, 'id' | 'options'> & { id?: string; options: OptionInput[] });

export interface CreateFormInput {
  readonly title: string;
  readonly description?: string;
  readonly questions: readonly QuestionInput[];
}

export interface AnswerInput {
  readonly questionId: string;
  readonly values: readonly string[];
}

export interface SubmitResponseInput {
  readonly formId: string;
  readonly answers: readonly AnswerInput[];
}
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

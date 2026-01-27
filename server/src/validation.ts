import { z } from 'zod';
import { QuestionType } from './types.js';
import { VALIDATION_LIMITS } from './constants.js';

const {
  TEXT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  DESC_MAX_LENGTH,
  OPTION_MAX_LENGTH,
  MAX_QUESTIONS,
  MAX_ANSWERS,
  MAX_ANSWER_VALUES
} = VALIDATION_LIMITS;

const textBaseSchema = z.string()
  .trim()
  .min(1, 'Text is required')
  .max(TEXT_MAX_LENGTH, `Text exceeds ${TEXT_MAX_LENGTH} characters`);

const optionSchema = z.object({
  id: z.string().uuid().optional(),
  value: z.string()
    .trim()
    .min(1, 'Option value cannot be empty')
    .max(OPTION_MAX_LENGTH, `Option value exceeds ${OPTION_MAX_LENGTH} characters`),
});

const questionBase = z.object({
  text: textBaseSchema,
  required: z.boolean(),
});

const questionSchema = z.discriminatedUnion('type', [
  questionBase.extend({
    type: z.literal(QuestionType.TEXT),
    options: z.undefined().optional(),
  }),
  questionBase.extend({
    type: z.literal(QuestionType.DATE),
    options: z.undefined().optional(),
  }),
  questionBase.extend({
    type: z.literal(QuestionType.MULTIPLE_CHOICE),
    options: z.array(optionSchema).min(1, 'Multiple choice questions must have at least one option'),
  }),
  questionBase.extend({
    type: z.literal(QuestionType.CHECKBOX),
    options: z.array(optionSchema).min(1, 'Checkbox questions must have at least one option'),
  }),
]);

export const createFormSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(TITLE_MAX_LENGTH, `Title is too long (max ${TITLE_MAX_LENGTH} chars)`),
  description: z.string()
    .max(DESC_MAX_LENGTH, 'Description is too long')
    .optional()
    .nullable()
    .transform(val => val ?? undefined),
  questions: z.array(questionSchema)
    .min(1, 'Form must have at least one question')
    .max(MAX_QUESTIONS, `Too many questions (max ${MAX_QUESTIONS})`),
});


const answerSchema = z.object({
  questionId: z.string().uuid('Invalid question ID format'),
  values: z.array(
    z.string().max(DESC_MAX_LENGTH, 'Answer value is too long')
  ).max(MAX_ANSWER_VALUES, 'Too many values'),
});

export const submitResponseSchema = z.object({
  formId: z.string().uuid('Invalid form ID format'),
  answers: z.array(answerSchema).max(MAX_ANSWERS, 'Too many answers'),
});


export type CreateFormInput = z.infer<typeof createFormSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
export type QuestionInputSchema = z.infer<typeof questionSchema>;

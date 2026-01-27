import { z } from 'zod';
import { QuestionType } from './types.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long (max 200 chars)'),
  description: z.string().max(2000, 'Description is too long (max 2000 chars)').optional().nullable(), 
  questions: z.array(z.object({
    text: z.string().trim().min(1, 'Question text is required').max(500, 'Question text is too long (max 500 chars)'),
    type: z.enum([
      QuestionType.TEXT,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.CHECKBOX,
      QuestionType.DATE
    ]),
    options: z.array(z.object({
      id: z.string().regex(uuidRegex, 'Invalid Option ID').optional().nullable(),
      value: z.string().trim().min(1, 'Option value cannot be empty').max(200, 'Option value is too long (max 200 chars)')
    })).optional().nullable(),
    required: z.boolean()
  })).min(1, 'Form must have at least one question').max(100, 'Too many questions (max 100)')
}).superRefine((data, ctx) => {
  data.questions.forEach((question, index) => {
    if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) {
      if (!question.options || question.options.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: `Question "${question.text}" must have options`,
          path: ['questions', index, 'options']
        });
        return;
      }
      const values = question.options.map(o => o.value);
      const uniqueValues = new Set(values);
      if (uniqueValues.size !== values.length) {
        ctx.addIssue({
          code: 'custom',
          message: `Options for question "${question.text}" must be unique`,
          path: ['questions', index, 'options']
        });
      }
    } else {
    }
  });
}).transform((data) => {
  return {
    ...data,
    questions: data.questions.map(q => {
      if (q.type === QuestionType.TEXT || q.type === QuestionType.DATE) {
        return { ...q, options: undefined };
      }
      return q;
    })
  };
});

export const submitResponseSchema = z.object({
  formId: z.string().regex(uuidRegex, 'Invalid Form ID').min(1, 'Form ID is required'),
  answers: z.array(z.object({
    questionId: z.string().regex(uuidRegex, 'Invalid Question ID').min(1, 'Question ID is required'),
    values: z.array(z.string().max(2000, 'Answer is too long (max 2000 chars)')).max(10, 'Too many selected options')
  })).max(500, 'Too many answers')
});

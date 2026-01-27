import { z } from 'zod';
import { QuestionType } from './types';

export const createFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional().nullable(), 
  questions: z.array(z.object({
    text: z.string().trim().min(1, 'Question text is required'),
    type: z.enum([
      QuestionType.TEXT,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.CHECKBOX,
      QuestionType.DATE
    ]),
    options: z.array(z.object({
      id: z.string().optional().nullable(),
      value: z.string().trim().min(1, 'Option value cannot be empty')
    })).optional().nullable(),
    required: z.boolean()
  })).min(1, 'Form must have at least one question')
}).superRefine((data, ctx) => {
  data.questions.forEach((q, index) => {
    if ((q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX) && (!q.options || q.options.length === 0)) {
      ctx.addIssue({
        code: 'custom',
        message: `Question "${q.text}" must have options`,
        path: ['questions', index, 'options']
      });
    }
  });
});

export const submitResponseSchema = z.object({
  formId: z.string().min(1, 'Form ID is required'),
  answers: z.array(z.object({
    questionId: z.string().min(1, 'Question ID is required'),
    values: z.array(z.string())
  }))
});

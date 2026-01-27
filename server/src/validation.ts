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
    // Validation for question types that require options
    if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) {
      if (!question.options || question.options.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: `Question "${question.text}" must have options`,
          path: ['questions', index, 'options']
        });
        return; // Skip uniqueness check if no options
      }

      // Check for unique option values
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
      // Clear options for types that don't support them (TEXT, DATE)
      // Note: We cannot directly modify 'data' in superRefine in a way that affects the output of parse() 
      // without using .transform(). However, superRefine is for validation.
      // To strip data, we should use a transform before or after.
      // But since we are inside Zod pipeline, let's just validate that they shouldn't be there or ignore them.
      // The user asked to "remove (nullify)" them. 
      // We'll handle this by adding a transform step to the schema.
    }
  });
}).transform((data) => {
  // Transformation step to clean up data
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

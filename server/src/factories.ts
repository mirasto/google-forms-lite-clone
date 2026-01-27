import { v4 as uuidv4 } from 'uuid';
import type {
  Form,
  QuestionInput,
  Response,
  AnswerInput,
} from './types.js';

/**
 * Creates a new Form entity with generated IDs for the form, questions, and options.
 * 
 * @param title - The title of the form
 * @param description - Optional description of the form
 * @param questions - Array of questions to include in the form
 * @returns A fully initialized Form object
 */
export const createForm = (
  title: string,
  description: string | null | undefined,
  questions: QuestionInput[]
): Form => ({
  id: uuidv4(),
  title,
  description: description ?? null,
  questions: questions.map((question) => ({
    ...question,
    id: uuidv4(),
    // Ensure options have IDs if provided, otherwise generate them
    options: question.options?.map((option) => ({ 
      ...option, 
      id: option.id || uuidv4() 
    })) ?? undefined,
  })),
  createdAt: new Date().toISOString(),
});

/**
 * Creates a new Response entity for a specific form.
 * 
 * @param formId - The ID of the form being responded to
 * @param answers - Array of answers provided by the user
 * @returns A fully initialized Response object
 */
export const createResponse = (
  formId: string,
  answers: AnswerInput[]
): Response => ({
  id: uuidv4(),
  formId,
  answers: answers.map((answer) => ({
    questionId: answer.questionId,
    values: answer.values ?? [],
  })),
  createdAt: new Date().toISOString(),
});

import { v4 as uuidv4 } from 'uuid';
import type {
  Form,
  QuestionInput,
  Response,
  AnswerInput,
} from './types.js';
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
    options: question.options?.map((option) => ({ 
      ...option, 
      id: option.id || uuidv4() 
    })) ?? undefined,
  })),
  createdAt: new Date().toISOString(),
});
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

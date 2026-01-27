import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  Question,
  QuestionInput,
  Response,
  AnswerInput,
  QuestionType,
  assertNever,
} from './types.js';


const mapQuestionInputToQuestion = (input: QuestionInput): Question => {
  const common = {
    id: uuidv4(),
    text: input.text,
    required: input.required,
  };

  switch (input.type) {
    case QuestionType.TEXT:
      return { ...common, type: QuestionType.TEXT };

    case QuestionType.DATE:
      return { ...common, type: QuestionType.DATE };

    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.CHECKBOX:
      return {
        ...common,
        type: input.type,
 
        options: input.options.map((opt) => ({
          id: opt.id || uuidv4(),
          value: opt.value,
        })),
      };

    default:

      return assertNever(input);
  }
};

export const createForm = (
  title: string,
  description: string | undefined,
  questions: QuestionInput[]
): Form => ({
  id: uuidv4(),
  title,
  description,
  questions: questions.map(mapQuestionInputToQuestion),
  createdAt: new Date().toISOString(),
});


export const createResponse = (
  formId: string,
  answers: AnswerInput[]
): Response => ({
  id: uuidv4(),
  formId,
  answers: answers.map(({ questionId, values }) => ({
    questionId,
    values,
  })),
  createdAt: new Date().toISOString(),
});
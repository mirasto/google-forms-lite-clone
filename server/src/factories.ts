import { v4 as uuidv4 } from 'uuid';
import { Form, Question, Response, QuestionInput, AnswerInput } from './types';

export const createForm = (title: string, description: string | undefined, questions: QuestionInput[]): Form => ({
    id: uuidv4(),
    title,
    description,
    questions: questions.map(q => ({
        ...q,
        id: uuidv4(),
        options: q.options?.map(o => ({ ...o, id: uuidv4() }))
    })),
});

export const createResponse = (formId: string, answers: AnswerInput[]): Response => ({
    id: uuidv4(),
    formId,
    answers: answers.map(a => ({
        questionId: a.questionId,
        values: a.values || [],
    })),
});

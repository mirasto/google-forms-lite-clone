import { type DraftQuestion, type QuestionInput } from '@types';

export const formatQuestionsForSubmission = (questions: DraftQuestion[]): QuestionInput[] => {
  return questions.map((question) => ({
    text: question.text,
    type: question.type,
    required: question.required,
    options: question.options?.filter((option) => option.value.trim()) || [],
  }));
};

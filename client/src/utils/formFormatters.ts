import { type DraftQuestion, type QuestionInput } from '@types';

export const formatQuestionsForSubmission = (questions: DraftQuestion[]): QuestionInput[] => {
  return questions.map((q) => ({
    text: q.text,
    type: q.type,
    required: q.required,
    options: q.options?.filter((option) => option.value.trim()) || [],
  }));
};

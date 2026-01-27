import { QuestionType, type DraftQuestion, type QuestionInput } from '@types';

export const formatQuestionsForSubmission = (questions: DraftQuestion[]): QuestionInput[] => {
  return questions.map((question) => {
    const common = {
      text: question.text,
      type: question.type,
      required: question.required,
    };

    if (question.type === QuestionType.MultipleChoice || question.type === QuestionType.Checkbox) {
      return {
        ...common,
        options: question.options?.filter((option) => option.value.trim()) || [],
      };
    }

    return common;
  });
};

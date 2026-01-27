import { type DraftQuestion, type QuestionInput } from '@types';

export const formatQuestionsForSubmission = (questions: DraftQuestion[]): QuestionInput[] => {
    return questions.map(({ tempId, options, ...rest }) => ({
        ...rest,
        options: options?.filter((option) => option.value.trim()) || [],
    }));
};

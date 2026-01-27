import { type DraftQuestion } from '@types';

export const formatQuestionsForSubmission = (questions: DraftQuestion[]) => {
    return questions.map(({ tempId, options, ...rest }) => ({
        ...rest,
        options: options?.filter((option) => option.value.trim()) || [],
    }));
};

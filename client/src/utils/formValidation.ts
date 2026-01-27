import { QuestionType, type DraftQuestion } from '@types';
import { VALIDATION_MESSAGES } from '../constants';

export const validateForm = (title: string, questions: DraftQuestion[]): string | null => {
    if (!title.trim()) return VALIDATION_MESSAGES.NO_TITLE;
    if (questions.length === 0) return VALIDATION_MESSAGES.MIN_ONE_QUESTION;

    for (const question of questions) {
        if (!question.text.trim()) return VALIDATION_MESSAGES.EMPTY_QUESTION_TEXT;

        const isChoiceType = question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX;
        if (isChoiceType) {
            const hasValidOptions = question.options?.some((opt) => opt.value.trim());
            if (!hasValidOptions) return VALIDATION_MESSAGES.MIN_ONE_OPTION;
        }
    }
    return null;
};

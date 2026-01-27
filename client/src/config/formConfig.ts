import { QuestionType } from '@types';

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.TEXT]: 'Short Answer',
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionType.CHECKBOX]: 'Checkboxes',
  [QuestionType.DATE]: 'Date',
};

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = Object.values(QuestionType).map((type) => ({
  value: type,
  label: QUESTION_TYPE_LABELS[type],
}));

import { QuestionType } from '@types';

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.Text]: 'Short Answer',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Checkbox]: 'Checkboxes',
  [QuestionType.Date]: 'Date',
};

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = Object.values(QuestionType).map((type) => ({
  value: type,
  label: QUESTION_TYPE_LABELS[type],
}));

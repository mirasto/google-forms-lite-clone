import { v4 as uuidv4 } from 'uuid';
import { QuestionType, type DraftQuestion, type DraftOption } from '@types';

export const createDraftQuestion = (overrides: Partial<DraftQuestion> = {}): DraftQuestion => ({
    tempId: uuidv4(),
    text: '',
    type: QuestionType.Text,
    options: [],
    required: false,
    ...overrides,
});

export const createDraftOption = (value = ''): DraftOption => ({
    id: uuidv4(),
    value,
});

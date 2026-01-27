import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useCreateFormMutation } from '../store/api';
import { QuestionType, type DraftQuestion } from '@types';
import { VALIDATION_MESSAGES, API_MESSAGES } from '../constants';
import { createDraftQuestion, createDraftOption } from '../utils/formFactories';

const updateAtIndex = <T>(list: T[], index: number, updates: Partial<T>): T[] => {
  const next = [...list];
  next[index] = { ...next[index], ...updates };
  return next;
};

export const useFormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    createDraftQuestion(),
  ]);

  const addQuestion = (): void => {
    setQuestions((prev) => [...prev, createDraftQuestion()]);
  };

  const updateQuestion = <K extends keyof Omit<DraftQuestion, 'tempId' | 'options'>>(
    index: number,
    field: K,
    value: DraftQuestion[K]
  ): void => {
    setQuestions((prev) => updateAtIndex(prev, index, { [field]: value }));
  };

  const removeQuestion = (index: number): void => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number): void => {
    setQuestions((prev) => {
      const currentOptions = prev[qIndex].options || [];
      const newOptions = [...currentOptions, createDraftOption()];
      return updateAtIndex(prev, qIndex, { options: newOptions });
    });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string): void => {
    setQuestions((prev) => {
      const question = prev[qIndex];
      if (!question.options) return prev;

      const newOptions = updateAtIndex(question.options, oIndex, { value });
      return updateAtIndex(prev, qIndex, { options: newOptions });
    });
  };

  const removeOption = (qIndex: number, oIndex: number): void => {
    setQuestions((prev) => {
      const question = prev[qIndex];
      if (!question.options) return prev;

      const newOptions = question.options.filter((_, i) => i !== oIndex);
      return updateAtIndex(prev, qIndex, { options: newOptions });
    });
  };

  const validateForm = (): string | null => {
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

  const saveForm = async (): Promise<void> => {
    const validationError = validateForm();
    if (validationError) {
      Notify.failure(validationError);
      return;
    }

    try {
      const formattedQuestions = questions.map(({ tempId, options, ...rest }) => ({
        ...rest,
        options: options?.filter((option) => option.value.trim()) || [],
      }));

      await createForm({ title, description, questions: formattedQuestions }).unwrap();
      Notify.success(API_MESSAGES.CREATE_SUCCESS);
      navigate('/');
    } catch (err) {
      console.error('Failed to create form', err);
      Notify.failure(API_MESSAGES.CREATE_ERROR);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
    saveForm,
    isLoading,
  };
};

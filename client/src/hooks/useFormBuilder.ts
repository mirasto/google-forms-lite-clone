import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useCreateFormMutation } from '../store/api';
import { type DraftQuestion } from '@types';
import { API_MESSAGES } from '../constants';
import { createDraftQuestion, createDraftOption } from '../utils/formFactories';
import { validateForm } from '../utils/formValidation';
import { formatQuestionsForSubmission } from '../utils/formFormatters';

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

  const saveForm = async (): Promise<void> => {
    const validationError = validateForm(title, questions);
    if (validationError) {
      Notify.failure(validationError);
      return;
    }

    try {
      const formattedQuestions = formatQuestionsForSubmission(questions);
      await createForm({ title, description, questions: formattedQuestions }).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to create form', err);
      if (err instanceof Error) {
        Notify.failure(err.message);
      } else {
        Notify.failure(API_MESSAGES.CREATE_ERROR);
      }
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

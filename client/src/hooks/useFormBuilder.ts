import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useCreateFormMutation } from '../store/api';
import { type DraftQuestion } from '@types';
import { API_MESSAGES } from '@constants';
import { createDraftQuestion, createDraftOption } from '../utils/formFactories';
import { validateForm } from '../utils/formValidation';
import { formatQuestionsForSubmission } from '../utils/formFormatters';

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
    id: string,
    field: K,
    value: DraftQuestion[K]
  ): void => {
    setQuestions((prev) => 
      prev.map((q) => (q.tempId === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (id: string): void => {
    setQuestions((prev) => prev.filter((q) => q.tempId !== id));
  };

  const addOption = (qId: string): void => {
    setQuestions((prev) => 
      prev.map((q) => 
        q.tempId === qId 
          ? { ...q, options: [...(q.options || []), createDraftOption()] }
          : q
      )
    );
  };

  const updateOption = (qId: string, oId: string, value: string): void => {
    setQuestions((prev) => 
      prev.map((q) => 
        q.tempId === qId && q.options
          ? {
              ...q,
              options: q.options.map((o) => (o.id === oId ? { ...o, value } : o)),
            }
          : q
      )
    );
  };

  const removeOption = (qId: string, oId: string): void => {
    setQuestions((prev) => 
      prev.map((q) => 
        q.tempId === qId && q.options
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== oId),
            }
          : q
      )
    );
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

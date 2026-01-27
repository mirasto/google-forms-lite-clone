import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useCreateFormMutation } from '@store/api.enhanced';
import { type DraftQuestion } from '@types';

import { API_MESSAGES } from '@constants';

import { createDraftQuestion, createDraftOption } from '@utils/formFactories';
import { validateForm } from '@utils/formValidation';
import { formatQuestionsForSubmission } from '@utils/formFormatters';

export const useFormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    createDraftQuestion(),
  ]);

  const addQuestion = (): void => {
    setQuestions((prevQuestions) => [...prevQuestions, createDraftQuestion()]);
  };

  const updateQuestion = <K extends keyof Omit<DraftQuestion, 'tempId' | 'options'>>(
    id: string,
    field: K,
    value: DraftQuestion[K]
  ): void => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((question) => (question.tempId === id ? { ...question, [field]: value } : question))
    );
  };

  const removeQuestion = (id: string): void => {
    setQuestions((prevQuestions) => prevQuestions.filter((question) => question.tempId !== id));
  };

  const addOption = (questionId: string): void => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((question) => 
        question.tempId === questionId 
          ? { ...question, options: [...(question.options || []), createDraftOption()] }
          : question
      )
    );
  };

  const updateOption = (questionId: string, optionId: string, value: string): void => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((question) => 
        question.tempId === questionId && question.options
          ? {
              ...question,
              options: question.options.map((option) => (option.id === optionId ? { ...option, value } : option)),
            }
          : question
      )
    );
  };

  const removeOption = (questionId: string, optionId: string): void => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((question) => 
        question.tempId === questionId && question.options
          ? {
              ...question,
              options: question.options.filter((option) => option.id !== optionId),
            }
          : question
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
    } catch (error) {
      if (error instanceof Error) {
        Notify.failure(error.message);
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

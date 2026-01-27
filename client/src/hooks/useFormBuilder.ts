import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useCreateFormMutation } from '../store/api';
import { QuestionType, type DraftQuestion } from '../type';
import { VALIDATION_MESSAGES, API_MESSAGES } from '../constants';

export const useFormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
  ]);

  const addQuestion = (): void => {
    setQuestions((prev) => [
      ...prev,
      { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
    ]);
  };

  const updateQuestion = <K extends keyof Omit<DraftQuestion, 'tempId' | 'options'>>(
    index: number,
    field: K,
    value: DraftQuestion[K]
  ): void => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeQuestion = (index: number): void => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = (qIndex: number): void => {
    setQuestions((prev) => {
      const next = [...prev];
      const currentOptions = next[qIndex].options || [];
      next[qIndex] = {
        ...next[qIndex],
        options: [...currentOptions, { id: uuidv4(), value: '' }],
      };
      return next;
    });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string): void => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIndex].options) {
        const nextOptions = [...next[qIndex].options!];
        nextOptions[oIndex] = { ...nextOptions[oIndex], value };
        next[qIndex] = { ...next[qIndex], options: nextOptions };
      }
      return next;
    });
  };

  const removeOption = (qIndex: number, oIndex: number): void => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIndex].options) {
        next[qIndex] = {
          ...next[qIndex],
          options: next[qIndex].options!.filter((_, i) => i !== oIndex),
        };
      }
      return next;
    });
  };

  const saveForm = async (): Promise<void> => {
    if (!title.trim()) {
      Notify.failure(VALIDATION_MESSAGES.NO_TITLE);
      return;
    }
    if (questions.length === 0) {
      Notify.failure(VALIDATION_MESSAGES.MIN_ONE_QUESTION);
      return;
    }
    for (const question of questions) {
      if (!question.text.trim()) {
        Notify.failure(VALIDATION_MESSAGES.EMPTY_QUESTION_TEXT);
        return;
      }
      if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) {
        const validOptions = question.options?.filter((option) => option.value.trim()) || [];
        if (validOptions.length === 0) {
          Notify.failure(VALIDATION_MESSAGES.MIN_ONE_OPTION);
          return;
        }
      }
    }

    try {
      const formattedQuestions = questions.map(({ tempId, ...rest }) => ({
        ...rest,
        options: rest.options?.filter((option) => option.value.trim()) || [],
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

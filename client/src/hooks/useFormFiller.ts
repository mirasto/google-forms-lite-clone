import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { useGetFormQuery, useSubmitResponseMutation } from '@store/api.enhanced';

import { VALIDATION_MESSAGES, API_MESSAGES } from '@constants';

export const useFormFiller = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isFormLoading, error: formError } = useGetFormQuery({ id: id! });
  const form = data?.form;
  const [submitResponse, { isLoading: isSubmitting, isSuccess }] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (questionId: string) => {
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const handleInputChange = (questionId: string, value: string): void => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [value],
    }));
    clearError(questionId);
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean): void => {
    setAnswers((prev) => {
      const currentValues = prev[questionId] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((existingValue) => existingValue !== value);
      
      return {
        ...prev,
        [questionId]: newValues,
      };
    });
    clearError(questionId);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form) return;

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    form.questions.forEach((question) => {
      const answer = answers[question.id];
      if (question.required) {
       
        const isValid = Array.isArray(answer) && answer.length > 0 && answer.some(value => value.trim() !== '');
        
        if (!isValid) {
          newErrors[question.id] = VALIDATION_MESSAGES.REQUIRED_FIELD;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(`question-${firstErrorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const answersList = Object.entries(answers).map(([questionId, values]) => ({
      questionId,
      values,
    }));

    try {
      await submitResponse({
        formId: form.id,
        answers: answersList,
      }).unwrap();
    } catch {
      Notify.failure(API_MESSAGES.SUBMIT_ERROR);
    }
  };

  return {
    form,
    isFormLoading,
    formError,
    isSubmitting,
    isSuccess,
    answers,
    errors,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  };
};

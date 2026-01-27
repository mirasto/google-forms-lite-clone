import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useGetFormQuery, useSubmitResponseMutation } from '../store/api';
import { VALIDATION_MESSAGES, API_MESSAGES } from '../constants';

export const useFormFiller = () => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: isFormLoading, error: formError } = useGetFormQuery(id!);
  const [submitResponse, { isLoading: isSubmitting, isSuccess }] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (questionId: string) => {
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
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
      let newValues: string[];
      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter((existingValue) => existingValue !== value);
      }
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
      if (question.required && (!answer || answer.length === 0 || !answer[0].trim())) {
        newErrors[question.id] = VALIDATION_MESSAGES.REQUIRED_FIELD;
        hasErrors = true;
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
      Notify.success(API_MESSAGES.SUBMIT_SUCCESS);
    } catch (err) {
      console.error('Failed to submit response', err);
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

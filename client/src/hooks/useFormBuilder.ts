import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useCreateFormMutation } from '../store/api';
import { QuestionType, type DraftQuestion } from '../type';

export const useFormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
  ]);

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
    ]);
  };

  const updateQuestion = <K extends keyof Omit<DraftQuestion, 'tempId' | 'options'>>(
    index: number, 
    field: K, 
    value: DraftQuestion[K]
  ): void => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number): void => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number): void => {
    const newQuestions = [...questions];
    const currentOptions = newQuestions[qIndex].options || [];
    newQuestions[qIndex].options = [...currentOptions, { id: uuidv4(), value: '' }];
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string): void => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options![oIndex].value = value;
      setQuestions(newQuestions);
    }
  };

  const removeOption = (qIndex: number, oIndex: number): void => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options!.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const saveForm = async (): Promise<void> => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (questions.length === 0) {
      alert('At least one question is required');
      return;
    }
    for (const question of questions) {
      if (!question.text.trim()) {
        alert('All questions must have text');
        return;
      }
      if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) {
        const validOptions = question.options?.filter(option => option.value.trim()) || [];
        if (validOptions.length === 0) {
          alert('Multiple choice and checkbox questions must have at least one valid option');
          return;
        }
      }
    }

    try {

      const formattedQuestions = questions.map(({ tempId, ...rest }) => ({
        ...rest,
        options: rest.options?.filter(option => option.value.trim()) || []
      }));
      
      await createForm({ title, description, questions: formattedQuestions }).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to create form', err);
      alert('Failed to create form');
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

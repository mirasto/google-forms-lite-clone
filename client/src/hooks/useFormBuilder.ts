import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useCreateFormMutation } from '../store/api';
import { QuestionType, type q } from '../types';

export interface DraftOption {
  id: string;
  value: string;
}

export interface DraftQuestion extends Omit<q, 'id' | 'options'> {
  tempId: string;
  options?: DraftOption[];
}

export const useFormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { tempId: uuidv4(), text: '', type: QuestionType.TEXT, options: [], required: false },
    ]);
  };

  const updateQuestion = <K extends keyof Omit<DraftQuestion, 'tempId' | 'options'>>(
    index: number, 
    field: K, 
    value: DraftQuestion[K]
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    const currentOptions = newQuestions[qIndex].options || [];
    newQuestions[qIndex].options = [...currentOptions, { id: uuidv4(), value: '' }];
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options![oIndex].value = value;
      setQuestions(newQuestions);
    }
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options!.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (questions.length === 0) {
      alert('At least one q is required');
      return;
    }
    for (const q of questions) {
      if (!q.text.trim()) {
        alert('All questions must have text');
        return;
      }
      if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX) {
        const validOptions = q.options?.filter(o => o.value.trim()) || [];
        if (validOptions.length === 0) {
          alert('Multiple choice and checkbox questions must have at least one valid o');
          return;
        }
      }
    }

    try {

      const formattedQuestions = questions.map(({ tempId, options, ...rest }) => ({
        ...rest,
        options: options?.filter(o => o.value.trim()).map(o => o.value) || []
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

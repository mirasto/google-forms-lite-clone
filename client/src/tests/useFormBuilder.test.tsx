import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { QuestionType } from '@types';
import * as reactRouterDom from 'react-router-dom';
import type { Mock } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

const mockCreateForm = vi.fn();
vi.mock('../store/api', () => ({
  useCreateFormMutation: () => [mockCreateForm, { isLoading: false }],
  api: {
    reducerPath: 'api',
    reducer: () => ({}),
    middleware: {
      concat: vi.fn(() => []),
    }
  }
}));

vi.mock('@reduxjs/toolkit', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    configureStore: () => ({
      getState: () => ({}),
      dispatch: vi.fn(),
    }),
  };
});

const mockNotifyFailure = vi.fn();
const mockNotifySuccess = vi.fn();

vi.mock('notiflix/build/notiflix-notify-aio', () => ({
  Notify: {
    failure: (...args: unknown[]) => mockNotifyFailure(...args),
    success: (...args: unknown[]) => mockNotifySuccess(...args),
  },
}));

describe('useFormBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (reactRouterDom.useNavigate as Mock).mockReturnValue(vi.fn());

    mockCreateForm.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  test('should fail validation if no valid options exist', async () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.setTitle('Test Form');
      const qId = result.current.questions[0].tempId;
      result.current.updateQuestion(qId, 'text', 'Question 1');
      result.current.updateQuestion(qId, 'type', QuestionType.MultipleChoice);
    });

    act(() => {
      const qId = result.current.questions[0].tempId;
      result.current.addOption(qId);
    });

    await act(async () => {
      await result.current.saveForm();
    });

    expect(mockNotifyFailure).toHaveBeenCalledWith('Multiple choice and checkbox questions must have at least one valid option');
    expect(mockCreateForm).not.toHaveBeenCalled();
  });

  test('should pass validation and filter out empty options if valid options exist', async () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.setTitle('Test Form');
      const questionId = result.current.questions[0].tempId;
      result.current.updateQuestion(questionId, 'text', 'Question 1');
      result.current.updateQuestion(questionId, 'type', QuestionType.MultipleChoice);
    });

    act(() => {
      const questionId = result.current.questions[0].tempId;
      result.current.addOption(questionId);
    });

    act(() => {
      const questionId = result.current.questions[0].tempId;
      const optionId = result.current.questions[0].options![0].id;
      result.current.updateOption(questionId, optionId, 'Option A');
    });

    act(() => {
      const questionId = result.current.questions[0].tempId;
      result.current.addOption(questionId);
    });

    await act(async () => {
      await result.current.saveForm();
    });

    expect(mockNotifyFailure).not.toHaveBeenCalled();
    expect(mockCreateForm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Form',
      questions: expect.arrayContaining([
        expect.objectContaining({
          text: 'Question 1',
          type: QuestionType.MultipleChoice,
          options: [{ id: expect.stringMatching(/.+/), value: 'Option A' }]
        })
      ])
    }));
  });
});


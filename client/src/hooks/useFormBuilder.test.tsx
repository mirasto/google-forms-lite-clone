// @ts-nocheck
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormBuilder } from './useFormBuilder';
import { QuestionType } from '../type';
import * as reactRouterDom from 'react-router-dom';


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
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    configureStore: () => ({
      getState: () => ({}),
      dispatch: vi.fn(),
    }),
  };
});


const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('useFormBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (reactRouterDom.useNavigate as any).mockReturnValue(vi.fn());

    mockCreateForm.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('should fail validation if no valid options exist', async () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.setTitle('Test Form');
      result.current.updateQuestion(0, 'text', 'Question 1');
      result.current.updateQuestion(0, 'type', QuestionType.MULTIPLE_CHOICE);
    });


    act(() => {
      result.current.addOption(0); 
    });

    await act(async () => {
      await result.current.saveForm();
    });

    expect(mockAlert).toHaveBeenCalledWith('Multiple choice and checkbox questions must have at least one valid option');
    expect(mockCreateForm).not.toHaveBeenCalled();
  });

  it('should pass validation and filter out empty options if valid options exist', async () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.setTitle('Test Form');
      result.current.updateQuestion(0, 'text', 'Question 1');
      result.current.updateQuestion(0, 'type', QuestionType.MULTIPLE_CHOICE);
    });


    act(() => {
      result.current.addOption(0);
      result.current.updateOption(0, 0, 'Option A');
    });

  
    act(() => {
      result.current.addOption(0); 
    });

    await act(async () => {
      await result.current.saveForm();
    });

    expect(mockAlert).not.toHaveBeenCalled();
    expect(mockCreateForm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Form',
      questions: expect.arrayContaining([
        expect.objectContaining({
          text: 'Question 1',
          type: QuestionType.MULTIPLE_CHOICE,
          options: ['Option A'] 
        })
      ])
    }));
  });
});

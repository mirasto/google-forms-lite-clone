import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useFormFiller } from '../hooks/useFormFiller';
import { QuestionType } from '@types';
import * as reactRouterDom from 'react-router-dom';
import type { Mock } from 'vitest';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@store/store', () => ({
  store: {
    getState: vi.fn(),
    dispatch: vi.fn(),
  }
}));

const mockGetFormQuery = vi.fn();
const mockSubmitResponse = vi.fn();

vi.mock('@store/api.enhanced', () => ({
  useGetFormQuery: (...args: unknown[]) => mockGetFormQuery(...args),
  useSubmitResponseMutation: () => [mockSubmitResponse, { isLoading: false, isSuccess: false }],
}));

vi.mock('notiflix/build/notiflix-notify-aio', () => ({
  Notify: {
    failure: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useFormFiller', () => {
  const mockForm = {
    id: 'form-123',
    title: 'Test Form',
    questions: [
      {
        id: 'q1',
        text: 'Checkbox Question',
        type: QuestionType.Checkbox,
        required: true,
        options: [
          { id: 'o1', value: 'Option 1' },
          { id: 'o2', value: 'Option 2' },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (reactRouterDom.useParams as Mock).mockReturnValue({ id: 'form-123' });
    mockGetFormQuery.mockReturnValue({
      data: { form: mockForm },
      isLoading: false,
      error: null,
    });
    mockSubmitResponse.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  test('should allow multiple selection for checkboxes using IDs', () => {
    const { result } = renderHook(() => useFormFiller());

    // Initial state: empty
    expect(result.current.answers['q1']).toBeUndefined();

    // Select Option 1 (by ID 'o1')
    act(() => {
      result.current.handleCheckboxChange('q1', 'o1', true);
    });

    expect(result.current.answers['q1']).toEqual(['o1']);

    // Select Option 2 (by ID 'o2')
    act(() => {
      result.current.handleCheckboxChange('q1', 'o2', true);
    });

    expect(result.current.answers['q1']).toEqual(['o1', 'o2']);
  });
  
  test('should allow deselecting options using IDs', () => {
     const { result } = renderHook(() => useFormFiller());
     
     // Select Option 1 and Option 2
     act(() => {
       result.current.handleCheckboxChange('q1', 'o1', true);
       result.current.handleCheckboxChange('q1', 'o2', true);
     });
     
     expect(result.current.answers['q1']).toEqual(['o1', 'o2']);
     
     // Deselect Option 1
     act(() => {
       result.current.handleCheckboxChange('q1', 'o1', false);
     });
     
     expect(result.current.answers['q1']).toEqual(['o2']);
  });

  test('should handle duplicate option values correctly by using IDs', () => {
     // Mock a form with duplicate values
     const mockFormDuplicates = {
       ...mockForm,
       questions: [{
         ...mockForm.questions[0],
         options: [
           { id: 'o1', value: 'A' },
           { id: 'o2', value: 'A' }
         ]
       }]
     };
     mockGetFormQuery.mockReturnValue({
        data: { form: mockFormDuplicates },
        isLoading: false,
        error: null,
     });

     const { result } = renderHook(() => useFormFiller());

     // Select first 'A' (ID 'o1')
     act(() => {
       result.current.handleCheckboxChange('q1', 'o1', true);
     });

     // Check that only o1 is selected in state
     expect(result.current.answers['q1']).toEqual(['o1']);
  });

  test('should submit mapped values instead of IDs', async () => {
      const { result } = renderHook(() => useFormFiller());
      
      act(() => {
        result.current.handleCheckboxChange('q1', 'o1', true);
        result.current.handleCheckboxChange('q1', 'o2', true);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockSubmitResponse).toHaveBeenCalledWith({
        formId: 'form-123',
        answers: [
          {
            questionId: 'q1',
            values: ['Option 1', 'Option 2'] // Mapped back to values
          }
        ]
      });
  });
});

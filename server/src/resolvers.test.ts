import { describe, it, expect, vi } from 'vitest';
import { resolvers } from './resolvers';
import { QuestionType } from './type';


vi.mock('uuid', () => ({
  v4: () => 'test-id',
}));

describe('Resolvers', () => {
  describe('createForm', () => {
    it('should create a new form with questions', async () => {
      const formInput = {
        title: 'Test Form',
        description: 'Test Description',
        questions: [
          {
            text: 'Question 1',
            type: QuestionType.TEXT,
            options: [],
            required: true,
          },
        ],
      };

      const result = await resolvers.Mutation.createForm(null, formInput, null, null);

      expect(result).toMatchObject({
        id: 'test-id',
        title: 'Test Form',
        description: 'Test Description',
      });
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0]).toMatchObject({
        text: 'Question 1',
        type: QuestionType.TEXT,
        required: true,
      });
    });
  });

  describe('submitResponse', () => {
    it('should submit a response to an existing form', async () => {

      const form = await resolvers.Mutation.createForm(null, {
        title: 'Response Test Form',
        questions: [{ text: 'Q1', type: QuestionType.TEXT }],
      }, null, null);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['Answer 1'],
          },
        ],
      };

      const result = await resolvers.Mutation.submitResponse(null, answerInput, null, null);

      expect(result).toMatchObject({
        id: 'test-id',
        formId: form.id,
      });
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].values).toEqual(['Answer 1']);
    });

    it('should throw error if form not found', () => {
      expect(() => {
        resolvers.Mutation.submitResponse(null, {
          formId: 'non-existent-id',
          answers: [],
        }, null, null);
      }).toThrow('Form not found');
    });
  });
});

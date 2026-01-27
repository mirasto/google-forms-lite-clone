import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from '../src/resolvers';
import { QuestionType } from '../src/types';
import { InMemoryStore } from '../src/store';


let idCounter = 0;
vi.mock('uuid', () => ({
  v4: () => {
    idCounter++;
    return `test-id-${idCounter}`;
  },
}));

describe('Resolvers', () => {
  let store: InMemoryStore;
  let context: { store: InMemoryStore; pubsub: { publish: any } };

  beforeEach(() => {
    store = new InMemoryStore();
    context = {
      store,
      pubsub: { publish: vi.fn() } // Mock pubsub
    };
    idCounter = 0;
  });

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

   
      const result = await resolvers.Mutation.createForm(null, formInput, context, null);

      expect(result).toMatchObject({
        title: 'Test Form',
        description: 'Test Description',
      });
      expect(result.id).toContain('test-id-');
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0]).toMatchObject({
        text: 'Question 1',
        type: QuestionType.TEXT,
        required: true,
      });
      

      expect(store.getForms()).toHaveLength(1);
    });
  });

  describe('submitResponse', () => {
    it('should submit a response to an existing form', async () => {
    
      const formInput = {
        title: 'Response Test Form',
        description: 'Desc',
        questions: [{ text: 'Q1', type: QuestionType.TEXT, required: false }],
      };
   
      const form = await resolvers.Mutation.createForm(null, formInput, context, null);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['Answer 1'],
          },
        ],
      };

    
      const result = await resolvers.Mutation.submitResponse(null, answerInput, context, null);

      expect(result).toMatchObject({
        formId: form.id,
      });
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].values).toEqual(['Answer 1']);
      
   
      expect(store.getResponses(form.id)).toHaveLength(1);
    });

    it('should throw error if form not found', () => {
      expect(() => {
    
        resolvers.Mutation.submitResponse(null, {
          formId: 'non-existent-id',
          answers: [],
        }, context, null);
      }).toThrow('Form not found');
    });

    it('should ignore answers for questions not in the form (Data Integrity)', async () => {
      const formInput = {
        title: 'Integrity Test',
        questions: [{ text: 'Q1', type: QuestionType.TEXT, required: false }],
      };
 
      const form = await resolvers.Mutation.createForm(null, formInput, context, null);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['Valid Answer'],
          },
          {
            questionId: 'fake-question-id',
            values: ['Malicious Answer'],
          },
        ],
      };

     
      const result = await resolvers.Mutation.submitResponse(null, answerInput, context, null);

      // Should only have 1 answer
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].questionId).toBe(form.questions[0].id);
      expect(result.answers[0].values).toEqual(['Valid Answer']);
    });

    it('should deduplicate answers for the same question (last one wins)', async () => {
      const formInput = {
        title: 'Dedup Test',
        questions: [{ text: 'Q1', type: QuestionType.TEXT, required: false }],
      };

      const form = await resolvers.Mutation.createForm(null, formInput, context, null);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['First Answer'],
          },
          {
            questionId: form.questions[0].id,
            values: ['Second Answer'],
          },
        ],
      };

     
      const result = await resolvers.Mutation.submitResponse(null, answerInput, context, null);

      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].values).toEqual(['Second Answer']);
    });
  });
});

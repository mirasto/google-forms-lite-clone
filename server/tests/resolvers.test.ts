import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { resolvers } from '../src/resolvers';
import { QuestionType, type Context, type PubSubWithAsyncIterator } from '../src/types';
import { InMemoryStore } from '../src/store';
import type { GraphQLResolveInfo } from 'graphql';

let idCounter = 0;
vi.mock('uuid', () => ({
  v4: () => {
    idCounter++;
    return `00000000-0000-0000-0000-${idCounter.toString().padStart(12, '0')}`;
  },
}));


const mockInfo = {} as GraphQLResolveInfo;

describe('Resolvers', () => {
  let store: InMemoryStore;
  let context: Context;

  beforeEach(() => {
    store = new InMemoryStore();
    context = {
      store,
      pubsub: { 
        publish: vi.fn(),
        asyncIterator: vi.fn(),
      } as unknown as PubSubWithAsyncIterator 
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

   
      const result = await resolvers.Mutation.createForm({}, formInput, context, mockInfo);

      expect(result).toMatchObject({
        title: 'Test Form',
        description: 'Test Description',
      });
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0]).toMatchObject({
        text: 'Question 1',
        type: QuestionType.TEXT,
        required: true,
      });
      expect(result.createdAt).toBeDefined();
      expect(typeof result.createdAt).toBe('string');
      

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
   
      const form = await resolvers.Mutation.createForm({}, formInput, context, mockInfo);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['Answer 1'],
          },
        ],
      };

    
      const result = await resolvers.Mutation.submitResponse({}, answerInput, context, mockInfo);

      expect(result).toMatchObject({
        formId: form.id,
      });
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].values).toEqual(['Answer 1']);
      expect(result.createdAt).toBeDefined();
      expect(typeof result.createdAt).toBe('string');
      
   
      expect(store.getResponses(form.id)).toHaveLength(1);
    });

    it('should throw error if form not found', () => {
      expect(() => {
    
        resolvers.Mutation.submitResponse({}, {
          formId: '00000000-0000-0000-0000-999999999999',
          answers: [],
        }, context, mockInfo);
      }).toThrow('Form not found');
    });

    it('should ignore answers for questions not in the form (Data Integrity)', async () => {
      const formInput = {
        title: 'Integrity Test',
        questions: [{ text: 'Q1', type: QuestionType.TEXT, required: false }],
      };
 
      const form = await resolvers.Mutation.createForm({}, formInput, context, mockInfo);

      const answerInput = {
        formId: form.id,
        answers: [
          {
            questionId: form.questions[0].id,
            values: ['Valid Answer'],
          },
          {
            questionId: '00000000-0000-0000-0000-888888888888',
            values: ['Malicious Answer'],
          },
        ],
      };

     
      const result = await resolvers.Mutation.submitResponse({}, answerInput, context, mockInfo);

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

      const form = await resolvers.Mutation.createForm({}, formInput, context, mockInfo);

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

     
      const result = await resolvers.Mutation.submitResponse({}, answerInput, context, mockInfo);

      expect(result.answers).toHaveLength(1);
      expect(result.answers[0].values).toEqual(['Second Answer']);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormsResolver } from '../src/forms/forms.resolver';
import { FormsService } from '../src/forms/forms.service';
import { QuestionType, type PubSubWithAsyncIterator } from '../src/types';
import { CreateQuestionInput } from '../src/forms/dto/create-question.input';
import { AnswerInput } from '../src/forms/dto/answer.input';


let idCounter = 0;
vi.mock('uuid', () => ({
  v4: () => {
    idCounter++;
    return `00000000-0000-0000-0000-${idCounter.toString().padStart(12, '0')}`;
  },
}));

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const createTestFormInput = (overrides = {}) => ({
  title: 'Default Form',
  description: 'Default Description',
  questions: [
    {
      text: 'Question 1',
      type: QuestionType.TEXT,
      required: true,
    } as CreateQuestionInput,
  ],
  ...overrides,
});

const createTestAnswerInput = (formId: string, questionId: string, values = ['Default Answer']): AnswerInput[] => ([{
  questionId,
  values,
}]);

describe('FormsResolver', () => {
  let formsService: FormsService;
  let formsResolver: FormsResolver;
  let pubSub: PubSubWithAsyncIterator;

  beforeEach(() => {
    formsService = new FormsService();
    pubSub = {
      publish: vi.fn(),
      asyncIterator: vi.fn(),
    } as unknown as PubSubWithAsyncIterator;

    formsResolver = new FormsResolver(formsService, pubSub);
    idCounter = 0;
    vi.clearAllMocks();
  });

  describe('Mutation: createForm', () => {
    it('should successfully create a form with valid UUID and timestamps', async () => {
      const input = createTestFormInput({ title: 'New Survey' });

      const result = await formsResolver.createForm(
        input.title,
        input.description,
        input.questions
      );

      expect(result).toMatchObject({
        title: 'New Survey',
        description: 'Default Description',
      });
      expect(result.id).toMatch(UUID_REGEX);
      expect(result.questions).toHaveLength(1);
      expect(result.createdAt).toBeTypeOf('string');
      
      expect(formsService.getForms()).toContainEqual(result);
    });
  });

  describe('Mutation: submitResponse', () => {
    const setupForm = async () => {
      const input = createTestFormInput();
      return await formsResolver.createForm(
        input.title,
        input.description,
        input.questions
      );
    };

    it('should submit a valid response and trigger subscription', async () => {
      const form = await setupForm();
      const answerInput = createTestAnswerInput(form.id, form.questions[0].id, ['My Answer']);

      const result = await formsResolver.submitResponse(form.id, answerInput);

      expect(result.formId).toBe(form.id);
      expect(result.answers[0].values).toEqual(['My Answer']);
      
      expect(pubSub.publish).toHaveBeenCalledWith('RESPONSE_ADDED', {
        responseAdded: result,
      });
      
      expect(formsService.getResponses(form.id)).toHaveLength(1);
    });

    it('should throw NOT_FOUND error if formId does not exist', async () => {
       const nonExistentId = '00000000-0000-0000-0000-999999999999';
       const randomQuestionId = '00000000-0000-0000-0000-123456789012';
       const answerInput = createTestAnswerInput(nonExistentId, randomQuestionId);
       
       await expect(formsResolver.submitResponse(nonExistentId, answerInput))
         .rejects.toThrow('Form not found');
    });
  });
});

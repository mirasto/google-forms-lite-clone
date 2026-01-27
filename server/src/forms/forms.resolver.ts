import { Resolver, Query, Mutation, Subscription, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { FormsService } from './forms.service.js';
import * as factories from '../factories.js';
import { CreateQuestionInput } from './dto/create-question.input.js';
import { AnswerInput } from './dto/answer.input.js';
import { PubSubWithAsyncIterator, QuestionInput, QuestionType } from '../types.js';
import { createFormSchema, submitResponseSchema } from '../validation.js';

@Resolver('Form')
export class FormsResolver {
  constructor(
    @Inject(FormsService) private readonly formsService: FormsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSubWithAsyncIterator,
  ) { }

  @Query('forms')
  async getForms() {
    return this.formsService.getForms();
  }

  @Query('form')
  async getForm(@Args('id') id: string) {
    return this.formsService.getForm(id);
  }

  @Query('responses')
  async getResponses(@Args('formId') formId: string) {
    return this.formsService.getResponses(formId);
  }

  @Mutation('createForm')
  async createForm(
    @Args('title') title: string,
    @Args('description', { nullable: true }) description: string | null,
    @Args('questions', { type: () => [CreateQuestionInput] }) questions: CreateQuestionInput[]
  ) {
    createFormSchema.parse({
      title,
      description,
      questions,
    });

    const mappedQuestions: QuestionInput[] = questions.map((question) => {
      const common = {
        text: question.text,
        required: question.required,
      };

      switch (question.type) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.CHECKBOX:
          return {
            ...common,
            type: question.type,
            options: question.options?.map((option) => ({
              ...option,
              id: option.id ?? undefined,
            })) ?? [],
          };
        case QuestionType.TEXT:
        case QuestionType.DATE:
          return {
            ...common,
            type: question.type,
          };
        default:
 
          throw new Error(`Unsupported question type: ${question['type']}`);
      }
    });

    const newForm = factories.createForm(title, description ?? undefined, mappedQuestions);

    this.formsService.addForm(newForm);
    return newForm;
  }

  @Mutation('submitResponse')
  async submitResponse(
    @Args('formId') formId: string,
    @Args('answers', { type: () => [AnswerInput] }) answers: AnswerInput[]
  ) {

    submitResponseSchema.parse({
      formId,
      answers,
    });

    const newResponse = this.formsService.submitResponse(formId, answers);
    this.pubSub.publish('RESPONSE_ADDED', { responseAdded: newResponse });
    return newResponse;
  }

  @Subscription('responseAdded', {
    filter: (payload, variables) => {
      return payload.responseAdded.formId === variables.formId;
    },
  })
  responseAdded(@Args('formId') formId: string) {
    return this.pubSub.asyncIterator('RESPONSE_ADDED');
  }
}

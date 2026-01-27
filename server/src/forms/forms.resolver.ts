import { Resolver, Query, Mutation, Subscription, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FormsService } from './forms.service.js';
import * as factories from '../factories.js';
import { createFormSchema, submitResponseSchema } from '../validation.js';
import { GraphQLError } from 'graphql';
import { z, ZodError, ZodType } from 'zod';
import { Form, Response } from '../types.js';

const validate = <S extends ZodType>(schema: S, data: unknown): z.infer<S> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      throw new GraphQLError(issues, { extensions: { code: 'BAD_USER_INPUT' } });
    }
    throw error;
  }
};

@Resolver('Form')
export class FormsResolver {
  constructor(
    private readonly formsService: FormsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

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
    @Args('title') titleArg: string,
    @Args('description') descriptionArg: string | null,
    @Args('questions') questionsArg: any[]
  ) {
    const args = { title: titleArg, description: descriptionArg, questions: questionsArg };
    const validatedArgs = validate(createFormSchema, args);
    const { title, description, questions } = validatedArgs;
    
    const mappedQuestions: any[] = questions.map(question => ({
        ...question,
        options: question.options?.map(option => ({
          ...option,
          id: option.id ?? undefined
        })) ?? undefined
    }));

    const newForm = factories.createForm(title, description, mappedQuestions as any); 
    
    this.formsService.addForm(newForm);
    return newForm;
  }

  @Mutation('submitResponse')
  async submitResponse(
    @Args('formId') formIdArg: string,
    @Args('answers') answersArg: any[]
  ) {
    const args = { formId: formIdArg, answers: answersArg };
    const validatedArgs = validate(submitResponseSchema, args);
    const { formId, answers } = validatedArgs;

    const targetForm = this.formsService.getForm(formId);
    if (!targetForm) throw new GraphQLError('Form not found', { extensions: { code: 'NOT_FOUND' } });

    const answersMap = new Map(answers.map(answer => [answer.questionId, answer]));
    const validAnswers: any[] = [];
    
    targetForm.questions.forEach((question) => {
      const answerInput = answersMap.get(question.id);
      const hasValue = answerInput?.values.some(value => value.trim() !== '') ?? false;

      if (question.required && !hasValue) {
        throw new GraphQLError(`Question "${question.text}" is required`, { extensions: { code: 'BAD_USER_INPUT', field: question.id } });
      }

      if (hasValue && (question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') && question.options && answerInput) {
        const allowedOptions = new Set(question.options.map(option => option.value));
        answerInput.values.forEach(value => {
          if (!allowedOptions.has(value)) {
            throw new GraphQLError(`Invalid option "${value}" for question "${question.text}"`, { extensions: { code: 'BAD_USER_INPUT' } });
          }
        });
      }

      if (answerInput) {
        validAnswers.push({
          questionId: question.id,
          values: answerInput.values
        });
      }
    });

    const newResponse = factories.createResponse(formId, validAnswers);
    this.formsService.addResponse(newResponse);
    this.pubSub.publish('RESPONSE_ADDED', { responseAdded: newResponse });
    return newResponse;
  }

  @Subscription('responseAdded', {
    filter: (payload, variables) => {
        return payload.responseAdded.formId === variables.formId;
    },
  })
  responseAdded(@Args('formId') formId: string) {
    return (this.pubSub as any).asyncIterator('RESPONSE_ADDED');
  }
}

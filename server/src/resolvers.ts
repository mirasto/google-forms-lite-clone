import type { Resolvers } from './types.js';
import type { Context, CreateFormInput, SubmitResponseInput, Answer } from './types.js';
import * as factories from './factories.js';
import { createFormSchema, submitResponseSchema } from './validation.js';
import { GraphQLError } from 'graphql';
import { z, ZodError, type ZodType } from 'zod';

import { withFilter } from 'graphql-subscriptions';

const validate = <S extends ZodType>(schema: S, data: unknown): z.infer<S> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      throw new GraphQLError(issues, { extensions: { code: 'BAD_USER_INPUT' } });
    }
    throw error;
  }
};

export const resolvers: Resolvers = {
  Query: {
    forms: (_parent, _args, { store }) => store.getForms(),
    form: (_parent, { id }, { store }) => store.getForm(id) ?? null,
    responses: (_parent, { formId }, { store }) => store.getResponses(formId),
  },

  Mutation: {
    createForm: (_parent, args, { store }) => {
      const validatedArgs = validate(createFormSchema, args);
      const { title, description, questions } = validatedArgs;
      // Zod schema ensures strict types for questions, map explicitly if needed to avoid 'as any'
      // If questions structure matches factories expectation exactly, no cast needed.
      // But Zod optional fields are sometimes incompatible with strict types if not handled.
      // We map to ensure undefined/null consistency
      const mappedQuestions = questions.map(question => ({
        ...question,
        options: question.options?.map(option => ({
          ...option,
          id: option.id ?? undefined // ensure null becomes undefined if factory expects optional
        }))
      })) as any; // Cast to any because Zod output types and Shared types have subtle differences (e.g. null vs undefined) that are safe at runtime but annoying in TS.
                  // We validated structure with Zod already.

      const newForm = factories.createForm(title, description, mappedQuestions); 
      
      store.addForm(newForm);
      return newForm;
    },

    submitResponse: (_parent, args, context) => {
      const { store } = context;
      const validatedArgs = validate(submitResponseSchema, args);
      const { formId, answers } = validatedArgs;

      const targetForm = store.getForm(formId);
      if (!targetForm) throw new GraphQLError('Form not found', { extensions: { code: 'NOT_FOUND' } });

      const rawAnswersMap = new Map(answers.map(answer => [answer.questionId, answer]));
      const validAnswers: Answer[] = [];
      targetForm.questions.forEach((question) => {
        const answerInput = rawAnswersMap.get(question.id);
        const hasValue = answerInput?.values.some(v => v.trim() !== '') ?? false;

        if (question.required && !hasValue) {
          throw new GraphQLError(`Question "${question.text}" is required`, { extensions: { code: 'BAD_USER_INPUT', field: question.id } });
        }


        if (hasValue && (question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') && question.options && answerInput) {
          const allowed = new Set(question.options.map(option => option.value));
          answerInput.values.forEach(v => {
            if (!allowed.has(v)) {
              throw new GraphQLError(`Invalid option "${v}" for question "${question.text}"`, { extensions: { code: 'BAD_USER_INPUT' } });
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
      store.addResponse(newResponse);
      
      // Publish event
      context.pubsub.publish('RESPONSE_ADDED', { responseAdded: newResponse });
      
      return newResponse;
    },
  },

  Subscription: {
    responseAdded: {
      subscribe: withFilter(
        (_parent: any, _args: any, context: any) => {
          const { pubsub } = context as Context;
          return (pubsub as any).asyncIterator(['RESPONSE_ADDED']);
        },
        (payload: any, variables: any) => {
          return payload.responseAdded.formId === variables.formId;
        }
      ),
    },
  },
};

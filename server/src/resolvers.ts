import type { IResolvers } from '@graphql-tools/utils';
import type { Context, Form, Response, CreateFormInput, SubmitResponseInput, Answer } from './types';
import * as factories from './factories';
import { GraphQLError } from 'graphql';
import { createFormSchema, submitResponseSchema } from './validation';
import { z, ZodError, type ZodTypeAny } from 'zod';

const storedForms: Form[] = [];
const storedResponses: Response[] = [];

const validate = <S extends ZodTypeAny>(schema: S, data: unknown): z.infer<S> => {
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

export const resolvers: IResolvers<unknown, Context> = {
  Query: {
    forms: () => storedForms,
    form: (_parent, { id }) => storedForms.find(f => f.id === id) ?? null,
    responses: (_parent, { formId }) => storedResponses.filter(r => r.formId === formId),
  },

  Mutation: {
    createForm: (_parent, args: CreateFormInput) => {
      const validatedArgs = validate(createFormSchema, args);
      const { title, description, questions } = validatedArgs as unknown as CreateFormInput;

      const newForm = factories.createForm(title, description, questions);
      storedForms.push(newForm);
      return newForm;
    },

    submitResponse: (_parent, args: SubmitResponseInput) => {
      const validatedArgs = validate(submitResponseSchema, args);
      const { formId, answers } = validatedArgs as unknown as SubmitResponseInput;

      const targetForm = storedForms.find(f => f.id === formId);
      if (!targetForm) throw new GraphQLError('Form not found', { extensions: { code: 'NOT_FOUND' } });

      const answersMap = new Map(answers.map(a => [a.questionId, a]));

      targetForm.questions.forEach((q) => {
        const answer = answersMap.get(q.id);
        const hasValue = answer?.values.some(v => v.trim() !== '') ?? false;

        if (q.required && !hasValue) throw new GraphQLError(`Question "${q.text}" is required`, { extensions: { code: 'BAD_USER_INPUT', field: q.id } });

        if (hasValue && (q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') && q.options && answer) {
          const allowed = new Set(q.options.map(o => o.value));
          answer.values.forEach(v => {
            if (!allowed.has(v)) throw new GraphQLError(`Invalid option "${v}" for question "${q.text}"`, { extensions: { code: 'BAD_USER_INPUT' } });
          });
        }
      });

      const newResponse = factories.createResponse(formId, answers);
      storedResponses.push(newResponse);
      return newResponse;
    },
  },

  Answer: {
    value: (parent: Answer) => parent.values[0] ?? null,
  },
};

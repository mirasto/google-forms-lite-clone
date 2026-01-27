import type { IResolvers } from '@graphql-tools/utils';
import type { Context, Form, Response, CreateFormInput, SubmitResponseInput, Resolvers as MyResolvers } from './types';
import * as factories from './factories';
import { GraphQLError } from 'graphql';

const storedForms: Form[] = [];
const storedResponses: Response[] = [];

export const resolvers: IResolvers<unknown, Context> = {
  Query: {
    forms: () => storedForms,
    form: (_parent, { id }) => storedForms.find(f => f.id === id) ?? null,
    responses: (_parent, { formId }) => storedResponses.filter(r => r.formId === formId),
  },

  Mutation: {
    createForm: (_parent, { title, description, questions }: CreateFormInput) => {
      if (!title?.trim()) throw new GraphQLError('Title is required', { extensions: { code: 'BAD_USER_INPUT' } });
      if (!questions || questions.length === 0) throw new GraphQLError('Form must have at least one question', { extensions: { code: 'BAD_USER_INPUT' } });

      questions.forEach((q, idx) => {
        if (!q.text?.trim()) throw new GraphQLError(`Question ${idx + 1}: text required`, { extensions: { code: 'BAD_USER_INPUT' } });
        if ((q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') && (!q.options || q.options.length === 0)) {
          throw new GraphQLError(`Question "${q.text}" must have options`, { extensions: { code: 'BAD_USER_INPUT' } });
        }
      });

      const newForm = factories.createForm(title, description, questions);
      storedForms.push(newForm);
      return newForm;
    },

    submitResponse: (_parent, { formId, answers }: SubmitResponseInput) => {
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
    value: (parent) => parent.values[0] ?? null,
  },
};

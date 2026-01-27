import { Form, Response, Resolvers } from './types';
import * as factories from './factories';

const forms = [] as Form[];
const responses = [] as Response[];

export const resolvers: Resolvers = {
  Query: {
    forms: () => forms,
    form: (_, { id }) => forms.find((form) => form.id === id),
    responses: (_, { formId }) =>
      responses.filter((response) => response.formId === formId),
  },
  Mutation: {
    createForm: (_, { title, description, questions }): Form => {
      if (!title?.trim()) {
        throw new Error('Title is required');
      }

      if (!questions || questions.length === 0) {
        throw new Error('Form must have at least one question');
      }

      questions.forEach(q => {
        if (!q.text?.trim()) throw new Error('Question text is required');
      });

      const newForm = factories.createForm(title, description, questions);
      forms.push(newForm);
      return newForm;
    },
    submitResponse: (_, { formId, answers }): Response => {
      const form = forms.find((existingForm) => existingForm.id === formId);
      if (!form) {
        throw new Error('Form not found');
      }

      if (!answers || answers.length === 0) {
        throw new Error('Response must include answers');
      }

      const newResponse = factories.createResponse(formId, answers);
      responses.push(newResponse);
      return newResponse;
    },
  },
};

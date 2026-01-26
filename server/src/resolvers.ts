import { v4 as uuidv4 } from 'uuid';
import { Form, Response, Resolvers } from './types';

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
    createForm: (_, { title, description, questions }) => {
      const newForm = {
        id: uuidv4(),
        title,
        description,
        questions: (questions || []).map((question) => ({
          ...question,
          id: uuidv4(),
        })),
      };
      forms.push(newForm);
      return newForm;
    },
    submitResponse: (_, { formId, answers }) => {
      const form = forms.find((existingForm) => existingForm.id === formId);
      if (!form) {
        throw new Error('Form not found');
      }

      const newResponse = {
        id: uuidv4(),
        formId,
        answers: answers.map((answer) => ({
          questionId: answer.questionId,
          values: answer.values,
        })),
      };

      responses.push(newResponse);
      return newResponse;
    },
  },
};

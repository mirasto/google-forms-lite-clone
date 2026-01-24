import { v4 as uuidv4 } from 'uuid';
import { f, r, Resolvers } from './types';

const forms = [] as f[];
const responses = [] as r[];

export const resolvers: Resolvers = {
  Query: {
    forms: () => forms,
    f: (_, { id }) => forms.find((f) => f.id === id),
    responses: (_, { formId }) =>
      responses.filter((r) => r.formId === formId),
  },
  Mutation: {
    createForm: (_, { title, description, questions }) => {
      const newForm = {
        id: uuidv4(),
        title,
        description,
        questions: (questions || []).map((q) => ({
          ...q,
          id: uuidv4(),
        })),
      };
      forms.push(newForm);
      return newForm;
    },
    submitResponse: (_, { formId, answers }) => {
      const f = forms.find((f) => f.id === formId);
      if (!f) {
        throw new Error('f not found');
      }

      const newResponse = {
        id: uuidv4(),
        formId,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          values: a.values,
        })),
      };

      responses.push(newResponse);
      return newResponse;
    },
  },
};

import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import type { Form, Response, CreateFormInput, SubmitResponseInput } from '@types';
import { GraphQLClient } from 'graphql-request';

const API_URL = 'http://localhost:4000/';
const client = new GraphQLClient(API_URL);

const QUESTION_FRAGMENT = `
  fragment QuestionFields on Question {
    id
    text
    type
    required
    options {
      id
      value
    }
  }
`;

const FORM_FRAGMENT = `
  ${QUESTION_FRAGMENT}
  fragment FormFields on Form {
    id
    title
    description
    questions {
      ...QuestionFields
    }
  }
`;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({ client }),
  tagTypes: ['Form', 'Response'],
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => ({
        document: `
          query GetForms {
            forms {
              id
              title
              description
            }
          }
        `,
      }),
      transformResponse: (response: { forms: Form[] }) => response.forms,
      providesTags: ['Form'],
    }),
    getForm: builder.query<Form, string>({
      query: (id) => ({
        document: `
          ${FORM_FRAGMENT}
          query GetForm($id: ID!) {
            form(id: $id) {
              ...FormFields
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: { form: Form }) => response.form,
      providesTags: (_result, _error, id) => [{ type: 'Form', id }],
    }),
    getResponses: builder.query<Response[], string>({
      query: (formId) => ({
        document: `
          query GetResponses($formId: ID!) {
            responses(formId: $formId) {
              id
              formId
              answers {
                questionId
                values
              }
            }
          }
        `,
        variables: { formId },
      }),
      transformResponse: (response: { responses: Response[] }) => response.responses,
      providesTags: (_result, _error, formId) => [{ type: 'Response', id: formId }],
    }),
    createForm: builder.mutation<Form, CreateFormInput>({
      query: (input) => ({
        document: `
          ${FORM_FRAGMENT}
          mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]!) {
            createForm(title: $title, description: $description, questions: $questions) {
              ...FormFields
            }
          }
        `,
        variables: input,
      }),
      transformResponse: (response: { createForm: Form }) => response.createForm,
      invalidatesTags: ['Form'],
    }),
    submitResponse: builder.mutation<Response, SubmitResponseInput>({
      query: (input) => ({
        document: `
          mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
            }
          }
        `,
        variables: input,
      }),
      transformResponse: (response: { submitResponse: Response }) => response.submitResponse,
      invalidatesTags: (_result, _error, { formId }) => [{ type: 'Response', id: formId }],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = api;

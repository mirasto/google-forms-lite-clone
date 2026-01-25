import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import type { Form, Response, CreateFormInput, SubmitResponseInput } from '../types';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:4000/');

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
          query GetForm($id: ID!) {
            form(id: $id) {
              id
              title
              description
              questions {
                id
                text
                type
                options
              }
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
          mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput]) {
            createForm(title: $title, description: $description, questions: $questions) {
              id
              title
              description
              questions {
                id
                text
                type
                options
                required
              }
            }
          }
        `,
        variables: input,
      }),
      invalidatesTags: ['Form'],
    }),
    submitResponse: builder.mutation<Response, SubmitResponseInput>({
      query: (input) => ({
        document: `
          mutation SubmitResponse($formId: ID!, $answers: [AnswerInput]) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
            }
          }
        `,
        variables: input,
      }),
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

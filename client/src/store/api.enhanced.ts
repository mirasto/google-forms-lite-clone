import { api as generatedApi } from './api.generated';

const enhancedApi = generatedApi.enhanceEndpoints({
  endpoints: {
    GetForms: { providesTags: ['Form'] },
    GetForm: { providesTags: (_result, _error, arg) => [{ type: 'Form', id: arg.id }] },
    GetResponses: { providesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.formId }] },
    CreateForm: { invalidatesTags: ['Form'] },
    SubmitResponse: { invalidatesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.formId }] },
  },
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = enhancedApi;

export { enhancedApi as api };

import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4000/';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    url: API_URL,
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
});

export type RootApi = typeof api;
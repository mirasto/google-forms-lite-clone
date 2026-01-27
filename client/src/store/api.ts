import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4000/';

const graphqlClient = new GraphQLClient(API_URL);
type BaseQueryArgs = Parameters<typeof graphqlRequestBaseQuery>[0];

type ExpectedClient = BaseQueryArgs extends { client: infer C } ? C : never;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    client: graphqlClient as unknown as ExpectedClient,
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
});

export type RootApi = typeof api;
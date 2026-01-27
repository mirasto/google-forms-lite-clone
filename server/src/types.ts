import type { GraphQLResolveInfo } from 'graphql';
import type { IResolvers } from '@graphql-tools/utils';
import type { InMemoryStore } from './store.js';
import type { PubSub } from 'graphql-subscriptions';
import type { 
  Form, 
  Response, 
  CreateFormInput, 
  SubmitResponseInput, 
  Answer
} from '@forms/shared';

export * from '@forms/shared';

export interface Context {
  userId?: string;
  store: InMemoryStore;
  pubsub: PubSub;
}

export type ResolverFn<TResult, TParent = {}, TArgs = {}> = (
  parent: TParent,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export interface Resolvers extends IResolvers<any, Context> {
  Query: {
    forms: ResolverFn<Form[]>;
    form: ResolverFn<Form | null, {}, { id: string }>;
    responses: ResolverFn<Response[], {}, { formId: string }>;
  };
  Mutation: {
    createForm: ResolverFn<Form, {}, CreateFormInput>;
    submitResponse: ResolverFn<Response, {}, SubmitResponseInput>;
  };
  Subscription: {
    responseAdded: {
      subscribe: ResolverFn<AsyncIterator<Response>, {}, { formId: string }>;
      resolve?: ResolverFn<Response, Response, { formId: string }>;
    };
  };
}

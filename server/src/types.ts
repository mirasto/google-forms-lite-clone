import type { GraphQLResolveInfo } from 'graphql';
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
}

export type ResolverFn<TResult, TParent = {}, TArgs = {}> = (
  parent: TParent,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export interface Resolvers {
  Query: {
    forms: ResolverFn<Form[]>;
    form: ResolverFn<Form | null, {}, { id: string }>;
    responses: ResolverFn<Response[], {}, { formId: string }>;
  };
  Mutation: {
    createForm: ResolverFn<Form, {}, CreateFormInput>;
    submitResponse: ResolverFn<Response, {}, SubmitResponseInput>;
  };
  Answer?: {
    value: ResolverFn<string | null, Answer>;
  };
  [key: string]: unknown;
}

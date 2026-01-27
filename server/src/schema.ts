import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Option {
    id: ID!
    value: String!
  }

  type Question {
    id: ID!
    text: String!
    type: QuestionType!
    options: [Option!]
    required: Boolean!
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    values: [String!]!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  input OptionInput {
    id: ID
    value: String!
  }

  input QuestionInput {
    text: String!
    type: QuestionType!
    options: [OptionInput!]
    required: Boolean!
  }

  input AnswerInput {
    questionId: ID!
    values: [String!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]!): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }

  type Subscription {
    responseAdded(formId: ID!): Response!
  }
`;

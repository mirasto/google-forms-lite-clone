import { gql } from 'graphql-tag';

export const typeDefs = gql`
  "Supported question types for the form builder"
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  "Represents a choice option for MULTIPLE_CHOICE or CHECKBOX questions"
  type Option {
    id: ID!
    value: String!
  }

  "A single question within a form"
  type Question {
    id: ID!
    text: String!
    type: QuestionType!
    "List of available options (only for MULTIPLE_CHOICE and CHECKBOX types)"
    options: [Option!]
    required: Boolean!
  }

  "A form template containing a set of questions"
  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
    "ISO 8601 timestamp of when the form was created"
    createdAt: String!
  }

  "An answer to a specific question"
  type Answer {
    questionId: ID!
    values: [String!]!
  }

  "A user's submission to a form"
  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
    "ISO 8601 timestamp of when the response was submitted"
    createdAt: String!
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
    "Retrieve all available forms"
    forms: [Form!]!
    "Retrieve a specific form by its ID"
    form(id: ID!): Form
    "Retrieve all responses for a specific form"
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    "Create a new form with questions"
    createForm(title: String!, description: String, questions: [QuestionInput!]!): Form!
    "Submit a response to an existing form"
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }

  type Subscription {
    "Real-time updates when a new response is submitted to a form"
    responseAdded(formId: ID!): Response!
  }
`;

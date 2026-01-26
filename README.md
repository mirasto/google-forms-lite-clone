# Google Forms Lite Clone

A simplified clone of Google Forms built as a monorepo using React, TypeScript, Redux Toolkit, and GraphQL.

## Features

- **Form Builder:**
  - Create forms with custom Titles and Descriptions.
  - Add various question types: **Text Answer**, **Multiple Choice**, **Checkboxes**, **Date**.
  - **Validation:** Mark questions as "Required".
  - Dynamic options for choice-based questions.
- **Form Filler:**
  - User-friendly interface to fill out forms.
  - Real-time validation for required fields.
  - Visual feedback for errors and success states.
- **Responses:**
  - View collected responses for each form.
- **Architecture:**
  - Monorepo structure managing Client and Server.
  - GraphQL API with Apollo Server.
  - State management via Redux Toolkit Query.

## Tech Stack

### Client
- **Framework:** React (Vite)
- **Language:** TypeScript
- **State Management:** Redux Toolkit (RTK Query)
- **Styling:** CSS Modules
- **Routing:** React Router
- **Testing:** Vitest, React Testing Library

### Server
- **Runtime:** Node.js
- **API:** Apollo Server (GraphQL)
- **Language:** TypeScript
- **Data Store:** In-memory (Variables)
- **Testing:** Vitest

## Prerequisites

- Node.js (v14 or higher)
- npm

## Setup & Running

1.  **Install Dependencies:**
    Run the following command in the root directory to install dependencies for both client and server:
    ```bash
    npm install
    ```

2.  **Run the Application:**
    Start both the client and server concurrently from the root:
    ```bash
    npm run dev
    ```

    - **Client:** [http://localhost:5173](http://localhost:5173)
    - **Server:** [http://localhost:4000](http://localhost:4000)

## Running Tests

This project uses **Vitest** for unit and integration testing.

### Client Tests
Run tests for UI components and Hooks:
```bash
cd client
npm run test
```

### Server Tests
Run integration tests for GraphQL Resolvers:
```bash
cd server
npm run test
```

## Project Structure

```
google-forms-clone-new/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/          # Custom hooks (useFormBuilder, useFormFiller)
│   │   ├── pages/          # Main views (Home, FormBuilder, FormFiller)
│   │   ├── store/          # Redux store and API slices
│   │   └── types.ts        # Shared TypeScript interfaces
│   └── vite.config.ts
├── server/                 # Node.js GraphQL Backend
│   ├── src/
│   │   ├── index.ts        # Server entry point
│   │   ├── schema.ts       # GraphQL Type Definitions
│   │   ├── resolvers.ts    # API Logic
│   │   └── types.ts        # Server-side types
│   └── vitest.config.ts
└── package.json            # Root configuration
```

## API Schema

- **Queries:**
    - `forms`: List all forms.
    - `form(id)`: Get a specific form by ID.
    - `responses(formId)`: Get all responses for a specific form.
- **Mutations:**
    - `createForm`: Create a new form with questions and validation rules.
    - `submitResponse`: Submit answers to a form.

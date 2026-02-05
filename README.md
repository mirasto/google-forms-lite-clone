# Google Forms Lite Clone

A simplified clone of Google Forms built as a monorepo using React 19, NestJS, and GraphQL.

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
  - **Backend:** NestJS with Apollo Server (GraphQL).
  - **Frontend:** React 19 with Redux Toolkit Query.
  - **Type Safety:** Shared types and GraphQL Code Generator.

## Tech Stack

### Client
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **State Management:** Redux Toolkit (RTK Query)
- **Routing:** React Router v7
- **Styling:** CSS Modules
- **Notifications:** Notiflix
- **Testing:** Vitest, React Testing Library

### Server
- **Framework:** NestJS
- **API:** Apollo Server (GraphQL)
- **Validation:** Zod & Class Validator
- **Language:** TypeScript
- **Data Store:** In-memory (Variables)
- **Testing:** Vitest

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup & Running

### Development Mode

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
google-forms-lite-clone/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── graphql/        # GraphQL operations (.graphql)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Main views (Home, FormBuilder, FormFiller)
│   │   ├── shared/         # Client-local types and constants
│   │   ├── store/          # Redux store and API slices
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # App component
│   │   └── main.tsx        # Entry point
│   └── vite.config.ts
├── server/                 # NestJS Backend
│   ├── src/
│   │   ├── forms/          # Forms Module (Resolvers, Service, DTOs)
│   │   ├── app.module.ts   # Main App Module
│   │   ├── constants.ts    # Server constants
│   │   ├── factories.ts    # Factory functions for data creation
│   │   ├── main.ts         # Server Entry Point
│   │   ├── schema.ts       # GraphQL Type Definitions
│   │   ├── types.ts        # Server internal types
│   │   └── validation.ts   # Zod Validation Schemas
│   └── vitest.config.ts
├── shared/                 # Shared Workspace (Types interfaces)
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


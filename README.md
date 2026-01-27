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

### Building for Production

To build the client application for production deployment:

1.  **Build the Client:**
    Run the build command from the `client` directory:
    ```bash
    cd client
    npm run build
    ```
    This generates a `dist` folder in the `client` directory with the optimized static files.

2.  **Preview Production Build:**
    You can verify the build locally by running:
    ```bash
    npm run preview
    ```

    *Note: The server currently runs directly from source (using `tsx`) and does not require a build step for development.*

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
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom hooks (useFormBuilder, useFormFiller)
│   │   ├── pages/          # Main views (Home, FormBuilder, FormFiller)
│   │   ├── store/          # Redux store and API slices
│   │   └── types.ts        # Shared TypeScript interfaces
│   └── vite.config.ts
├── server/                 # NestJS Backend
│   ├── src/
│   │   ├── forms/          # Forms Module (Resolvers, Service, DTOs)
│   │   ├── app.module.ts   # Main App Module
│   │   ├── main.ts         # Server Entry Point
│   │   ├── schema.ts       # GraphQL Type Definitions
│   │   └── validation.ts   # Zod Validation Schemas
│   └── vitest.config.ts
├── shared/                 # Shared Types Workspace
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


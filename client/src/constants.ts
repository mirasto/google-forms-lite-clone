export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: "This is a required question",
    NO_TITLE: "Title is required",
    MIN_ONE_QUESTION: "At least one question is required",
    EMPTY_QUESTION_TEXT: "All questions must have text",
    MIN_ONE_OPTION: "Multiple choice and checkbox questions must have at least one valid option",
} as const;

export const API_MESSAGES = {
    SUBMIT_SUCCESS: "Response submitted successfully!",
    SUBMIT_ERROR: "Failed to submit response. Please check your connection.",
    CREATE_SUCCESS: "Form created successfully!",
    CREATE_ERROR: "Failed to create form",
} as const;

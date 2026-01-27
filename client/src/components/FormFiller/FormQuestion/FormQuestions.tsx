import type { ReactElement } from "react";

import { type Question, QuestionType } from "@types";
import styles from "./FormQuestions.module.css";

import { TextInput, DateInput, ChoiceInput } from "../QuestionsInput/QuestionsInput";

interface FormQuestionsProps {
  question: Question;
  answers: string[];
  errors: Record<string, string>;
  handleInputChange: (id: string, value: string) => void;
  handleCheckboxChange: (id: string, value: string, checked: boolean) => void;
}

const FormQuestions = ({
  question,
  answers,
  errors,
  handleInputChange,
  handleCheckboxChange
}: FormQuestionsProps): ReactElement => {
  const error = errors[question.id];
  const labelId = `question-label-${question.id}`;
  const currentValue = answers?.[0] || "";
  const hasError = error !== undefined;

  const renderInput = (): ReactElement | null => {
    switch (question.type) {
      case QuestionType.Text:
        return (
          <TextInput
            id={question.id}
            value={currentValue}
            onChange={handleInputChange}
            hasError={hasError}
            labelledBy={labelId}
          />
        );
      case QuestionType.Date:
        return (
          <DateInput
            id={question.id}
            value={currentValue}
            onChange={handleInputChange}
            hasError={hasError}
            labelledBy={labelId}
          />
        );
      case QuestionType.MultipleChoice:
        return (
          <ChoiceInput
            id={question.id}
            options={question.options || []}
            selectedValues={answers || []}
            type="RADIO"
            onChange={handleInputChange}
            hasError={hasError}
            labelledBy={labelId}
          />
        );
      case QuestionType.Checkbox:
        return (
          <ChoiceInput
            id={question.id}
            options={question.options || []}
            selectedValues={answers || []}
            type="CHECKBOX"
            onChange={handleCheckboxChange}
            hasError={hasError}
            labelledBy={labelId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`question-${question.id}`}
      className={`${styles.questionCard} ${error ? styles.cardError : ""}`}
    >
      <div className={styles.questionHeader}>
        <span id={labelId} className={styles.questionText}>
          {question.text}
          {question.required && <span className={styles.requiredStar} aria-hidden="true"> *</span>}
        </span>
      </div>

      <div className={styles.inputWrapper}>
        {renderInput()}
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormQuestions;
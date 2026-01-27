import type { ReactElement } from "react";

import { type Question } from "@types";
import styles from "./FormQuestions.module.css";

import { renderInput } from "./InputRender/InputRenderer";

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
        {renderInput({
          question,
          answers,
          hasError,
          labelId,
          currentValue,
          handleInputChange,
          handleCheckboxChange,
        })}
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

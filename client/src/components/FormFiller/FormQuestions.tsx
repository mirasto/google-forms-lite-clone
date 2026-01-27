import { type Question } from "../../type";
import styles from "./FormQuestions.module.css";
import { TextInput, DateInput, ChoiceInput } from "./QuestionsInput";
import { QuestionType } from "../../type";

interface FormQuestionsProps {
  question: Question;
  errors: Record<string, string>;
  handleInputChange: (id: string, value: string) => void;
  handleCheckboxChange: (id: string, value: string, checked: boolean) => void;
}

const FormQuestions = ({
  question,
  errors,
  handleInputChange,
  handleCheckboxChange
}: FormQuestionsProps) => {
  const error = errors[question.id];

  const renderInput = () => {
    switch (question.type) {
      case QuestionType.TEXT:
        return <TextInput id={question.id} onChange={handleInputChange} hasError={!!error} />;
      case QuestionType.DATE:
        return <DateInput id={question.id} onChange={handleInputChange} hasError={!!error} />;
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <ChoiceInput
            id={question.id}
            options={question.options || []}
            type="RADIO"
            onChange={handleInputChange}
            hasError={!!error}
          />
        );
      case QuestionType.CHECKBOX:
        return (
          <ChoiceInput
            id={question.id}
            options={question.options || []}
            type="CHECKBOX"
            onChange={handleCheckboxChange}
            hasError={!!error}
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
        <span className={styles.questionText}>
          {question.text}
          {question.required && <span className={styles.requiredStar}> *</span>}
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
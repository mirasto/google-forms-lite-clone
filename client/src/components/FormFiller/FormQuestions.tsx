import { QuestionType } from "../../type";
import styles from "./FormQuestions.module.css";
import { TextInput, DateInput, ChoiceInput } from "../FormFiller/QuestionsInput";

// Словник рендерерів (виносимо за межі компонента для чистоти)
const INPUT_RENDERERS = {
  [QuestionType.TEXT]: (q, handlers, err) => (
    <TextInput id={q.id} onChange={handlers.input} hasError={err} />
  ),
  [QuestionType.DATE]: (q, handlers, err) => (
    <DateInput id={q.id} onChange={handlers.input} hasError={err} />
  ),
  [QuestionType.MULTIPLE_CHOICE]: (q, handlers, err) => (
    <ChoiceInput id={q.id} options={q.options} type="radio" onChange={handlers.input} hasError={err} />
  ),
  [QuestionType.CHECKBOX]: (q, handlers, err) => (
    <ChoiceInput id={q.id} options={q.options} type="checkbox" onChange={handlers.checkbox} hasError={err} />
  ),
};

const FormQuestions = ({ question, errors, handleInputChange, handleCheckboxChange }) => {
  const error = errors[question.id];

  return (
    <div className={styles.questionCard}>
      {/* Використовуємо question.title або question.text залежно від твого API */}
      <div className={styles.questionText}>{question.title || question.text}</div>

      <div className={styles.inputWrapper}>
        {INPUT_RENDERERS[question.type]?.(
          question,
          { input: handleInputChange, checkbox: handleCheckboxChange },
          !!error
        )}
      </div>

      {error && (
        <div className={styles.error}>
           <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormQuestions;
import { type ChangeEvent } from "react";
import { QuestionType, type DraftQuestion } from "../../type";
import styles from "./BuilderQuestionCard.module.css";
import OptionManager from "./OptionManager";

interface BuilderQuestionCardProps {
  index: number;
  question: DraftQuestion;
  updateQuestion: <K extends keyof Omit<DraftQuestion, "tempId" | "options">>(
    index: number,
    field: K,
    value: DraftQuestion[K]
  ) => void;
  removeQuestion: (index: number) => void;
  optionMethods: {
    addOption: (qIndex: number) => void;
    updateOption: (qIndex: number, oIndex: number, value: string) => void;
    removeOption: (qIndex: number, oIndex: number) => void;
  };
}

const BuilderQuestionCard = ({
  index,
  question,
  updateQuestion,
  removeQuestion,
  optionMethods,
}: BuilderQuestionCardProps) => {
  const showOptions =
    question.type === QuestionType.MULTIPLE_CHOICE ||
    question.type === QuestionType.CHECKBOX;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuestion(index, "text", e.target.value);
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateQuestion(index, "type", e.target.value as QuestionType);
  };


  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <input
          className={styles.input}
          value={question.text}
          onChange={handleTextChange}
          placeholder="Question Text"
        />

        <select
          className={styles.select}
          value={question.type}
          onChange={handleTypeChange}
          aria-label="Question Type"
        >
          <option value={QuestionType.TEXT}>Short Answer</option>
          <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
          <option value={QuestionType.CHECKBOX}>Checkboxes</option>
          <option value={QuestionType.DATE}>Date</option>
        </select>

        <button
          onClick={() => removeQuestion(index)}
          className={styles.deleteBtn}
          title="Remove question"
          aria-label="Remove question"
          type="button"
        >
          ×
        </button>
      </div>

      {showOptions && (
        <OptionManager
          questionIndex={index}
          type={question.type}
          options={question.options}
          {...optionMethods}
        />
      )}
    </div>
  );
};

export default BuilderQuestionCard;
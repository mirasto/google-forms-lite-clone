import { type ChangeEvent } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { QuestionType, type DraftQuestion } from "@types";
import styles from "./BuilderQuestionCard.module.css";
import OptionManager from "./OptionManager";

interface QuestionTypeOption {
  value: QuestionType;
  label: string;
}

const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  { value: QuestionType.TEXT, label: 'Short Answer' },
  { value: QuestionType.MULTIPLE_CHOICE, label: 'Multiple Choice' },
  { value: QuestionType.CHECKBOX, label: 'Checkboxes' },
  { value: QuestionType.DATE, label: 'Date' },
];

const customSelectStyles: StylesConfig<QuestionTypeOption, false> = {
  control: (provided) => ({
    ...provided,
    minWidth: '200px',
    padding: '2px',
    borderRadius: '4px',
    borderColor: '#ccc',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#b3b3b3',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#e8f0fe' : state.isFocused ? '#f1f3f4' : 'white',
    color: state.isSelected ? '#1967d2' : '#202124',
    cursor: 'pointer',
    ':active': {
      backgroundColor: '#e8f0fe',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
  }),
};

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

  const handleTypeChange = (newValue: SingleValue<QuestionTypeOption>) => {
    if (newValue) {
      updateQuestion(index, "type", newValue.value);
    }
  };

  const selectedOption = QUESTION_TYPE_OPTIONS.find(opt => opt.value === question.type);

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <input
          className={styles.input}
          value={question.text}
          onChange={handleTextChange}
          placeholder="Question Text"
        />

        <div className={styles.selectWrapper}>
          <Select
            value={selectedOption}
            onChange={handleTypeChange}
            options={QUESTION_TYPE_OPTIONS}
            styles={customSelectStyles}
            aria-label="Question Type"
            isSearchable={false}
          />
        </div>

        <button
          onClick={() => removeQuestion(index)}
          className={styles.deleteBtn}
          title="Remove question"
          aria-label="Remove question"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
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

      <div className={styles.questionFooter}>
        <label className={styles.requiredLabel}>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => updateQuestion(index, "required", e.target.checked)}
          />
          Required
        </label>
      </div>
    </div>
  );
};

export default BuilderQuestionCard;
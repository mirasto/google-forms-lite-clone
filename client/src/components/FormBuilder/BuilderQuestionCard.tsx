import type { ChangeEvent, ReactElement } from "react";
import Select, { type SingleValue } from "react-select";
import { QuestionType, type DraftQuestion } from "@types";
import styles from "./BuilderQuestionCard.module.css";
import OptionManager from "./OptionManager";
import { QUESTION_TYPE_OPTIONS, type QuestionTypeOption } from "../../config/formConfig";

export interface QuestionActions {
  updateQuestion: <K extends keyof Omit<DraftQuestion, "tempId" | "options">>(
    id: string,
    field: K,
    value: DraftQuestion[K]
  ) => void;
  removeQuestion: (id: string) => void;
  addOption: (qId: string) => void;
  updateOption: (qId: string, oId: string, value: string) => void;
  removeOption: (qId: string, oId: string) => void;
}

export interface BuilderQuestionCardProps {
  question: DraftQuestion;
  actions: QuestionActions;
}

const BuilderQuestionCard = ({
  question,
  actions,
}: BuilderQuestionCardProps): ReactElement => {
  const showOptions =
    question.type === QuestionType.MULTIPLE_CHOICE ||
    question.type === QuestionType.CHECKBOX;

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    actions.updateQuestion(question.tempId, "text", e.target.value);
  };

  const handleTypeChange = (newValue: SingleValue<QuestionTypeOption>) => {
    if (newValue) {
      actions.updateQuestion(question.tempId, "type", newValue.value);
    }
  };

  const handleRequiredChange = (e: ChangeEvent<HTMLInputElement>) => {
    actions.updateQuestion(question.tempId, 'required', e.target.checked);
  };

  const selectedOption: QuestionTypeOption | undefined = QUESTION_TYPE_OPTIONS.find(option => option.value === question.type);

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
            classNamePrefix="form-select"
          />
        </div>
      </div>

      {showOptions && (
        <OptionManager
          questionId={question.tempId}
          type={question.type}
          options={question.options || []}
          addOption={actions.addOption}
          updateOption={actions.updateOption}
          removeOption={actions.removeOption}
        />
      )}

      <div className={styles.questionFooter}>
        <label className={styles.requiredLabel}>
          Required
          <input
            type="checkbox"
            checked={question.required ?? false}
            onChange={handleRequiredChange}
          />
        </label>
        <button
          onClick={() => actions.removeQuestion(question.tempId)}
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
    </div>
  );
};

export default BuilderQuestionCard;

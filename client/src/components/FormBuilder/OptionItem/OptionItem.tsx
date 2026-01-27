import type { ChangeEvent, ReactElement } from "react";
import { QuestionType, type DraftOption } from "@types";
import styles from "./OptionItem.module.css";

export interface OptionItemProps {
  questionId: string;
  option: DraftOption;
  optionIndex: number;
  type: QuestionType;
  onUpdate: (questionId: string, optionId: string, value: string) => void;
  onRemove: (questionId: string, optionId: string) => void;
}

const OptionItem = ({
  questionId,
  option,
  optionIndex,
  type,
  onUpdate,
  onRemove,
}: OptionItemProps): ReactElement => {
  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onUpdate(questionId, option.id, event.target.value);
  };

  return (
    <div className={styles.optionRow}>
      <input
        type={type === QuestionType.MultipleChoice ? "radio" : "checkbox"}
        className={styles.markingInput}
        disabled
        aria-hidden="true"
      />
      <input
        className={styles.input}
        value={option.value}
        onChange={handleOptionChange}
        placeholder={`Option ${optionIndex + 1}`}
      />
      <button
        type="button"
        onClick={() => onRemove(questionId, option.id)}
        className={styles.deleteOptionBtn}
        title="Remove option"
        aria-label="Remove option"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default OptionItem;

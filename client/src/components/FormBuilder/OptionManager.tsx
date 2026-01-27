import type { ChangeEvent, ReactElement } from "react";
import { QuestionType, type DraftOption } from "@types";
import styles from "./OptionManager.module.css";

export interface OptionManagerProps {
  questionId: string;
  type: QuestionType;
  options?: DraftOption[];
  addOption: (questionId: string) => void;
  updateOption: (questionId: string, optionId: string, value: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
}

const OptionManager = ({
  questionId,
  type,
  options,
  addOption,
  updateOption,
  removeOption,
}: OptionManagerProps): ReactElement => {
  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>, optionId: string) => {
    updateOption(questionId, optionId, event.target.value);
  };

  return (
    <div className={styles.optionsList}>
      {options?.map((option, optionIndex) => (
        <div key={option.id} className={styles.optionRow}>
          <input
            type={type === QuestionType.MultipleChoice ? "radio" : "checkbox"}
            className={styles.markingInput}
            disabled
            aria-hidden="true"
          />
          <input
            className={styles.input}
            value={option.value}
            onChange={(event) => handleOptionChange(event, option.id)}
            placeholder={`Option ${optionIndex + 1}`}
          />
          <button
            type="button"
            onClick={() => removeOption(questionId, option.id)}
            className={styles.deleteOptionBtn}
            title="Remove option"
            aria-label="Remove option"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addOptionBtn}
        onClick={() => addOption(questionId)}
      >
        + Add Option
      </button>
    </div>
  );
};

export default OptionManager;
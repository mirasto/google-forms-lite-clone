import { QuestionType, type DraftOption } from "@types";
import styles from "./OptionManager.module.css";

interface OptionManagerProps {
  questionIndex: number;
  type: QuestionType;
  options?: DraftOption[];
  addOption: (qIndex: number) => void;
  updateOption: (qIndex: number, oIndex: number, value: string) => void;
  removeOption: (qIndex: number, oIndex: number) => void;
}

const OptionManager = ({
  questionIndex,
  type,
  options,
  addOption,
  updateOption,
  removeOption,
}: OptionManagerProps) => {
  return (
    <div className={styles.optionsList}>
      {options?.map((option, optionIndex) => (
        <div key={option.id} className={styles.optionRow}>
          <input
            type={type === QuestionType.MULTIPLE_CHOICE ? "radio" : "checkbox"}
            className={styles.markingInput}
            disabled
            aria-hidden="true"
          />
          <input
            className={styles.input}
            value={option.value}
            onChange={(e) =>
              updateOption(questionIndex, optionIndex, e.target.value)
            }
            placeholder={`Option ${optionIndex + 1}`}
          />
          <button
            type="button"
            onClick={() => removeOption(questionIndex, optionIndex)}
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
        onClick={() => addOption(questionIndex)}
      >
        + Add Option
      </button>
    </div>
  );
};

export default OptionManager;
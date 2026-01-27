import type { ReactElement } from "react";
import { type QuestionType, type DraftOption } from "@types";

import styles from "./OptionManager.module.css";
import OptionItem from "../../OptionItem/OptionItem";

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
  return (
    <div className={styles.optionsList}>
      {options?.map((option, optionIndex) => (
        <OptionItem
          key={option.id}
          questionId={questionId}
          option={option}
          optionIndex={optionIndex}
          type={type}
          onUpdate={updateOption}
          onRemove={removeOption}
        />
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
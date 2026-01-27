import type { ChangeEvent, ReactElement } from "react";
import { QuestionType, type DraftOption } from "@types";

import styles from "./OptionItem.module.css";
import RemoveOptionButton from "./RemoveOptionButton/RemoveOptionButton";

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
      <RemoveOptionButton onClick={() => onRemove(questionId, option.id)} />
    </div>
  );
};

export default OptionItem;

import { type ChangeEvent, type ReactElement } from "react";
import { type Option } from "@types";
import styles from "./QuestionsInput.module.css";

interface ChoiceOptionProps {
  groupId: string;
  option: Option;
  type: "RADIO" | "CHECKBOX";
  isSelected: boolean;
  hasError: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ChoiceOption = ({
  groupId,
  option,
  type,
  isSelected,
  hasError,
  onChange,
}: ChoiceOptionProps): ReactElement => {
  return (
    <label className={styles.optionItem}>
      <div className={styles.controlWrapper}>
        <input
          type={type === "CHECKBOX" ? "checkbox" : "radio"}
          name={groupId}
          value={option.value}
          checked={isSelected}
          className={styles.realControl}
          onChange={onChange}
          aria-invalid={hasError}
        />
        <div
          className={`${styles.fakeControl} ${
            type === "CHECKBOX" ? styles.fakeCheckbox : styles.fakeRadio
          } ${hasError ? styles.fakeControlError : ""}`}
        />
      </div>
      <span className={styles.optionText}>{option.value}</span>
    </label>
  );
};

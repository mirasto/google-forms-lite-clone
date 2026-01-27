import { type ChangeEvent, type ReactElement } from "react";
import { type Option } from "@types";

import styles from "../QuestionsInput/QuestionsInput.module.css";
import ChoiceControl from "./ChoiseControl/ChoiceControl";

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
      <ChoiceControl
        type={type}
        name={groupId}
        value={option.value}
        checked={isSelected}
        hasError={hasError}
        onChange={onChange}
      />
      <span className={styles.optionText}>{option.value}</span>
    </label>
  );
};

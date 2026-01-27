import { type ChangeEvent, type ReactElement } from "react";
import { type Option } from "@types";
import styles from "./QuestionsInput.module.css";
import { ChoiceOption } from "../ChoiseOption/ChoiceOption";

interface InputProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  hasError: boolean;
  labelledBy?: string;
}

export const TextInput = ({ id, value, onChange, hasError, labelledBy }: InputProps): ReactElement => (
  <div className={styles.textInputWrapper}>
    <input
      id={id}
      className={`${styles.textInput} ${hasError ? styles.textInputError : ""}`}
      type="text"
      placeholder="Your answer"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(id, event.target.value)}
      aria-invalid={hasError}
      aria-labelledby={labelledBy}
    />
    <div className={styles.focusedLine} />
  </div>
);

export const DateInput = ({ id, value, onChange, hasError, labelledBy }: InputProps): ReactElement => (
  <div className={styles.dateInputWrapper}>
    <input
      id={id}
      className={`${styles.dateInput} ${hasError ? styles.dateInputError : ""}`}
      type="date"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(id, event.target.value)}
      aria-invalid={hasError}
      aria-labelledby={labelledBy}
    />
  </div>
);

type SingleValueChange = (id: string, value: string) => void;
type CheckboxChange = (id: string, value: string, checked: boolean) => void;

type ChoiceProps = {
  id: string;
  options: Option[];
  selectedValues: string[];
  hasError: boolean;
  labelledBy?: string;
} & (
  | { type: "RADIO"; onChange: SingleValueChange }
  | { type: "CHECKBOX"; onChange: CheckboxChange }
);

export const ChoiceInput = (props: ChoiceProps): ReactElement => {
  const { id, options, selectedValues, hasError, labelledBy } = props;

  return (
    <div className={styles.optionsList} role={props.type === "RADIO" ? "radiogroup" : "group"} aria-labelledby={labelledBy}>
      {options.map((option) => (
        <ChoiceOption
          key={option.id}
          groupId={id}
          option={option}
          type={props.type}
          isSelected={selectedValues.includes(option.value)}
          hasError={hasError}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (props.type === "CHECKBOX") {
              props.onChange(id, option.value, event.target.checked);
            } else {
              props.onChange(id, option.value);
            }
          }}
        />
      ))}
    </div>
  );
};
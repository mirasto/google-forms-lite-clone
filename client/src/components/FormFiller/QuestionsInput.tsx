import { type Option } from "@types";
import styles from "./QuestionsInput.module.css";

interface InputProps {
  id: string;
  onChange: (id: string, value: string) => void;
  hasError: boolean;
}

export const TextInput = ({ id, onChange, hasError }: InputProps) => (
  <div className={styles.textInputWrapper}>
    <input
      className={`${styles.textInput} ${hasError ? styles.textInputError : ""}`}
      type="text"
      placeholder="Your answer"
      onChange={(e) => onChange(id, e.target.value)}
      aria-invalid={hasError}
    />
    <div className={styles.focusedLine} />
  </div>
);

export const DateInput = ({ id, onChange, hasError }: InputProps) => (
  <div className={styles.dateInputWrapper}>
    <input
      className={`${styles.dateInput} ${hasError ? styles.dateInputError : ""}`}
      type="date"
      onChange={(e) => onChange(id, e.target.value)}
      aria-invalid={hasError}
    />
  </div>
);

interface ChoiceProps {
  id: string;
  options: Option[];
  type: "RADIO" | "CHECKBOX";
  onChange: ((id: string, value: string) => void) | ((id: string, value: string, checked: boolean) => void);
  hasError: boolean;
}

export const ChoiceInput = ({ id, options, type, onChange, hasError }: ChoiceProps) => (
  <div className={styles.optionsList}>
    {options?.map((option) => (
      <label key={option.id} className={styles.optionItem}>
        <div className={styles.controlWrapper}>
          <input
            type={type === "CHECKBOX" ? "checkbox" : "radio"}
            name={id}
            value={option.value}
            className={styles.realControl}
            onChange={(e) => {
              if (type === "CHECKBOX") {
                (onChange as (id: string, value: string, checked: boolean) => void)(id, option.value, e.target.checked);
              } else {
                (onChange as (id: string, value: string) => void)(id, option.value);
              }
            }}
          />
          <div className={`${styles.fakeControl} ${type === "CHECKBOX" ? styles.fakeCheckbox : styles.fakeRadio} ${hasError ? styles.fakeControlError : ""}`} />
        </div>
        <span className={styles.optionText}>{option.value}</span>
      </label>
    ))}
  </div>
);
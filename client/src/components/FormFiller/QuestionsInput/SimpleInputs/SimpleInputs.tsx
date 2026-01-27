import { type ChangeEvent, type ReactElement } from "react";
import styles from "./SimpleInputs.module.css";

export interface InputProps {
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

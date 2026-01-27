import type { ChangeEvent, ReactElement } from "react";
import styles from "./ChoiceControl.module.css";

interface ChoiceControlProps {
  type: "RADIO" | "CHECKBOX";
  name: string;
  value: string;
  checked: boolean;
  hasError: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ChoiceControl = ({
  type,
  name,
  value,
  checked,
  hasError,
  onChange,
}: ChoiceControlProps): ReactElement => {
  return (
    <div className={styles.controlWrapper}>
      <input
        type={type === "CHECKBOX" ? "checkbox" : "radio"}
        name={name}
        value={value}
        checked={checked}
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
  );
};
export default ChoiceControl;
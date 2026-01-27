import { type ChangeEvent, type ReactElement } from "react";

import { type Option } from "@types";

import styles from "./QuestionsInput.module.css";
import { ChoiceOption } from "../ChoiseOption/ChoiceOption";

type SingleValueChange = (id: string, value: string) => void;
type CheckboxChange = (id: string, value: string, checked: boolean) => void;
type ChoiceProps = RadioChoiceProps | CheckboxChoiceProps;

interface ChoiceBaseProps {
  id: string;
  options: Option[];
  selectedValues: string[];
  hasError: boolean;
  labelledBy?: string;
}
interface RadioChoiceProps extends ChoiceBaseProps {
  type: "RADIO";
  onChange: SingleValueChange;
}
interface CheckboxChoiceProps extends ChoiceBaseProps {
  type: "CHECKBOX";
  onChange: CheckboxChange;
}


export const ChoiceInput = (props: ChoiceProps): ReactElement => {

  const { id, options, selectedValues, hasError, labelledBy } = props;
  const handleChoiceChange = (optionValue: string, checked: boolean) => {
    if (props.type === "CHECKBOX") {
      props.onChange(id, optionValue, checked);
    } else {
      props.onChange(id, optionValue);
    }
  };
  
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
            handleChoiceChange(option.value, event.target.checked);
          }}
        />
      ))}
    </div>
  );

};
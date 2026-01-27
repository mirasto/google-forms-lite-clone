import type { ChangeEvent, ReactElement } from "react";
import Select, { type SingleValue } from "react-select";
import { QUESTION_TYPE_OPTIONS, type QuestionTypeOption } from "@config/formConfig";
import styles from "./QuestionHeader.module.css";

interface QuestionHeaderProps {
  questionText: string;
  onTextChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedType: QuestionTypeOption | undefined;
  onTypeChange: (newValue: SingleValue<QuestionTypeOption>) => void;
}

const QuestionHeader = ({
  questionText,
  onTextChange,
  selectedType,
  onTypeChange,
}: QuestionHeaderProps): ReactElement => {
  return (
    <div className={styles.questionHeader}>
      <input
        className={styles.input}
        value={questionText}
        onChange={onTextChange}
        placeholder="Question Text"
      />

      <div className={styles.selectWrapper}>
        <Select
          value={selectedType}
          onChange={onTypeChange}
          options={QUESTION_TYPE_OPTIONS}
          classNamePrefix="form-select"
        />
      </div>
    </div>
  );
};

export default QuestionHeader;

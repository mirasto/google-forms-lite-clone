import type { ChangeEvent, ReactElement } from "react";
import Select, { type SingleValue } from "react-select";
import { QuestionType, type DraftQuestion } from "@types";
import styles from "./BuilderQuestionCard.module.css";
import OptionManager from "../OptionManager/OptionManager";
import { QUESTION_TYPE_OPTIONS, type QuestionTypeOption } from "../../../config/formConfig";
import QuestionFooter from "../OptionFooter/QuestionFooter";

export interface QuestionActions {
  updateQuestion: <K extends keyof Omit<DraftQuestion, "tempId" | "options">>(
    id: string,
    field: K,
    value: DraftQuestion[K]
  ) => void;
  removeQuestion: (id: string) => void;
  addOption: (questionId: string) => void;
  updateOption: (questionId: string, optionId: string, value: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
}

export interface BuilderQuestionCardProps {
  question: DraftQuestion;
  actions: QuestionActions;
}

const BuilderQuestionCard = ({
  question,
  actions,
}: BuilderQuestionCardProps): ReactElement => {
  const showOptions =
    question.type === QuestionType.MultipleChoice ||
    question.type === QuestionType.Checkbox;

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.updateQuestion(question.tempId, "text", event.target.value);
  };

  const handleTypeChange = (newValue: SingleValue<QuestionTypeOption>) => {
    if (newValue) {
      actions.updateQuestion(question.tempId, "type", newValue.value);
    }
  };

  const handleRequiredChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.updateQuestion(question.tempId, 'required', event.target.checked);
  };

  const selectedOption: QuestionTypeOption | undefined = QUESTION_TYPE_OPTIONS.find(option => option.value === question.type);

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <input
          className={styles.input}
          value={question.text}
          onChange={handleTextChange}
          placeholder="Question Text"
        />

        <div className={styles.selectWrapper}>
          <Select
            value={selectedOption}
            onChange={handleTypeChange}
            options={QUESTION_TYPE_OPTIONS}
            classNamePrefix="form-select"
          />
        </div>
      </div>

      {showOptions && (
        <OptionManager
          questionId={question.tempId}
          type={question.type}
          options={question.options || []}
          addOption={actions.addOption}
          updateOption={actions.updateOption}
          removeOption={actions.removeOption}
        />
      )}
      <QuestionFooter
        required={question.required ?? false}
        onRequiredChange={handleRequiredChange}
        onDelete={() => actions.removeQuestion(question.tempId)}
      />
    </div>
  );
};

export default BuilderQuestionCard;

import type { ChangeEvent, ReactElement } from "react";
import { type SingleValue } from "react-select";

import { QuestionType, type DraftQuestion } from "@types";
import styles from "./BuilderQuestionCard.module.css";
import { QUESTION_TYPE_OPTIONS, type QuestionTypeOption } from "@config/formConfig";

import OptionManager from "@/components/FormBuilder/BuilderQuestionCard/OptionManager/OptionManager";
import QuestionFooter from "@/components/FormBuilder/BuilderQuestionCard/OptionFooter/QuestionFooter";
import QuestionHeader from "@/components/FormBuilder/BuilderQuestionCard/QuestionHeader/QuestionHeader";

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
  const showOptions = question.type === QuestionType.MultipleChoice || question.type === QuestionType.Checkbox;

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
      <QuestionHeader
        questionText={question.text}
        onTextChange={handleTextChange}
        selectedType={selectedOption}
        onTypeChange={handleTypeChange}
      />
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

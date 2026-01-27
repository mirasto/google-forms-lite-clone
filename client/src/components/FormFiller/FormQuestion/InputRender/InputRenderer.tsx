import type { ReactElement } from "react";
import { type Question, QuestionType } from "@types";
import { ChoiceInput } from "../../QuestionsInput/QuestionsInput";
import { TextInput, DateInput } from "../../QuestionsInput/SimpleInputs/SimpleInputs";

interface InputRendererProps {
  question: Question;
  answers: string[];
  hasError: boolean;
  labelId: string;
  currentValue: string;
  handleInputChange: (id: string, value: string) => void;
  handleCheckboxChange: (id: string, value: string, checked: boolean) => void;
}

export const renderInput = ({
  question,
  answers,
  hasError,
  labelId,
  currentValue,
  handleInputChange,
  handleCheckboxChange,
}: InputRendererProps): ReactElement | null => {
  switch (question.type) {
    case QuestionType.Text:
      return (
        <TextInput
          id={question.id}
          value={currentValue}
          onChange={handleInputChange}
          hasError={hasError}
          labelledBy={labelId}
        />
      );
    case QuestionType.Date:
      return (
        <DateInput
          id={question.id}
          value={currentValue}
          onChange={handleInputChange}
          hasError={hasError}
          labelledBy={labelId}
        />
      );
    case QuestionType.MultipleChoice:
      return (
        <ChoiceInput
          id={question.id}
          options={question.options || []}
          selectedValues={answers || []}
          type="RADIO"
          onChange={handleInputChange}
          hasError={hasError}
          labelledBy={labelId}
        />
      );
    case QuestionType.Checkbox:
      return (
        <ChoiceInput
          id={question.id}
          options={question.options || []}
          selectedValues={answers || []}
          type="CHECKBOX"
          onChange={handleCheckboxChange}
          hasError={hasError}
          labelledBy={labelId}
        />
      );
    default:
      return null;
  }
};

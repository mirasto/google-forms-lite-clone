import type { ReactElement } from "react";

import BuilderHeader from "@components/FormBuilder/BuilderHeader/BuilderHeader";
import BuilderQuestionCard from "@components/FormBuilder/BuilderQuestionCard/BuilderQuestionCard";

import { useFormBuilder } from "@hooks/useFormBuilder";
import styles from "./FormBuilder.module.css";

const FormBuilder = (): ReactElement => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    updateOption,
    removeOption,
    saveForm,
    isLoading,
  } = useFormBuilder();

  const actions = {
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
  };

  return (
    <main className={styles.container}>
      <BuilderHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onSave={saveForm}
        isLoading={isLoading}
      />

      <div className={styles.questionsList}>
        {questions.map((question) => (
          <BuilderQuestionCard
            key={question.tempId}
            question={question}
            actions={actions}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.addQuestionBtn}
        onClick={addQuestion}
        aria-label="Add new question"
      >
        Add Question
      </button>
    </main>
  );
};

export default FormBuilder;


import { useFormBuilder } from "../../hooks/useFormBuilder";


const FormBuilder = () => {
  const { title, setTitle, description, setDescription, questions, addQuestion, removeQuestion, updateQuestion, saveForm, isLoading } = useFormBuilder();

  return (
    <div className={styles.container}>
      <BuilderHeader 
        title={title} setTitle={setTitle} 
        description={description} setDescription={setDescription} 
        onSave={saveForm} isLoading={isLoading} 
      />

      <div className={styles.questionsList}>
        {questions.map((question, index) => (
          <BuilderQuestionCard
            key={question.tempId}
            index={index}
            question={question}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            // Передаємо методи для опцій нижче
            optionMethods={{ addOption, updateOption, removeOption }}
          />
        ))}
      </div>

      <button className={styles.addQuestionBtn} onClick={addQuestion}>
        + Add Question
      </button>
    </div>
  );
};
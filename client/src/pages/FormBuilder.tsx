import { QuestionType } from '../types';
import styles from './FormBuilder.module.css';
import { useFormBuilder } from '../hooks/useFormBuilder';

const FormBuilder = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
    saveForm,
    isLoading,
  } = useFormBuilder();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create form</h1>
        <button 
          className={styles.saveButton} 
          onClick={saveForm} 
          disabled={isLoading || !title}
        >
          {isLoading ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      <div className={styles.inputGroup}>
        <input
          className={`${styles.input} ${styles.titleInput}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Form Title"
        />
        <input
          className={styles.input}
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Form Description"
        />
      </div>

      {questions.map((question, questionIndex) => (
        <div key={question.tempId} className={styles.questionCard}>
          <form className={styles.questionHeader}>
            
              <input
                className={styles.input}
                type="text"
                value={question.text}
                onChange={(event) => updateQuestion(questionIndex, 'text', event.target.value)}
                placeholder="Question Text"
              />
             
            
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={question.type}
                onChange={(event) => updateQuestion(questionIndex, 'type', event.target.value as QuestionType)}
              >
                <option value={QuestionType.TEXT}>Text Answer</option>
                <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                <option value={QuestionType.CHECKBOX}>Checkboxes</option>
                <option value={QuestionType.DATE}>Date</option>
              </select>
            </div>
             <button 
                className={styles.deleteQuestionBtn} 
                onClick={() => removeQuestion(questionIndex)}
              >
                Delete
              </button>
          </form>
          <div className={styles.questionFooter}>
             
          </div>

          {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) && (
            <div className={styles.optionsList}>
              {question.options?.map((option, optionIndex) => (
                <div key={option.id} className={styles.optionRow}>
                  <input
                    type={question.type === QuestionType.MULTIPLE_CHOICE ? 'radio' : 'checkbox'}
                    disabled
                    className={styles.optionInput}
                  />
                  <input
                    className={styles.input}
                    type="text"
                    value={option.value}
                    onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <button 
                    className={styles.deleteOptionBtn}
                    onClick={() => removeOption(questionIndex, optionIndex)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                className={styles.addOptionBtn}
                onClick={() => addOption(questionIndex)}
              >
                Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <button className={styles.addQuestionBtn} onClick={addQuestion}>
        + Add Question
      </button>
    </div>
  );
};

export default FormBuilder;

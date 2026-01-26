import OptionManager from "./OptionManager";

const BuilderQuestionCard = ({ question, updateQuestion, removeQuestion, optionMethods }) => {
  const showOptions = question.type === QuestionType.MULTIPLE_CHOICE || 
                     question.type === QuestionType.CHECKBOX;

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <input
          className={styles.input}
          value={question.text}
          onChange={(e) => updateQuestion(index, "text", e.target.value)}
          placeholder="Question Text"
        />
        
        <select
          className={styles.select}
          value={question.type}
          onChange={(e) => updateQuestion(index, "type", e.target.value)}
        >
          <option value={QuestionType.TEXT}>Short Answer</option>
          <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
          <option value={QuestionType.CHECKBOX}>Checkboxes</option>
          <option value={QuestionType.DATE}>Date</option>
        </select>

        <button onClick={() => removeQuestion(index)} className={styles.deleteBtn}>
          Delete
        </button>
      </div>

      {showOptions && (
        <OptionManager
          questionIndex={index}
          type={question.type}
          options={question.options}
          {...optionMethods}
        />
      )}
    </div>
  );
};
export default BuilderQuestionCard;
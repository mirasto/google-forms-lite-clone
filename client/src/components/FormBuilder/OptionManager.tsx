const OptionManager = ({ questionIndex, type, options, addOption, updateOption, removeOption }) => {
  return (
    <div className={styles.optionsList}>
      {options?.map((option, optionIndex) => (
        <div key={option.id} className={styles.optionRow}>
          <input 
            type={type === QuestionType.MULTIPLE_CHOICE ? "radio" : "checkbox"} 
            disabled 
          />
          <input
            className={styles.input}
            value={option.value}
            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
            placeholder={`Option ${optionIndex + 1}`}
          />
          <button onClick={() => removeOption(questionIndex, optionIndex)}>×</button>
        </div>
      ))}
      <button className={styles.addOptionBtn} onClick={() => addOption(questionIndex)}>
        Add Option
      </button>
    </div>
  );
};
export default OptionManager;
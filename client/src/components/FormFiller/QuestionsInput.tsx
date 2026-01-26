import styles from "./QuestionsInput.module.css";

// 1. Текстовий інпут
export const TextInput = ({ id, onChange, hasError }) => (
  <input
    className={`${styles.input} ${hasError ? styles.inputError : ""}`}
    type="text"
    placeholder="Your answer"
    onChange={(e) => onChange(id, e.target.value)}
  />
);

// 2. Вибір дати
export const DateInput = ({ id, onChange, hasError }) => (
  <input
    className={`${styles.input} ${hasError ? styles.inputError : ""}`}
    type="date"
    onChange={(e) => onChange(id, e.target.value)}
  />
);

// 3. Радіо або Чекбокси (спільний компонент)
export const ChoiceInput = ({ id, options, type, onChange, hasError }) => (
  <div className={hasError ? styles.optionsErrorWrapper : ""}>
    {options?.map((option) => (
      <label key={option.id} className={type === 'CHECKBOX' ? styles.checkboxOption : styles.radioOption}>
        <input
          type={type === 'CHECKBOX' ? 'checkbox' : 'radio'}
          name={id}
          value={option.value}
          onChange={(e) => onChange(id, option.value, e.target.checked)}
        />
        {option.value}
      </label>
    ))}
  </div>
);
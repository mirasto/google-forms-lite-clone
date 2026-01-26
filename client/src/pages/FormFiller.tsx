import { Link } from 'react-router-dom';
import { QuestionType, type Props } from '../type';
import styles from './FormFiller.module.css';
import { useFormFiller } from '../hooks/useFormFiller';

const FormFiller = (props: Props) => {
  const {
    form,
    isFormLoading,
    formError,
    isSubmitting,
    isSuccess,
    errors,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  } = useFormFiller();

  if (isFormLoading) return <div>Loading form...</div>;
  if (formError || !form) return <div>Form not found</div>;

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.titleCard}>
          <h1 className={styles.formTitle}>{form.title}</h1>
          <p className={styles.success}>Your response has been recorded.</p>
          <Link to="/" className={styles.homeLink}>
            Submit another response or go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleCard}>
        <h1 className={styles.formTitle}>{form.title}</h1>
        <p className={styles.formDescription}>{form.description}</p>
      </div>

      {form.questions.map((question) => (
        <div key={question.id} className={styles.questionCard}>
          <div className={styles.questionText}>
            {question.text}
            
          </div>
          
          {question.type === QuestionType.TEXT && (
            <input
              className={`${styles.input} ${errors[question.id] ? styles.inputError : ''}`}
              type="text"
              placeholder="Your answer"
              onChange={(event) => handleInputChange(question.id, event.target.value)}
            />
          )}

          {question.type === QuestionType.DATE && (
            <input
              className={`${styles.input} ${errors[question.id] ? styles.inputError : ''}`}
              type="date"
              onChange={(event) => handleInputChange(question.id, event.target.value)}
            />
          )}

          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className={errors[question.id] ? styles.inputError : ''} style={errors[question.id] ? {border: '1px solid #d93025', borderRadius: '4px', padding: '10px'} : {}}>
              {question.options?.map((option) => (
                <label key={option.id} className={styles.radioOption}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name={question.id}
                    value={option.value}
                    onChange={(event) => handleInputChange(question.id, event.target.value)}
                  />
                  {option.value}
                </label>
              ))}
            </div>
          )}

          {question.type === QuestionType.CHECKBOX && (
            <div className={errors[question.id] ? styles.inputError : ''} style={errors[question.id] ? {border: '1px solid #d93025', borderRadius: '4px', padding: '10px'} : {}}>
              {question.options?.map((option) => (
                <label key={option.id} className={styles.checkboxOption}>
                  <input
                    className={styles.checkboxInput}
                    type="checkbox"
                    value={option.value}
                    onChange={(event) => handleCheckboxChange(question.id, option.value, event.target.checked)}
                  />
                  {option.value}
                </label>
              ))}
            </div>
          )}

          {errors[question.id] && (
            <div className={styles.error}>
              <svg height="24" viewBox="0 0 24 24" width="24" focusable="false" fill="#d93025">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              {errors[question.id]}
            </div>
          )}
        </div>
      ))}

      <button 
        className={styles.submitButton} 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default FormFiller;

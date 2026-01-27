import { Link } from "react-router-dom";
import { useFormFiller } from "../../hooks/useFormFiller";
import styles from "./FormFiller.module.css";
import FormQuestions from "../../components/FormFiller/FormQuestions";

const FormFiller = () => {
  const {
    form, isFormLoading, formError, isSubmitting,
    isSuccess, errors, handleInputChange,
    handleCheckboxChange, handleSubmit,
  } = useFormFiller();

  if (isFormLoading) {
    return (
      <div className={styles.centered}>
        <div className={styles.loader}>Loading form...</div>
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className={styles.centered}>
        <div className={styles.errorCard}>
          <h2>Form not found</h2>
          <p>The form you are looking for does not exist or has been deleted.</p>
          <Link to="/" className={styles.homeButton}>Go back home</Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.accentBar} />
          <h1 className={styles.successTitle}>{form.title}</h1>
          <p className={styles.successText}>Your response has been recorded.</p>
          <div className={styles.successActions}>
            <Link to="/" className={styles.homeLink}>Submit another response</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.titleCard}>
        <div className={styles.accentBar} />
        <h1 className={styles.formTitle}>{form.title}</h1>
        {form.description && (
          <p className={styles.formDescription}>{form.description}</p>
        )}
        <div className={styles.divider} />
        
      </header>

      <form className={styles.questionsList} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {form.questions.map((question) => (
          <FormQuestions
            key={question.id}
            question={question}
            errors={errors}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default FormFiller;
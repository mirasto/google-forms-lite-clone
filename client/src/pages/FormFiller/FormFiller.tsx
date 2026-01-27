import { Link } from "react-router-dom";
import type { ReactElement } from "react";

import { useFormFiller } from "@hooks/useFormFiller";
import styles from "./FormFiller.module.css";

import FormQuestions from "@components/FormFiller/FormQuestion/FormQuestions";

const FormFiller = (): ReactElement => {
  const {
    form, isFormLoading, formError, isSubmitting,
    isSuccess, answers, errors, handleInputChange,
    handleCheckboxChange, handleSubmit,
  } = useFormFiller();

  if (isFormLoading) {
    return (
      <div className={styles.centered} role="status" aria-live="polite">
        <div className={styles.loader}>Loading form...</div>
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className={styles.centered} role="alert">
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
      <main className={styles.container} role="main">
        <div className={styles.successCard}>
          <div className={styles.accentBar} />
          <h1 className={styles.successTitle}>{form.title}</h1>
          <p className={styles.successText}>Your response has been recorded.</p>
          <div className={styles.successActions}>
            <Link to="/" className={styles.homeLink}>Submit another response</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.titleCard}>
        <div className={styles.accentBar} />
        <h1 className={styles.formTitle}>{form.title}</h1>
        {form.description && (
          <p className={styles.formDescription}>{form.description}</p>
        )}
        <div className={styles.divider} />
        
      </header>

      <form className={styles.questionsList} onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
        {form.questions.map((question) => (
          <FormQuestions
            key={question.id}
            question={question}
            answers={answers[question.id] || []}
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

    </main>
  );
};

export default FormFiller;
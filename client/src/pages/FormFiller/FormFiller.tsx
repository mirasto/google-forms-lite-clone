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

  if (isFormLoading) return <div className={styles.loader}>Loading...</div>;
  if (formError || !form) return <div>Form not found</div>;

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h1>{form.title}</h1>
          <p>Your response has been recorded.</p>
          <Link to="/" className={styles.homeLink}>Go Home</Link>
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
          <FormQuestions 
            key={question.id}
            question={question}
            errors={errors}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange} 
          />
        ))}
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
    </div>
  );
};

export default FormFiller;
// @ts-nocheck
import styles from './Forms.module.css';
import { Link } from 'react-router-dom';

const Forms = ({form}) => {
  return (
    <>
      <div key={form.id} className={styles.formCard}>
          <h3 className={styles.formTitle}>{form.title}</h3>
          <p className={styles.formDescription}>{form.description}</p>
          <div className={styles.actions}>
            <Link to={`/forms/${form.id}/fill`} className={styles.link}>
              View Form
            </Link>
            <Link to={`/forms/${form.id}/responses`} className={styles.link}>
              View Responses
            </Link>
          </div>
        </div>
    </>
  );
};

export default Forms;

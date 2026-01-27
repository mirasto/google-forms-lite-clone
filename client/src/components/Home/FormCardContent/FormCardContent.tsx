import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { Form } from '@types';
import styles from '../FormsCard.module.css';

interface FormCardContentProps {
  form: Pick<Form, 'id' | 'title' | 'description'>;
}

const FormCardContent = ({ form }: FormCardContentProps): ReactElement => {
  return (
    <>
      <h3 className={styles.formTitle} title={form.title}>
        {form.title}
      </h3>
      <p className={styles.formDescription}>
        {form.description || 'No description provided'}
      </p>
      <div className={styles.actions}>
        <Link 
          to={`/forms/${form.id}/fill`} 
          className={styles.actionLink}
          aria-label={`Fill form: ${form.title}`}
        >
          Fill
        </Link>
        <Link 
          to={`/forms/${form.id}/responses`} 
          className={styles.actionLink}
          aria-label={`View responses for form: ${form.title}`}
        >
          Responses
        </Link>
      </div>
    </>
  );
};

export default FormCardContent;

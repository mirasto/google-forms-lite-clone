import { Link } from 'react-router-dom';

import type { Form } from '@types';
import type { ReactElement } from 'react';

import styles from './FormsCard.module.css';

interface FormsCardProps {
  form: Pick<Form, 'id' | 'title' | 'description'>;
}

const FormsCard = ({ form }: FormsCardProps): ReactElement => {
  return (
    <article className={styles.formCard}>
      <div className={styles.thumbnail}>
        <div className={styles.formTitle} aria-hidden="true">{form.title}</div>
      </div>
      <div className={styles.cardContent}>
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
      </div>
    </article>
  );
};

export default FormsCard;

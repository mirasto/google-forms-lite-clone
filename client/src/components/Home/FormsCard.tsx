import type { Form } from '@types';
import type { ReactElement } from 'react';

import styles from './FormsCard.module.css';
import FormCardContent from './FormCardContent/FormCardContent';

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
        <FormCardContent form={form} />
      </div>
    </article>
  );
};

export default FormsCard;

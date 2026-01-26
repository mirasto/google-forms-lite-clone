import { Link } from 'react-router-dom';
import type { Form } from '../../type';
import styles from './FormsCard.module.css';

interface FormsCardProps {
  form: Form;
}

const FormsCard = ({ form }: FormsCardProps) => {
  return (
    <div className={styles.formCard}>
      <div className={styles.thumbnail}>
        <div className={styles.formTitle}>{form.title}</div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.formTitle} title={form.title}>
          {form.title}
        </h3>
        <p className={styles.formDescription}>
          {form.description || 'No description provided'}
        </p>
        <div className={styles.actions}>
          <Link to={`/forms/${form.id}/fill`} className={styles.actionLink}>
            Fill
          </Link>
          <Link to={`/forms/${form.id}/responses`} className={styles.actionLink}>
            Responses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormsCard;

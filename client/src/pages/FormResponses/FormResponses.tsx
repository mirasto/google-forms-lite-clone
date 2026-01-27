import { Link, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';
import ResponsesList from '../../components/FormResponses/ResponsesList';
import { useGetFormQuery, useGetResponsesQuery } from '../../store/api';
import styles from './FormResponses.module.css';

const FormResponses = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: isFormLoading } = useGetFormQuery(id!);
  const { data: responses, isLoading: isResponsesLoading } = useGetResponsesQuery(id!);

  if (isFormLoading || isResponsesLoading) {
    return (
      <div className={styles.centered} role="status" aria-live="polite">
        <div className={styles.loader}>Loading responses...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className={styles.centered} role="alert">
        <div className={styles.errorCard}>
          <h2>Form not found</h2>
          <Link to="/" className={styles.homeLink}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <Link to="/" className={styles.backLink}>
        &larr; Back to Forms
      </Link>

      <header className={styles.header}>
        <div className={styles.accentBar} />
        <h1 className={styles.title}>{form.title}</h1>
        <div className={styles.statsRow}>
          <span className={styles.responseCount}>
            {responses?.length || 0} responses
          </span>
        </div>
      </header>

      <section className={styles.responsesSection} aria-label="Responses list">
        {responses && responses.length > 0 ? (
          responses.map((response, index) => (
            <ResponsesList
              key={response.id}
              response={response}
              form={form}
              index={index}
            />
          ))
        ) : (
          <div className={styles.noResponses}>
            <p>No responses yet for this form.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default FormResponses;

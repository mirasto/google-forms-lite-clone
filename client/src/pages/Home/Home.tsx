import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import FormsCard from '../../components/Home/FormsCard';
import { useGetFormsQuery } from '../../store/api.enhanced';
import styles from './Home.module.css';

const Home = (): ReactElement => {
  const { data, isLoading, error } = useGetFormsQuery();
  const forms = data?.forms;

  if (isLoading) {
    return (
      <div className={styles.centered} role="status" aria-live="polite">
        <div className={styles.loader}>Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered} role="alert">
        <div className={styles.error}>
          <p>Error loading forms. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Forms</h1>
        <Link to="/forms/new" className={styles.createButton} aria-label="Create a new form">
          <span aria-hidden="true">+</span> Create New Form
        </Link>
      </header>

      <section className={styles.content} aria-label="Forms list">
        {forms && forms.length > 0 ? (
          <div className={styles.formGrid}>
            {forms.map(form => (
              <FormsCard key={form.id} form={form} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No forms yet</h3>
            <p>Create your first form to start collecting responses.</p>
            <Link to="/forms/new" className={styles.emptyButton}>
              Get Started
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;

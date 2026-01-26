import { Link } from 'react-router-dom';
import FormsCard from '../../components/Home/FormsCard';
import { useGetFormsQuery } from '../../store/api';
import styles from './Home.module.css';

const Home = () => {
  const { data: forms, isLoading, error } = useGetFormsQuery();

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <div className={styles.loader}>Loading forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <div className={styles.error}>
          <p>Error loading forms. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Forms</h1>
        <Link to="/forms/new" className={styles.createButton}>
          <span>+</span> Create New Form
        </Link>
      </header>

      <section className={styles.content}>
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
    </div>
  );
};

export default Home;

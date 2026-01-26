
import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../store/api';
import styles from './Home.module.css';

const Home = () => {
  const { data: forms, isLoading, error } = useGetFormsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading forms</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Google Forms Clone</h1>
        <Link to="/forms/new" className={styles.createButton}>
          + Create New Form
        </Link>
      </div>

      <div className={styles.formList}>
        {forms?.map((form) => (
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
        ))}
      </div>
      {forms?.length === 0 && <p>No forms created yet.</p>}
    </div>
  );
};

export default Home;

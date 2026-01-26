// @ts-nocheck
import { Link } from 'react-router-dom';
import Forms from '../../components/Home/FormsCard';
import { useGetFormsQuery } from '../../store/api';
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
          Create New Form
        </Link>
      </div>
      <div className={styles.formList}>
        {forms?.map(form => (
          <Forms key={form.id} form={form} />
        ))}
      </div>
      {forms?.length === 0 && <p>No forms created yet.</p>}
    </div>
  );
};

export default Home;

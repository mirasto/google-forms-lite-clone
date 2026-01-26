// @ts-nocheck
import { Link, useParams } from 'react-router-dom';
import Responses from '../../components/FormResponses/ResponsesList';
import { useGetFormQuery, useGetResponsesQuery } from '../../store/api';
import { type Question } from '../../type';
import styles from './FormResponses.module.css';

const FormResponses = () => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: isFormLoading } = useGetFormQuery(id!);
  const { data: responses, isLoading: isResponsesLoading } = useGetResponsesQuery(id!);

 

  if (isFormLoading || isResponsesLoading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        &larr; Back to Forms
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>{form.title} - Responses</h1>
        <p className={styles.subtitle}>{responses?.length || 0} responses</p>
      </div>
      {responses.map((response) => (
        <ResponsesList
          key={response.id}
          response={response}
        />))}
    </div>
  );
};

export default FormResponses;

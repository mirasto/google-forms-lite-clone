
import { useParams, Link } from 'react-router-dom';
import { useGetFormQuery, useGetResponsesQuery } from '../store/api';
import styles from './FormResponses.module.css';

const FormResponses = () => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: isFormLoading } = useGetFormQuery(id!);
  const { data: responses, isLoading: isResponsesLoading } = useGetResponsesQuery(id!);

  if (isFormLoading || isResponsesLoading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  const getQuestionText = (questionId: string) => {
    return form.questions.find((question: { id: string }) => question.id === questionId)?.text || 'Unknown Question';
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>&larr; Back to Forms</Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{form.title} - Responses</h1>
        <p className={styles.subtitle}>{responses?.length || 0} responses</p>
      </div>

      {responses && responses.length > 0 ? (
        responses.map((response: { id: string; answers: { questionId: string; values: string[] }[] }, index: number) => (
          <div key={response.id} className={styles.responseCard}>
            <div className={styles.responseHeader}>Response #{index + 1}</div>
            {response.answers.map((answer: { questionId: string; values: string[] }) => (
              <div key={answer.questionId} className={styles.answerRow}>
                <div className={styles.questionText}>{getQuestionText(answer.questionId)}</div>
                <div className={styles.answerText}>
                  {answer.values.join(', ') || <span className={styles.noAnswer}>(No answer)</span>}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className={styles.noResponses}>No responses yet.</div>
      )}
    </div>
  );
};

export default FormResponses;

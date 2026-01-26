import ResponsesAnswer from "./ResponsesAnswer";

// @ts-nocheck
const Responses = ({response}) => {
  return (
    <>
      {response && response.length > 0 ? (
        
        <div key={response.id} className={styles.responseCard}>
            <div className={styles.responseHeader}>Response #{index + 1}</div>
              {response.answers.map((answer: Answer) => (
              <ResponsesAnswer key={answer.questionId} answer={answer} />
            ))}
          </div>
      ) : (
        <div className={styles.noResponses}>No responses yet.</div>
      )}
    </>
  );
};

export default Responses;
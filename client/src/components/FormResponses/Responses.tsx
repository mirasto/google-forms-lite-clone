const Responses = ({responses}) => {
  return (
    <>
      {responses && responses.length > 0 ? (
        responses.map((response: Response, index: number) => (
          <div key={response.id} className={styles.responseCard}>
            <div className={styles.responseHeader}>Response #{index + 1}</div>
            {response.answers.map((answer: Answer) => (
              <div key={answer.questionId} className={styles.answerRow}>
                <div className={styles.questionText}>
                  {getQuestionText(answer.questionId)}
                </div>
                <div className={styles.answerText}>
                  {answer.values.join(", ") || (
                    <span className={styles.noAnswer}>(No answer)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className={styles.noResponses}>No responses yet.</div>
      )}
    </>
  );
};

export default Responses;
const ResponsesAnswer = () => {
  const getQuestionText = (questionId: string) => {
    return (
      form.questions.find((question: Question) => question.id === questionId)?.text ||
      'Unknown Question'
    );
  };
  return (
    <>
      <div key={answer.questionId} className={styles.answerRow}>
        <div className={styles.questionText}>{getQuestionText(answer.questionId)}</div>
        <div className={styles.answerText}>
          {answer.values.join(', ') || <span className={styles.noAnswer}>(No answer)</span>}
        </div>
      </div>
    </>
  );
};

export default ResponsesAnswer;

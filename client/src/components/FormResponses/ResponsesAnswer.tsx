import { type Answer, type Form } from "../../type";
import styles from "./ResponsesAnswer.module.css";

interface ResponsesAnswerProps {
  answer: Answer;
  form: Form;
}

const ResponsesAnswer = ({ answer, form }: ResponsesAnswerProps) => {
  const getQuestionText = (questionId: string) => {
    return (
      form.questions.find((q) => q.id === questionId)?.text ||
      'Unknown Question'
    );
  };

  return (
    <div className={styles.answerRow}>
      <div className={styles.questionText}>
        {getQuestionText(answer.questionId)}
      </div>
      <div className={styles.answerText}>
        {answer.values.length > 0 ? (
          answer.values.join(', ')
        ) : (
          <span className={styles.noAnswer}>(No answer provided)</span>
        )}
      </div>
    </div>
  );
};

export default ResponsesAnswer;

import { type Form, type Response } from "@types";
import ResponsesAnswer from "./ResponsesAnswer";
import styles from "./ResponsesList.module.css";

interface ResponsesListProps {
  response: Response;
  form: Form;
  index: number;
}

const ResponsesList = ({ response, form, index }: ResponsesListProps) => {
  return (
    <div className={styles.responseCard}>
      <div className={styles.responseHeader}>Response #{index + 1}</div>
      <div className={styles.answersList}>
        {response.answers.map((answer) => (
          <ResponsesAnswer
            key={answer.questionId}
            answer={answer}
            form={form}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsesList;
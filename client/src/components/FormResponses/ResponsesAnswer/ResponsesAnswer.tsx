import { type ReactElement } from "react";
import { type Answer } from "@types";

import styles from "./ResponsesAnswer.module.css";

interface ResponsesAnswerProps {
  answer: Answer;
  questionText: string;
}

const ResponsesAnswer = ({ answer, questionText }: ResponsesAnswerProps): ReactElement => {
  return (
    <div className={styles.answerRow}>
      <div className={styles.questionText}>
        {questionText}
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

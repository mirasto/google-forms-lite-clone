import { type ReactElement } from "react";
import { type Form, type Response } from "@types";

import ResponsesAnswer from "@components/FormResponses/ResponsesAnswer/ResponsesAnswer";
import styles from "./ResponsesList.module.css";

interface ResponsesListProps {
  response: Response;
  form: Form;
  index: number;
}

const ResponsesList = ({ response, form, index }: ResponsesListProps): ReactElement => {
  const questionTextMap = form.questions.reduce<Record<string, string>>((map, question) => {
    map[question.id] = question.text;
    return map;
  }, {});

  return (
    <div className={styles.responseCard}>
      <div className={styles.responseHeader}>Response #{index + 1}</div>
      <div className={styles.answersList}>
        {response.answers.map((answer) => (
          <ResponsesAnswer
            key={answer.questionId}
            answer={answer}
            questionText={questionTextMap[answer.questionId] || 'Unknown Question'}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsesList;
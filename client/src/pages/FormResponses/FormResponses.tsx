import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../../store/api";
import {
  type Answer,
  type Props,
  type Question,
  type Response,
} from "../../type";
import styles from "./FormResponses.module.css";
import Responses from "../../components/FormResponses/Responses";

const FormResponses: React.FC<Props> = ({ className, ...props }) => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: isFormLoading } = useGetFormQuery(id!);
  const { data: responses, isLoading: isResponsesLoading } =
    useGetResponsesQuery(id!);

  if (isFormLoading || isResponsesLoading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  const getQuestionText = (questionId: string) => {
    return (
      form.questions.find((question: Question) => question.id === questionId)
        ?.text || "Unknown Question"
    );
  };

  return (
    <div className={`${styles.container} ${className || ""}`} {...props}>
      <Link to="/" className={styles.backLink}>
        &larr; Back to Forms
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{form.title} - Responses</h1>
        <p className={styles.subtitle}>{responses?.length || 0} responses</p>
      </div>

      <Responses responses={responses}/>
    </div>
  );
};

export default FormResponses;

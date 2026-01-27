import type { ChangeEvent, ReactElement } from "react";
import styles from "./QuestionFooter.module.css";

export interface QuestionFooterProps {
  required: boolean;
  onRequiredChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

const QuestionFooter = ({
  required,
  onRequiredChange,
  onDelete,
}: QuestionFooterProps): ReactElement => {
  return (
    <div className={styles.questionFooter}>
      <label className={styles.requiredLabel}>
        Required
        <input
          type="checkbox"
          checked={required}
          onChange={onRequiredChange}
        />
      </label>
      <button
        onClick={onDelete}
        className={styles.deleteBtn}
        title="Remove question"
        aria-label="Remove question"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
};

export default QuestionFooter;

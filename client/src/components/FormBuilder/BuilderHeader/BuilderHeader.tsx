import type { ChangeEvent, ReactElement } from "react";
import styles from "./BuilderHeader.module.css";

export interface BuilderHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

const BuilderHeader = ({
  title,
  setTitle,
  description,
  setDescription,
  onSave,
  isLoading,
}: BuilderHeaderProps): ReactElement => {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.topActions}>
        <h1 className={styles.pageTitle}>Create New Form</h1>
        <button
          className={styles.saveButton}
          onClick={onSave}
          disabled={isLoading || !title.trim()}
          type="button"
        >
          {isLoading ? "Saving..." : "Save Form"}
        </button>
      </div>

      <div className={styles.mainInfoCard}>
        <div className={styles.accentBar} />

        <input
          className={styles.titleInput}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Form"
        />

        <textarea
          className={styles.descriptionInput}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Form description"
        />
      </div>
    </header>
  );
};

export default BuilderHeader;
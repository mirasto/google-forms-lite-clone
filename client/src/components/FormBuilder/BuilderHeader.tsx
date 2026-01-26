import styles from "./BuilderHeader.module.css";

interface BuilderHeaderProps {
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
}: BuilderHeaderProps) => {
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          aria-label="Form Title"
        />

        <textarea
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Form description"
          aria-label="Form Description"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>
    </header>
  );
};

export default BuilderHeader;
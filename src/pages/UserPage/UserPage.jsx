import styles from './UserPage.module.css';

const PageNotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Page not found</h1>
      <div className={styles.errorCode}>404</div>
      <p>We can’t seem to find the page you’re looking for.</p>
    </div>
  );
};

export default PageNotFound;

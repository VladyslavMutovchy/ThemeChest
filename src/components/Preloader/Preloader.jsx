import React from 'react';
import styles from './Preloader.module.css';

const Preloader = () => (
  <div className={styles.overlay}>
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
      <p className={styles.text}>Loading...</p>
    </div>
  </div>
);

export default Preloader;

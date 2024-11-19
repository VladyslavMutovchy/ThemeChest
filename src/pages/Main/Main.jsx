import React from 'react';
import styles from './Main.module.css';
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>ThemeChest</h1>
          <p>Your treasure chest of guides on any topic.</p>
          <Link to="/guides" className={styles.startButton}>
            Guides
          </Link>
        </header>

        <section className={styles.aboutSection}>
          <h2>About Us</h2>
          <p>ThemeChest is a platform for finding and creating concise guides. We help you quickly find answers to your questions.</p>
        </section>

        <section className={styles.popularGuides}>
          <h2>Popular Guides</h2>
          <div className={styles.guidesGrid}>
            <div className={styles.guideCard}>How to Set Up React</div>
            <div className={styles.guideCard}>JavaScript Basics</div>
            <div className={styles.guideCard}>Building APIs with Nest.js</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Main;

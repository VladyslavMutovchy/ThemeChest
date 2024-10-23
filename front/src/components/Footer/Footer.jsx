import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';


import styles from './Footer.module.css';

const currentYear = moment().format('YYYY');

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.navigationWrapper}>
      </div>
      <p>Cleat Line Footer</p>
      <div className={styles.line} />
      <Link to="/" className={styles.privacyLink}>
        Privacy policy
      </Link>
      <div className={styles.copyright}>
        © {currentYear} lorem
      </div>
    </footer>
  );
};

export default Footer;
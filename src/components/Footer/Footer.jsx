import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const currentYear = moment().format('YYYY');

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.contacts}>
          <h3>Contacts</h3>
          <p>Email: support@themechest.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <div>
            <Link to="/" className={styles.navItem}>
              Main
            </Link>
            <Link to="/guides" className={styles.navItem}>
              Guides
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© {currentYear} V.Mutovchy</p>
        <p>Created with a love for knowledge.</p>
      </div>
    </footer>
  );
};

export default Footer;

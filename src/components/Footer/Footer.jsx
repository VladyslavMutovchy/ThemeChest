import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { Button } from '../UI';

const currentYear = moment().format('YYYY');

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>ThemeChest</h3>
            <p className={styles.sectionText}>
              Your ultimate destination for high-quality guides and tutorials on various topics.
              Create, share, and discover knowledge with our community.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linksList}>
              <li><Link to="/" className={styles.footerLink}>Home</Link></li>
              <li><Link to="/guides" className={styles.footerLink}>Guides</Link></li>
              <li><Link to="/AiCreator" className={styles.footerLink}>AI Creator</Link></li>
              <li><Link to="/creator" className={styles.footerLink}>Creator</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>support@themechest.com</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>📱</span>
                <span>+123 456 7890</span>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Newsletter</h3>
            <p className={styles.sectionText}>Subscribe to our newsletter for the latest updates.</p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Your email" className={styles.newsletterInput} />
              <Button variant="primary" size="small">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>© {currentYear} ThemeChest. All rights reserved.</p>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/privacy" className={styles.footerBottomLink}>Privacy Policy</Link>
            <Link to="/terms" className={styles.footerBottomLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

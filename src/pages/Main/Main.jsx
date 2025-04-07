import React from 'react';
import styles from './Main.module.css';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/UI';

const Main = () => {
  return (
    <div className={styles.mainPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover and Create Amazing Guides</h1>
          <p className={styles.heroSubtitle}>
            Your treasure chest of knowledge on any topic. Find, create, and share guides with the community.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/guides">
              <Button variant="primary" size="large">Browse Guides</Button>
            </Link>
            <Link to="/AiCreator">
              <Button variant="outline_white_bg" size="large">Create with AI</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose ThemeChest?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📚</div>
            <h3 className={styles.featureTitle}>Comprehensive Guides</h3>
            <p className={styles.featureDescription}>
              Access detailed guides on various topics, from technology to lifestyle.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤖</div>
            <h3 className={styles.featureTitle}>AI-Powered Creation</h3>
            <p className={styles.featureDescription}>
              Create professional guides in minutes with our AI assistant.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>Community Driven</h3>
            <p className={styles.featureDescription}>
              Join a community of knowledge seekers and contributors.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Guides Section */}
      <section className={styles.popularSection}>
        <h2 className={styles.sectionTitle}>Popular Guides</h2>
        <div className={styles.guidesGrid}>
          <Card className={styles.guideCard}>
            <div className={styles.guideCardContent}>
              <h3 className={styles.guideCardTitle}>Getting Started with React</h3>
              <p className={styles.guideCardDescription}>
                Learn the basics of React and build your first application.
              </p>
              <Link to="/guides" className={styles.guideCardLink}>Read More</Link>
            </div>
          </Card>
          <Card className={styles.guideCard}>
            <div className={styles.guideCardContent}>
              <h3 className={styles.guideCardTitle}>JavaScript Fundamentals</h3>
              <p className={styles.guideCardDescription}>
                Master the core concepts of JavaScript programming.
              </p>
              <Link to="/guides" className={styles.guideCardLink}>Read More</Link>
            </div>
          </Card>
          <Card className={styles.guideCard}>
            <div className={styles.guideCardContent}>
              <h3 className={styles.guideCardTitle}>Building APIs with Nest.js</h3>
              <p className={styles.guideCardDescription}>
                Create robust backend services using Nest.js framework.
              </p>
              <Link to="/guides" className={styles.guideCardLink}>Read More</Link>
            </div>
          </Card>
        </div>
        <div className={styles.viewAllContainer}>
          <Link to="/guides">
            <Button variant="secondary">View All Guides</Button>
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Share Your Knowledge?</h2>
          <p className={styles.ctaDescription}>
            Create your own guides and help others learn from your expertise.
          </p>
          <Link to="/creator">
            <Button variant="primary" size="large">Start Creating</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Main;

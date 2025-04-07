import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AiCreator.module.css';
import { connect } from 'react-redux';
import { aiCreateGuide } from './../../actions/aiCreator';
import { Button, Card, Input } from '../../components/UI';
import { Link } from 'react-router-dom';

const AiCreator = ({ userData, aiCreateGuide }) => {
  const [formValues, setFormValues] = useState({
    theme: '',
    difficulty: 1,
    chapters: 3,
    detailLevel: 3,
    video: false,
  });

  const difficultyLevels = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Expert',
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formValues.theme.trim()) {
        toast.error('Theme is required.');
        return;
      }

      const guideData = {
        theme: formValues.theme,
        difficulty: formValues.difficulty,
        chapters: formValues.chapters,
        detailLevel: formValues.detailLevel,
        video: formValues.video,
        userId: userData.id,
      };

      await aiCreateGuide(guideData);
      toast.success('Guide created successfully!');
    } catch (error) {
      console.error('Error creating guide:', error);
      toast.error('Failed to create guide.');
    }
  };

  return (
    <div className={styles.aiCreatorPage}>
      <div className={styles.aiCreatorHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>AI Guide Creator</h1>
          <p className={styles.pageDescription}>
            Create the perfect guide in just a few clicks using our AI-powered tool
          </p>
        </div>
      </div>

      <div className={styles.aiCreatorContent}>
        <div className={styles.container}>
          <div className={styles.aiCreatorLayout}>
            {/* Main Content */}
            <div className={styles.mainContent}>
              <Card className={styles.creatorCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Create Your Guide</h2>
                  <p className={styles.cardDescription}>
                    Customize your guide by selecting the topic, difficulty level, number of chapters, and level of detail.
                    Our AI will generate a comprehensive guide tailored to your specifications.
                  </p>
                </div>

                <div className={styles.formContainer}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Theme (up to 300 characters)</label>
                    <Input
                      type="text"
                      name="theme"
                      value={formValues.theme}
                      onChange={handleFormChange}
                      maxLength={300}
                      placeholder="Enter the guide's theme"
                      fullWidth
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.sliderLabelContainer}>
                      <label className={styles.formLabel}>Difficulty</label>
                      <span className={styles.sliderValue}>{difficultyLevels[Number(formValues.difficulty)]}</span>
                    </div>
                    <div className={styles.sliderContainer}>
                      <input
                        type="range"
                        name="difficulty"
                        min="1"
                        max="4"
                        value={formValues.difficulty}
                        onChange={handleFormChange}
                        className={styles.slider}
                      />
                      <div className={styles.sliderMarkers}>
                        <span>Beginner</span>
                        <span className={styles.sliderMarkerEnd}>Expert</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.sliderLabelContainer}>
                      <label className={styles.formLabel}>Chapters</label>
                      <span className={styles.sliderValue}>{formValues.chapters === '0' ? 'Auto' : formValues.chapters}</span>
                    </div>
                    <div className={styles.sliderContainer}>
                      <input
                        type="range"
                        name="chapters"
                        min="0"
                        max="6"
                        value={formValues.chapters}
                        onChange={handleFormChange}
                        className={styles.slider}
                      />
                      <div className={styles.sliderMarkers}>
                        <span>Auto</span>
                        <span className={styles.sliderMarkerEnd}>6</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.sliderLabelContainer}>
                      <label className={styles.formLabel}>Detail Level</label>
                      <span className={styles.sliderValue}>{formValues.detailLevel}</span>
                    </div>
                    <div className={styles.sliderContainer}>
                      <input
                        type="range"
                        name="detailLevel"
                        min="1"
                        max="6"
                        value={formValues.detailLevel}
                        onChange={handleFormChange}
                        className={styles.slider}
                      />
                      <div className={styles.sliderMarkers}>
                        <span>Basic</span>
                        <span className={styles.sliderMarkerEnd}>Detailed</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="video"
                        checked={formValues.video}
                        onChange={handleFormChange}
                        className={styles.checkbox}
                      />
                      <span>Allow YouTube video links in the guide</span>
                    </label>
                  </div>

                  <div className={styles.formActions}>
                    <Button variant="primary" onClick={handleSubmit}>Create Guide</Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              <Card className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>How It Works</h3>
                <ol className={styles.stepsList}>
                  <li className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Enter a Theme</h4>
                      <p className={styles.stepDescription}>Specify what you want your guide to be about</p>
                    </div>
                  </li>
                  <li className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Customize Settings</h4>
                      <p className={styles.stepDescription}>Adjust difficulty, chapters, and detail level</p>
                    </div>
                  </li>
                  <li className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Generate Guide</h4>
                      <p className={styles.stepDescription}>Our AI creates your custom guide</p>
                    </div>
                  </li>
                  <li className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>Share Knowledge</h4>
                      <p className={styles.stepDescription}>Your guide is published for the community</p>
                    </div>
                  </li>
                </ol>
              </Card>

              <Card className={styles.tipsCard}>
                <h3 className={styles.infoCardTitle}>Tips for Great Guides</h3>
                <ul className={styles.tipsList}>
                  <li className={styles.tip}>Be specific with your theme</li>
                  <li className={styles.tip}>Choose appropriate difficulty level</li>
                  <li className={styles.tip}>Higher detail level means more comprehensive content</li>
                  <li className={styles.tip}>Enable video links for visual learning</li>
                </ul>
                <div className={styles.tipActions}>
                  <Link to="/guides">
                    <Button variant="outline" fullWidth>Browse Existing Guides</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  aiCreateGuide,
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(AiCreator);

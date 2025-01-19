import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AiCreator.module.css';
import { connect } from 'react-redux';
import { aiCreateGuide } from './../../actions/aiCreator';

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
    <div className={styles.wrapper}>
      <h2 className={styles.title}>AI Guide Creator</h2>
      <p className={styles.description}>
        Didn't find the guide you were looking for in the list? Create the perfect one in just a few clicks! Customize your guide by selecting the
        topic, difficulty level, number of chapters, and level of detail. This tool helps you generate practical guides tailored to your needs.
      </p>

      <div className={styles.form}>
        <label className={styles.label}>Theme (up to 300 characters)</label>
        <input
          type="text"
          name="theme"
          value={formValues.theme}
          onChange={handleFormChange}
          maxLength={300}
          className={styles.input}
          placeholder="Enter the guide's theme"
        />

        <label className={styles.label}>Difficulty ({difficultyLevels[Number(formValues.difficulty)]})</label>
        <input type="range" name="difficulty" min="1" max="4" value={formValues.difficulty} onChange={handleFormChange} className={styles.slider} />

        <label className={styles.label}>Chapters ({formValues.chapters === '0' ? 'Auto' : formValues.chapters})</label>
        <input type="range" name="chapters" min="0" max="6" value={formValues.chapters} onChange={handleFormChange} className={styles.slider} />

        <label className={styles.label}>Detail Level ({formValues.detailLevel})</label>
        <input type="range" name="detailLevel" min="1" max="6" value={formValues.detailLevel} onChange={handleFormChange} className={styles.slider} />

        <label className={styles.checkbox_label}>
          <input type="checkbox" name="video" checked={formValues.video} onChange={handleFormChange} className={styles.checkbox} />
          Allow YouTube video links
        </label>

        <button type="button" onClick={handleSubmit} className={styles.submit_button}>
          Create Guide
        </button>
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

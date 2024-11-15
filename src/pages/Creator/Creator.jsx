import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './Creator.module.css';
import { connect } from 'react-redux';
import {
  createGuide,
  getGuidesData,
  updateGuideThemes,
  getGuideThemes,
  updateGuideChapters,
  getGuideChapters,
} from '../../actions/creator';
import CreateGuideForm from '../../components/CreatorsComponents/CreateGuideFrom';
import EditThemesForm from '../../components/CreatorsComponents/EditThemesForm';
import ChaptersForm from '../../components/CreatorsComponents/ChaptersForm';
import * as Yup from 'yup';

const Creator = (props) => {
  const {
    userData,
    guides,
    getGuidesData,
    createGuide,
    updateGuideThemes,
    getGuideThemes,
    themesByGuide,
    updateGuideChapters,
    getGuideChapters,
    chaptersByGuide,
  } = props;

  const [targetGuide, setTargetGuide] = useState(null);
  const [isCreatingNewGuide, setIsCreatingNewGuide] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [initialChapters, setInitialChapters] = useState({ chapters: [] });

  useEffect(() => {
    getGuidesData(userData.id);
  }, [getGuidesData, userData.id]);

  useEffect(() => {
    if (targetGuide && chaptersByGuide[targetGuide.id]) {
      setInitialChapters({ chapters: chaptersByGuide[targetGuide.id] });
    }
  }, [targetGuide, chaptersByGuide]);

  const handleGuideSubmit = (values) => {
    createGuide(values, (newGuide) => {
      toast.success('Guide created successfully!');
      setTargetGuide(newGuide);
      setIsCreatingNewGuide(false);
      setIsEditingGuide(true);
    });
  };

  const handleThemesSubmit = async (values) => {
    try {
      await updateGuideThemes(targetGuide.id, { themes: values.themes });
      toast.success('Themes updated successfully!');
      handleSelectGuide(targetGuide);
    } catch (error) {
      toast.error('Failed to update themes.');
    }
  };

  const handleChaptersSubmit = async (values) => {
    console.log('Submit chapters values:', values);
    try {
      await updateGuideChapters(values);
      toast.success('Chapters updated successfully!');
      handleSelectGuide(targetGuide);
    } catch (error) {
      toast.error('Failed to update chapters.');
    }
  };

  const handleSelectGuide = async (guide) => {
    try {
      setTargetGuide(guide);
      setIsEditingGuide(false);
      await getGuideThemes(guide.id);
      await getGuideChapters(guide.id);
      setIsEditingGuide(true);
    } catch (error) {
      console.error('Ошибка при загрузке тем:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.guides_container}>
        <h2>Your Guides</h2>
        <div className={styles.underline} />

        {guides?.map((guide, index) => (
          <div key={index} className={styles.guide_plate} onClick={() => handleSelectGuide(guide)}>
            {guide.title}
          </div>
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            setTargetGuide(null);
            setIsCreatingNewGuide(true);
            setIsEditingGuide(false);
          }}
        >
          Create New Guide
        </button>
      </div>

      <div className={styles.creator}>
        {isCreatingNewGuide && !isEditingGuide && (
          <div className={styles.creator_container}>
            <CreateGuideForm
              initialValues={{ user_id: userData.id, title: '' }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Guide title is required'),
              })}
              onSubmit={handleGuideSubmit}
            />
          </div>
        )}

        {isEditingGuide && targetGuide && (
          <>
            <div className={styles.creator_container}>
              <EditThemesForm
                themes={themesByGuide[targetGuide.id] || []}
                guideTarget={targetGuide}
                validationSchema={Yup.object().shape({
                  themes: Yup.array().max(6, 'You can add up to 6 themes').of(Yup.string().required('Theme is required')),
                })}
                onSubmit={handleThemesSubmit}
              />
            </div>
            <div className={styles.creator_container}>
              <ChaptersForm
                initialValues={initialChapters}
                guideTarget={targetGuide}
                validationSchema={Yup.object().shape({
                  chapters: Yup.array().of(
                    Yup.object().shape({
                      chapterTitle: Yup.string().required('Chapter title is required'),
                      contents: Yup.array().of(
                        Yup.object().shape({
                          type: Yup.string().required(),
                          value: Yup.mixed().required('Content value is required'),
                        })
                      ),
                    })
                  ),
                })}
                onSubmit={handleChaptersSubmit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  getGuidesData,
  createGuide,
  updateGuideThemes,
  getGuideThemes,
  updateGuideChapters,
  getGuideChapters,
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  guides: state.creatorReducer?.guidesList || [],
  themesByGuide: state.creatorReducer?.themesByGuide || {},
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);

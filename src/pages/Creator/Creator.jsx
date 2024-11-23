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
  resetChapters,
} from '../../actions/creator';
import CreateGuideForm from '../../components/CreatorsComponents/CreateGuideFrom';
import EditThemesForm from '../../components/CreatorsComponents/EditThemesForm';
import ChaptersForm from '../../components/CreatorsComponents/ChaptersForm';
import * as Yup from 'yup';
import PreviewGuide from '../../components/CreatorsComponents/PreviewGuide';

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
    resetChapters,
  } = props;

  const [targetGuide, setTargetGuide] = useState(null);
  const [isCreatingNewGuide, setIsCreatingNewGuide] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [initialChapters, setInitialChapters] = useState({ chapters: [] });
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

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
      resetChapters();
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
        <h2 onClick={() => setTargetGuide(null)}>Your Guides</h2>
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
        {targetGuide === null && isCreatingNewGuide === false ? (
          <div className={styles.creator_intro}>
            <h2 className={styles.h2}>Welcome to ThemesCreator</h2>
            <p>
              ThemesCreator is your ultimate tool for crafting comprehensive guides on any topic. Whether you're sharing knowledge, teaching a skill,
              or providing instructions, ThemesCreator empowers you to create guides that truly stand out.
            </p>
            <p>With ThemesCreator, you can add a variety of content to your guides:</p>
            <ul>
              <li>Text blocks for clear and concise information</li>
              <li>Images to make your guides visually appealing</li>
              <li>Links to videos or external resources for more depth</li>
              <li>Custom themes to align your guide's style with its purpose</li>
            </ul>
            <p>Please select an existing guide to edit or click "Create New Guide" to start crafting your masterpiece!</p>
          </div>
        ) : (
          <>
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
                  <button onClick={togglePreview} className={styles.btn}>
                    {isPreview ? 'Edit' : 'Preview'}
                  </button>
                  {!isPreview ? (
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
                  ) : (
                    <PreviewGuide  initialValues={initialChapters} isPreview={isPreview} guideTarget={targetGuide} />
                  )}
                </div>
              </>
            )}
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
  resetChapters,
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  guides: state.creatorReducer?.guidesList || [],
  themesByGuide: state.creatorReducer?.themesByGuide || {},
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);

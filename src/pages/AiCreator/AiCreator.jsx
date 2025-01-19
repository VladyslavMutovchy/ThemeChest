import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './AiCreator.module.css';
import { connect } from 'react-redux';
import {
  createGuide,
  getPreviewGuide,
  getGuidesData,
  updateGuideThemes,
  getGuideThemes,
  updateGuideChapters,
  getGuideChapters,
  updatePreviewGuide,
  resetChapters,
} from '../../actions/creator';
import CreateGuideForm from '../../components/CreatorsComponents/CreateGuideFrom';
import EditThemesForm from '../../components/CreatorsComponents/EditThemesForm';
import ChaptersForm from '../../components/CreatorsComponents/ChaptersForm';
import * as Yup from 'yup';
import PreviewGuide from '../../components/CreatorsComponents/PreviewGuide';
import EditPreviewForm from '../../components/CreatorsComponents/EditPreviewForm';

const AiCreator = (props) => {
  const {
    userData,
    guides,
    getGuidesData,
    createGuide,
    updateGuideThemes,
    getGuideThemes,
    themesByGuide,
    updatePreviewGuide,
    updateGuideChapters,
    getGuideChapters,
    chaptersByGuide,
    getPreviewGuide,
    resetChapters,
    guidePreview,
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
  const handlePreviewGuideSubmit = async (formData) => {
    try {
      await updatePreviewGuide(targetGuide, formData);
      toast.success('Preview updated successfully!');
      handleSelectGuide(targetGuide);
    } catch (error) {
      toast.error('Failed to update preview.');
    }
  };

  const handleSelectGuide = async (guide) => {
    try {
      setTargetGuide(guide);
      setIsEditingGuide(false);
      resetChapters();
      await getPreviewGuide(guide.id);
      await getGuideThemes(guide.id);
      await getGuideChapters(guide.id);
      console.log('Guide preview loaded:', guidePreview);
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
            <h2 className={styles.h2}>Welcome to AI Guide Creator</h2>
            <p>
              AI Guide Creator is your ultimate assistant for building detailed and engaging guides on any topic. Whether you're sharing expertise,
              teaching a new skill, or creating step-by-step instructions, AI Guide Creator makes the process effortless and efficient.
            </p>
            <p>With AI Guide Creator, you can enhance your guides using advanced AI tools:</p>
            <ul>
              <li>Generate text content for clear and informative explanations</li>
              <li>Add relevant images to make your guides visually impactful</li>
              <li>Embed links to videos or external resources for additional insights</li>
              <li>Customize themes to match the style and purpose of your guide</li>
            </ul>
            <p>Choose an existing guide to edit or click "Create New Guide" to start designing your next masterpiece with AI assistance!</p>
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
                  <EditPreviewForm guidePreview={guidePreview} guideTarget={targetGuide} onSubmit={handlePreviewGuideSubmit} />
                </div>
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
                    <PreviewGuide initialValues={initialChapters} isPreview={isPreview} guideTarget={targetGuide} />
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
  updatePreviewGuide,
  updateGuideThemes,
  getGuideThemes,
  getPreviewGuide,
  updateGuideChapters,
  getGuideChapters,
  resetChapters,
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  guides: state.creatorReducer?.guidesList || [],
  themesByGuide: state.creatorReducer?.themesByGuide || {},
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
  guidePreview: state.creatorReducer?.guidePreview || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(AiCreator);

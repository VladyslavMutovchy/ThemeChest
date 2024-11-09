import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import styles from './Creator.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createGuide, getGuidesData, updateGuideThemes, getGuideThemes } from '../../actions/creator';
import { connect } from 'react-redux';
import Select from 'react-select';
import { KEYWORDS } from './keyWords';
import { customStyles } from './styles.Select';

const Creator = (props) => {
  const { userData, guides, getGuidesData, createGuide, updateGuideThemes, getGuideThemes } = props;
  const [targetGuide, setTargetGuide] = useState(null);
  const [isCreatingNewGuide, setIsCreatingNewGuide] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);

  useEffect(() => {
    getGuidesData(userData.id);
  }, [getGuidesData]);

  const initialGuideValues = {
    user_id: userData.id,
    title: '',
  };

  const guideValidationSchema = Yup.object().shape({
    title: Yup.string().required('Guide title is required'),
  });

  

  const themesValidationSchema = Yup.object().shape({
    themes: Yup.array().max(6, 'You can add up to 6 themes').of(Yup.string().required('Theme is required')), // массив тем для поиска
  });

  const initialChaptersValues = {
    chapters: [
      {
        chapterTitle: '',
        contents: [],
      },
    ],
  };

  const chaptersValidationSchema = Yup.object().shape({
    chapters: Yup.array().of(
      Yup.object().shape({
        chapterTitle: Yup.string().required('Chapter title is required'),
        contents: Yup.array().of(
          Yup.object().shape({
            type: Yup.string().required(), // тип контента: 'h2', 'paragraph', 'img', 'video'
            value: Yup.mixed().required('Content value is required'),
          })
        ),
      })
    ),
  });

  const handleGuideSubmit = (values) => {
    createGuide(values, (newGuide) => {
      console.log('Guide created:', newGuide);
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
      console.error('Ошибка при обновлении тем:', error);
      toast.error('Failed to update themes.');
    }
  };
  

  const handleChaptersSubmit = (values) => {
    console.log('Chapters submitted:', values);
    toast.success('Chapters updated successfully!');
  };

  const handleSelectGuide = async (guide) => {
    try {
      setTargetGuide(guide);
      setIsEditingGuide(false);

      await getGuideThemes(guide.id); // Загружаем темы, обновляется хранилище Redux
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

      <div className={styles.creator_container}>
        {isCreatingNewGuide && (
          <div>
            <h2>Create a Guide</h2>
            <Formik initialValues={initialGuideValues} validationSchema={guideValidationSchema} onSubmit={handleGuideSubmit}>
              {({ values }) => (
                <Form className={styles.formInline}>
                  <label className={styles.label}>
                    <Field placeholder="Guide Title" className={`${styles.input} ${styles.inputInline}`} type="text" name="title" />
                    <ErrorMessage className={styles.ErrorMessage} style={{ color: '#ff0000' }} name="title" component="div" />
                  </label>
                  <button type="submit" className={`${styles.btn} ${styles.btnInline}`}>
                    Create Guide
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {isEditingGuide && targetGuide && (
          <div>
            <h2>Edit Guide: {targetGuide.title}</h2>

            <Formik
              initialValues={{
                themes: props.themesByGuide[targetGuide.id] || [],
              }}
              enableReinitialize={true}
              validationSchema={themesValidationSchema}
              onSubmit={handleThemesSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className={styles.form}>
                  <h3>Edit Themes (up to 6)</h3>
                  <div className={styles.wrapper_themes}>
                    <div className={styles.container_themes}>
                      {values.themes.map((theme, index) => (
                        <div key={index} className={styles.themeItem}>
                          <span>{theme}</span>
                          <button
                            type="button"
                            className={styles.dell_btn}
                            onClick={() => {
                              const newThemes = values.themes.filter((_, i) => i !== index);
                              setFieldValue('themes', newThemes);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <Select
                      classNamePrefix="custom-select"
                      styles={customStyles}
                      options={KEYWORDS.filter((keyword) => !values.themes.includes(keyword)).map((keyword) => ({
                        value: keyword,
                        label: keyword,
                      }))}
                      onChange={(selectedOption) => {
                        if (selectedOption && values.themes.length < 6) {
                          setFieldValue('themes', [...values.themes, selectedOption.value]);
                        }
                        setFieldValue('selectedTheme', null);
                      }}
                      value={null}
                      placeholder="Search and select a theme"
                      isClearable
                    />

                    <div className={styles.selectedThemes}></div>
                  </div>
                  <button type="submit" className={styles.btn}>
                    Save Themes
                  </button>
                </Form>
              )}
            </Formik>

            <Formik initialValues={initialChaptersValues} validationSchema={chaptersValidationSchema} onSubmit={handleChaptersSubmit}>
              {({ values, setFieldValue }) => (
                <Form className={styles.form}>
                  <FieldArray name="chapters">
                    {({ push, remove }) => (
                      <div>
                        <h3>Chapters</h3>
                        {values.chapters.map((chapter, chapterIndex) => (
                          <div key={chapterIndex} className={styles.chapterItem}>
                            <label>
                              Chapter Title:
                              <Field className="input" name={`chapters.${chapterIndex}.chapterTitle`} />
                              <ErrorMessage name={`chapters.${chapterIndex}.chapterTitle`} component="div" className="error" />
                            </label>

                            <FieldArray name={`chapters.${chapterIndex}.contents`}>
                              {({ push, remove }) => (
                                <div>
                                  <h4>Contents</h4>
                                  {values.chapters[chapterIndex].contents.map((content, contentIndex) => (
                                    <div key={contentIndex} className={styles.contentItem}>
                                      <label>Content Type:</label>
                                      <Field as="select" name={`chapters.${chapterIndex}.contents.${contentIndex}.type`}>
                                        <option value="h2">Header (H2)</option>
                                        <option value="paragraph">Paragraph</option>
                                        <option value="img">Image</option>
                                        <option value="video">Video</option>
                                      </Field>

                                      {values.chapters[chapterIndex].contents[contentIndex].type === 'paragraph' && (
                                        <ReactQuill
                                          value={values.chapters[chapterIndex].contents[contentIndex].value || ''}
                                          onChange={(val) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, val)}
                                        />
                                      )}

                                      {values.chapters[chapterIndex].contents[contentIndex].type === 'img' && (
                                        <input type="file" accept=".jpg, .png" onChange={(e) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, e.target.files[0])} />
                                      )}

                                      <button type="button" className={styles.btn} onClick={() => remove(contentIndex)}>
                                        Remove Content
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" className={styles.btn} onClick={() => push({ type: 'paragraph', value: '' })}>
                                    Add Content
                                  </button>
                                </div>
                              )}
                            </FieldArray>

                            <button type="button" className={styles.btn} onClick={() => remove(chapterIndex)}>
                              Remove Chapter
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className={styles.btn}
                          onClick={() =>
                            push({
                              chapterTitle: '',
                              contents: [],
                            })
                          }
                        >
                          Add Chapter
                        </button>
                      </div>
                    )}
                  </FieldArray>

                  <button type="submit" className={styles.btn}>
                    Save Chapters
                  </button>
                </Form>
              )}
            </Formik>
          </div>
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
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  guides: state.creatorReducer?.guidesList || [],
  themesByGuide: state.creatorReducer?.themesByGuide || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);

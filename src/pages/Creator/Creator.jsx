import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import styles from './Creator.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createGuide, getGuidesData } from '../../actions/creator';
import { connect } from 'react-redux';

const Creator = (props) => {
  const { userData, guides, getGuidesData, createGuide } = props;
  const [targetGuide, setTargetGuide] = useState(null);
  const [isCreatingNewGuide, setIsCreatingNewGuide] = useState(false);
  const [isAddingChapters, setIsAddingChapters] = useState(false);

  useEffect(() => {
    getGuidesData(); // Получаем данные при загрузке компонента
  }, [getGuidesData]);

  const initialGuideValues = {
    user_id: userData.id,
    title: '',
  };

  const guideValidationSchema = Yup.object().shape({
    title: Yup.string().required('Guide title is required'),
  });

  const initialChaptersValues = {
    themes: [''],
    chapters: [
      {
        chapterTitle: '',
        contents: [],
      },
    ],
  };

  const chaptersValidationSchema = Yup.object().shape({
    themes: Yup.array().of(Yup.string().required('Theme is required')), // массив тем для поиска
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
      setIsAddingChapters(true);
    });
  };

  const handleChaptersSubmit = (values) => {
    console.log('Chapters submitted:', values);
    toast.success('Chapters updated successfully!');
    setIsAddingChapters(false);
  };

  const handleAddChapters = (guide) => {
    setTargetGuide(guide);
    setIsAddingChapters(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.guides_container}>
        <h2>Your Guides</h2>
        <div className={styles.underline} />
        <div className={styles.guide_plate} />

        {guides?.map((guide, index) => (
          <div key={index} className={styles.guide_plate} onClick={() => handleAddChapters(guide)}>
            {guide.title}
          </div>
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            setTargetGuide(null);
            setIsCreatingNewGuide(true);
            setIsAddingChapters(false);
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
                <Form className={styles.form}>
                  <label className={styles.label}>
                    Guide Title:
                    <Field className="input" type="text" name="title" />
                    <ErrorMessage name="title" component="div" className="error" />
                  </label>
                  <button type="submit" className={styles.btn}>
                    Create Guide
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {isAddingChapters && targetGuide && (
          <div>
            <h2>Add Chapters to: {targetGuide.title}</h2>
            <Formik
              initialValues={initialChaptersValues}
              validationSchema={chaptersValidationSchema}
              onSubmit={handleChaptersSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className={styles.form}>
                  <FieldArray name="themes">
                    {({ push, remove }) => (
                      <div>
                        <h3>Themes</h3>
                        {values.themes.map((_, index) => (
                          <div key={index} className={styles.themeItem}>
                            <Field className="input" name={`themes.${index}`} />
                            <button type="button" onClick={() => remove(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => push('')}>
                          Add Theme
                        </button>
                      </div>
                    )}
                  </FieldArray>

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
                                  {chapter.contents.map((content, contentIndex) => (
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

                                      <button type="button" onClick={() => remove(contentIndex)}>
                                        Remove Content
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={() => push({ type: 'paragraph', value: '' })}>
                                    Add Content
                                  </button>
                                </div>
                              )}
                            </FieldArray>

                            <button type="button" onClick={() => remove(chapterIndex)}>
                              Remove Chapter
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
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
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  guides: state.creator?.guidesList || [], 
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);

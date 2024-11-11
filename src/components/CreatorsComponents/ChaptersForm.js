import React from 'react';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../../pages/Creator/Creator.module.css';

const ChaptersForm = ({ initialValues, validationSchema, onSubmit }) => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
              <button type="button" className={styles.btn} onClick={() => push({ chapterTitle: '', contents: [] })}>
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
);

// Экспорт компонента
export default ChaptersForm;

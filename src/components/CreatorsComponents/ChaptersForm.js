import React from 'react';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../../pages/Creator/Creator.module.css';
import classNames from 'classnames';
import { base64ToFile } from '../../utils/functions';

const modules = {
  toolbar: [
    [{ header: [3, false] }], 
    [{ font: [] }], 
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'], 
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
};

const formats = ['header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'link'];

const ChaptersForm = ({ initialValues, guideTarget, validationSchema, onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      const formData = new FormData();

      formData.append('guide_id', guideTarget.id);
      values.chapters.forEach((chapter, chapterIndex) => {
        formData.append(`chapters[${chapterIndex}][chapterTitle]`, chapter.chapterTitle);

        chapter.contents.forEach((content, contentIndex) => {
          formData.append(`chapters[${chapterIndex}][contents][${contentIndex}][type]`, content.type);

          if (content.type === 'img') {
            if (content.value && content.value.base64) {
              const fileName = `image-${chapterIndex}-${contentIndex}.jpg`;
              const file = base64ToFile(content.value.base64, content.value.mimeType, fileName);
              formData.append(`chapters[${chapterIndex}][contents][${contentIndex}][file]`, file);
            } else if (content.value instanceof File) {
              formData.append(`chapters[${chapterIndex}][contents][${contentIndex}][file]`, content.value);
            } 
          } else {
            formData.append(`chapters[${chapterIndex}][contents][${contentIndex}][value]`, content.value);
          }
        });
      });

      onSubmit(formData);
      setSubmitting(false);
    }}
  >
    {({ values, setFieldValue }) => (
      <Form className={styles.form}>
        <FieldArray name="chapters">
          {({ push, remove }) => (
            <div className="width">
              <h3>Chapters</h3>
              {values.chapters?.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className={classNames('width', styles.chapter)}>
                  <label className={classNames('width', styles.chapterItem)}>
                    Chapter Title
                    <Field className="input" name={`chapters.${chapterIndex}.chapterTitle`} />
                    <ErrorMessage style={{ color: '#ff0000' }} name={`chapters.${chapterIndex}.chapterTitle`} component="div" className="error" />
                  </label>

                  <FieldArray name={`chapters.${chapterIndex}.contents`}>
                    {({ push, remove }) => (
                      <div className="width">
                        {values.chapters[chapterIndex].contents.map((content, contentIndex) => (
                          <div className="width" key={contentIndex}>
                            {content.type === 'paragraph' && (
                              <div className={classNames('width', styles.chapterItem)}>
                                <p>Paragraph</p>
                                <ReactQuill
                                  modules={modules}
                                  formats={formats}
                                  className={styles.react_quill}
                                  value={content.value || ''}
                                  onChange={(val) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, val)}
                                />
                                <button type="button" className={classNames(styles.btn, styles.red)} onClick={() => remove(contentIndex)}>
                                  Remove item
                                </button>
                              </div>
                            )}

                            {content.type === 'img' && (
                              <div className={classNames('width', styles.chapterItem)}>
                                <p>Image</p>
                                {content.value && (
                                  <img
                                    src={content.value.base64 ? `data:${content.value.mimeType};base64,${content.value.base64}` : content.previewUrl}
                                    alt="preview"
                                    className={styles.imagePreview}
                                  />
                                )}

                                <input
                                  type="file"
                                  accept=".jpg, .png, .jpeg"
                                  style={{ display: 'none' }}
                                  id={`fileInput-${chapterIndex}-${contentIndex}`}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, file);
                                      setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.isNew`, true);
                                      setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.previewUrl`, URL.createObjectURL(file));
                                    }
                                  }}
                                />

                                <button
                                  type="button"
                                  className={classNames(styles.btn)}
                                  onClick={() => document.getElementById(`fileInput-${chapterIndex}-${contentIndex}`).click()}
                                >
                                  Add Photo
                                </button>

                                <button type="button" className={classNames(styles.btn, styles.red)} onClick={() => remove(contentIndex)}>
                                  Remove item
                                </button>
                              </div>
                            )}

                            {content.type === 'video' && (
                              <div className={classNames('width', styles.chapterItem)}>
                                <p>Video link</p>
                                <input
                                  className="input"
                                  type="text"
                                  placeholder="Enter video URL"
                                  value={content.value || ''}
                                  onChange={(e) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, e.target.value)}
                                />
                                <button type="button" className={classNames(styles.btn, styles.red)} onClick={() => remove(contentIndex)}>
                                  Remove item
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className={styles.wrapper_btn}>
                          <button type="button" className={styles.btn} onClick={() => push({ type: 'paragraph', value: '' })}>
                            Add Paragraph
                          </button>
                          <button type="button" className={styles.btn} onClick={() => push({ type: 'img', value: '', previewUrl: '' })}>
                            Add Image
                          </button>
                          <button type="button" className={styles.btn} onClick={() => push({ type: 'video', value: '' })}>
                            Add Video
                          </button>
                        </div>
                      </div>
                    )}
                  </FieldArray>

                  <button type="button" className={classNames(styles.btn, styles.red)} onClick={() => remove(chapterIndex)}>
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
                Create Chapter
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

export default ChaptersForm;

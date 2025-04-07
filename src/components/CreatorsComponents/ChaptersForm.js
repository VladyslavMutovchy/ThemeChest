import React from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../../pages/Creator/Creator.module.css';
import { base64ToFile } from '../../utils/functions';
import { Button, Input } from '../../components/UI';
import { toRoman } from '../../utils/functions';

// Функция для преобразования URL YouTube в URL для встраивания
const getEmbedUrl = (url) => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

const modules = {
  toolbar: [
    [{ header: [3, 4, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'link', 'image', 'blockquote', 'code-block',
];

const ChaptersForm = ({ initialValues, guideTarget, validationSchema, onSubmit }) => {
  return (
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
              <div className={styles.chaptersContainer}>
                {values.chapters?.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>No chapters have been added to this guide yet.</p>
                    <p>Click the "Create Chapter" button below to start building your guide.</p>
                  </div>
                )}

                {values.chapters?.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className={styles.chapter}>
                    <div className={styles.chapterHeader}>
                      <h2 className={styles.chapterTitle}>
                        Chapter {toRoman(chapterIndex + 1)}
                      </h2>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => remove(chapterIndex)}
                      >
                        Remove Chapter
                      </Button>
                    </div>

                    <div className={styles.chapterContent}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Chapter Title</label>
                        <Input
                          name={`chapters.${chapterIndex}.chapterTitle`}
                          value={chapter.chapterTitle}
                          onChange={(e) => setFieldValue(`chapters.${chapterIndex}.chapterTitle`, e.target.value)}
                          placeholder="Enter a descriptive title for this chapter"
                          fullWidth
                        />
                        <ErrorMessage name={`chapters.${chapterIndex}.chapterTitle`} component="div" className={styles.ErrorMessage} />
                      </div>

                      <FieldArray name={`chapters.${chapterIndex}.contents`}>
                        {({ push, remove }) => (
                          <div className={styles.contentsContainer}>
                            <h3 className={styles.contentsTitle}>Chapter Content</h3>

                            {values.chapters[chapterIndex].contents.length === 0 && (
                              <div className={styles.emptyState} style={{ padding: '20px' }}>
                                <p>No content has been added to this chapter yet.</p>
                                <p>Use the buttons below to add paragraphs, images, or videos.</p>
                              </div>
                            )}

                            {values.chapters[chapterIndex].contents.map((content, contentIndex) => (
                              <div className={styles.contentItem} key={contentIndex}>
                                {content.type === 'paragraph' && (
                                  <div className={styles.chapterItem}>
                                    <div className={styles.contentHeader}>
                                      <h4 className={styles.contentTypeLabel}>Text Content</h4>
                                      <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => remove(contentIndex)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <ReactQuill
                                      modules={modules}
                                      formats={formats}
                                      className={styles.react_quill}
                                      value={content.value || ''}
                                      onChange={(val) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, val)}
                                      placeholder="Enter your content here..."
                                    />
                                  </div>
                                )}

                                {content.type === 'img' && (
                                  <div className={styles.chapterItem}>
                                    <div className={styles.contentHeader}>
                                      <h4 className={styles.contentTypeLabel}>Image Content</h4>
                                      <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => remove(contentIndex)}
                                      >
                                        Remove
                                      </Button>
                                    </div>

                                    <div className={styles.imageContainer}>
                                      {content.value && (
                                        <div className={styles.imageWrapper}>
                                          <img
                                            src={content.value.base64 ? `data:${content.value.mimeType};base64,${content.value.base64}` : content.previewUrl}
                                            alt="Content preview"
                                            className={styles.imagePreview}
                                          />
                                        </div>
                                      )}

                                      {!content.value && (
                                        <div className={styles.imageUploadPlaceholder}>
                                          <div className={styles.imageUploadIcon}>📷</div>
                                          <p>No image selected</p>
                                        </div>
                                      )}
                                    </div>

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

                                    <div className={styles.contentActions}>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById(`fileInput-${chapterIndex}-${contentIndex}`).click()}
                                      >
                                        {content.value ? 'Change Image' : 'Upload Image'}
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {content.type === 'video' && (
                                  <div className={styles.chapterItem}>
                                    <div className={styles.contentHeader}>
                                      <h4 className={styles.contentTypeLabel}>Video Content</h4>
                                      <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => remove(contentIndex)}
                                      >
                                        Remove
                                      </Button>
                                    </div>

                                    <div className={styles.formGroup}>
                                      <label className={styles.formLabel}>YouTube Video URL</label>
                                      <Input
                                        type="text"
                                        placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                                        value={content.value || ''}
                                        onChange={(e) => setFieldValue(`chapters.${chapterIndex}.contents.${contentIndex}.value`, e.target.value)}
                                        fullWidth
                                      />
                                    </div>

                                    {content.value && (
                                      <div className={styles.videoPreviewContainer}>
                                        <label className={styles.formLabel}>Video Preview</label>
                                        <div className={styles.videoWrapper}>
                                          <iframe
                                            width="560"
                                            height="315"
                                            src={getEmbedUrl(content.value)}
                                            title="Video preview"
                                            style={{ border: 'none' }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          ></iframe>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}

                            <div className={styles.contentActions}>
                              <h4 className={styles.addContentTitle}>Add Content</h4>
                              <div className={styles.addContentButtons}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => push({ type: 'paragraph', value: '' })}
                                >
                                  <span className={styles.contentButtonIcon}>📝</span> Add Text
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => push({ type: 'img', value: '', previewUrl: '' })}
                                >
                                  <span className={styles.contentButtonIcon}>🖼️</span> Add Image
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => push({ type: 'video', value: '' })}
                                >
                                  <span className={styles.contentButtonIcon}>🎬</span> Add Video
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                ))}

                <div className={styles.formActions}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                      push({
                        chapterTitle: '',
                        contents: [],
                      })
                    }
                  >
                    Create New Chapter
                  </Button>
                </div>
              </div>
            )}
          </FieldArray>

          <div className={styles.formActions} style={{ marginTop: '30px' }}>
            <Button type="submit" variant="primary">
              Save All Chapters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChaptersForm;

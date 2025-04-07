import React from 'react';
import styles from '../../pages/Creator/Creator.module.css';
import classNames from 'classnames';
import { toRoman } from '../../utils/functions';

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

const PreviewGuide = ({ initialValues, guideTarget }) => {
  return (
    <div className={styles.previewWrapper}>
      <div className={styles.previewHeader}>
        <h1 className={styles.previewTitle}>{guideTarget?.title || 'Guide Preview'}</h1>
      </div>

      {initialValues?.chapters?.length > 0 ? (
        initialValues.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className={styles.chapter}>
            <div className={styles.chapterHeader}>
              <h2 className={styles.chapterTitle}>
                Chapter {toRoman(chapterIndex + 1)}: {chapter.chapterTitle}
              </h2>
            </div>

            <div className={styles.chapterContent}>
              {chapter.contents.map((content, contentIndex) => (
                <div key={contentIndex} className={styles.contentItem}>
                  {content.type === 'paragraph' && (
                    <div className={styles.paragraph}>
                      <div dangerouslySetInnerHTML={{ __html: content.value }} />
                    </div>
                  )}

                  {content.type === 'img' && content.value && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={content.value.base64 ? `data:${content.value.mimeType};base64,${content.value.base64}` : content.previewUrl}
                        alt={`Image for ${chapter.chapterTitle}`}
                        className={styles.imagePreview}
                      />
                    </div>
                  )}

                  {content.type === 'video' && content.value && (
                    <div className={styles.videoWrapper}>
                      <iframe
                        width="560"
                        height="315"
                        src={getEmbedUrl(content.value)}
                        title={`Video for ${chapter.chapterTitle}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>No content has been added to this guide yet.</p>
          <p>Click the "Edit Content" button to start adding chapters and content.</p>
        </div>
      )}
    </div>
  );
};

export default PreviewGuide;

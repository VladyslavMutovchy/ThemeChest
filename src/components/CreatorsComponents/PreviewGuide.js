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


const PreviewGuide = ({ initialValues }) => {
  return (
    <div>
      <div className={styles.previewWrapper}>
        {initialValues?.chapters?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className={classNames('width', styles.chapter)}>
            <div>
              Chapter {toRoman(chapterIndex)}: <h3 className={styles.h3}>{chapter.chapterTitle}</h3>
            </div>
            {chapter.contents.map((content, contentIndex) => (
              <div key={contentIndex} className={styles.contentItem}>
                {content.type === 'paragraph' && (
                  <div className={styles.paragraph}>
                    <p dangerouslySetInnerHTML={{ __html: content.value }} />
                  </div>
                )}
                {content.type === 'img' && content.value && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={content.value.base64 ? `data:${content.value.mimeType};base64,${content.value.base64}` : content.previewUrl}
                      alt="preview"
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
                      title="Video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewGuide;

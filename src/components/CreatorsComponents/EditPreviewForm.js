import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import * as Yup from 'yup';
import styles from '../../pages/Creator/Creator.module.css';
import { Button, Input } from '../../components/UI';

// Функция для конвертации base64 в File
const base64ToFile = (base64, mimeType, fileName) => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], fileName, { type: mimeType });
};

const validationSchema = Yup.object().shape({
  description: Yup.string().max(400, 'Description must be 400 characters or less').required('Description is required'),
  prev_img: Yup.mixed().required('Image is required'),
});

const EditPreviewForm = ({ guidePreview, guideTarget, onSubmit }) => {
  const [croppingImage, setCroppingImage] = useState(null);
  const cropperRef = useRef(null);

  return (
    <Formik
      initialValues={{
        description: guidePreview.description || '',
        prev_img: guidePreview.prev_img ? { base64: guidePreview.prev_img, isNew: false } : null,
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formData = new FormData();
        formData.append('title', guideTarget.title);
        formData.append('user_id', guideTarget.user_id);
        formData.append('description', values.description);

        if (values.prev_img?.isNew) {
          formData.append('prev_img', values.prev_img.file);
        } else if (values.prev_img && values.prev_img.base64) {
          const mimeType = values.prev_img.base64.split(',')[0].match(/:(.*?);/)[1];
          const file = base64ToFile(values.prev_img.base64, mimeType, 'preview-image.jpg');
          formData.append('prev_img', file);
        }

        onSubmit(formData);
      }}
    >
      {({ setFieldValue, values, setFieldError }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.guidePrevCard}>
              <div
                className={styles.guidePrevImg}
                style={{
                  backgroundImage: values.prev_img
                    ? values.prev_img.isNew
                      ? `url(${URL.createObjectURL(values.prev_img.file)})`
                      : `url(${values.prev_img.base64})`
                    : 'none',
                  backgroundColor: !values.prev_img ? 'var(--bg-light)' : 'transparent'
                }}
              ></div>
              <div className={styles.guidePrevContent}>
                <h3 className={styles.guidePrevTitle}>{guideTarget.title}</h3>
                <p className={styles.guidePrevDesc}>{values.description || 'Guide description will appear here'}</p>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Guide Description</label>
            <Field
              as="textarea"
              name="description"
              id="description"
              className={styles.textarea}
              placeholder="Enter a brief description of your guide (up to 400 characters)"
              rows={4}
            />
            <ErrorMessage name="description" component="div" className={styles.ErrorMessage} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Guide Preview Image</label>
            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              style={{ display: 'none' }}
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                    setFieldError('prev_img', 'Only JPEG, PNG, and JPG files are allowed');
                  } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setCroppingImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            />

            <div className={styles.formActions} style={{ justifyContent: 'flex-start' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('fileInput').click()}
              >
                {values.prev_img ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
            <ErrorMessage name="prev_img" component="div" className={styles.ErrorMessage} />
          </div>

          {croppingImage && (
            <div className={styles.cropperContainer}>
              <div className={styles.cropperHeader}>
                <h3 className={styles.cropperTitle}>Crop Image</h3>
                <button
                  type="button"
                  className={styles.cropperCloseBtn}
                  onClick={() => setCroppingImage(null)}
                  aria-label="Close cropper"
                >
                  ×
                </button>
              </div>

              <Cropper
                className={styles.cropper}
                src={croppingImage}
                style={{ height: 400, width: '100%', maxWidth: 600 }}
                initialAspectRatio={16 / 9}
                aspectRatio={16 / 9}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                responsive={true}
                restore={false}
              />

              <div className={styles.cropperActions}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCroppingImage(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    const cropper = cropperRef.current?.cropper;
                    if (cropper) {
                      const croppedCanvas = cropper.getCroppedCanvas({
                        width: 800,
                        height: 450,
                        fillColor: '#fff',
                      });
                      croppedCanvas.toBlob((blob) => {
                        const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
                        const newFileName = `prev_img-${Date.now()}.jpg`;
                        const file = new File([jpgBlob], newFileName, { type: 'image/jpeg' });

                        setFieldValue('prev_img', { file: file, isNew: true });
                        setCroppingImage(null);
                      }, 'image/jpeg', 0.9);
                    }
                  }}
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              Save Preview
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditPreviewForm;

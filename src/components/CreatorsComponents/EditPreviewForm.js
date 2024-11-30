import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import * as Yup from 'yup';
import styles from '../../pages/Creator/Creator.module.css';

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

        if (values.prev_img.isNew) {
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
          <div className={styles.wrapper_flex}>
            <div
              className={styles.guide_plate_img}
              style={{
                backgroundImage: values.prev_img
                  ? values.prev_img.isNew
                    ? `url(${URL.createObjectURL(values.prev_img.file)})`
                    : `url(${values.prev_img.base64})`
                  : 'none',
              }}
            >
              <div key={guideTarget.id} className={styles.guide_plate_prev}>
                <h3 className={styles.guide_plate_title}>{guideTarget.title}</h3>
                <p className={styles.guide_plate_p}>{values.description}</p>
              </div>
            </div>
            <div className={styles.form_title}>
              <h3 className={styles.form_title}>Edit Preview Plate: {guideTarget.title}</h3>
              <div className={styles.field_container}>
                <Field as="textarea" name="description" id="description" className={styles.field} placeholder="Description (up to 400 characters)" />
                <ErrorMessage name="description" color="#f00" component="div" className={styles.error} />
              </div>
              <div className={styles.field_container}>
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

                <button type="button" className={styles.btn} onClick={() => document.getElementById('fileInput').click()}>
                  Add Photo
                </button>
                <ErrorMessage name="prev_img" color="#f00" component="div" className={styles.error} />
              </div>
              <button type="submit" className={styles.btn}>
                Save Preview
              </button>
            </div>
          </div>

          {croppingImage && (
            <div className={styles.cropper_container}>
              <Cropper
                className={styles.cropper}
                src={croppingImage}
                style={{ height: 400, maxWidth: 600 }}
                initialAspectRatio={300 / 380}
                aspectRatio={300 / 380}
                guides={false}
                ref={cropperRef}
              />
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  const cropper = cropperRef.current?.cropper;
                  if (cropper) {
                    const croppedCanvas = cropper.getCroppedCanvas({
                      width: 300,
                      height: 380,
                    });
                    croppedCanvas.toBlob((blob) => {
                      const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
                      const newFileName = `prev_img-${Date.now()}.jpg`;
                      const file = new File([jpgBlob], newFileName, { type: 'image/jpeg' });

                      setFieldValue('prev_img', { file: file, isNew: true });
                      setCroppingImage(null);
                    }, 'image/jpeg');
                  }
                }}
              >
                Crop and Save Image
              </button>
              <button type="button" className={styles.dell_btn} onClick={() => setCroppingImage(null)}>
                ✕
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default EditPreviewForm;

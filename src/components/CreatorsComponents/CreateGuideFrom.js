import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from '../../pages/Creator/Creator.module.css';
import { Input, Button } from '../../components/UI';

const CreateGuideForm = ({ initialValues, validationSchema, onSubmit }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values, handleChange, handleBlur }) => (
        <Form className={styles.formInline}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Guide Title</label>
            <Input
              placeholder="Enter a descriptive title for your guide"
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
            />
            <ErrorMessage name="title" component="div" className={styles.ErrorMessage} />
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              Create Guide
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateGuideForm;

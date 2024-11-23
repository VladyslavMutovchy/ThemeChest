import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from '../../pages/Creator/Creator.module.css';

const CreateGuideForm = ({ initialValues, validationSchema, onSubmit }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values }) => (
        <Form className={styles.formInline}><h2>Create Guide</h2>
          <label className={styles.label}>
            
            <Field placeholder="Guide Title" className={`${styles.input} ${styles.inputInline}`} type="text" name="title" />
            <ErrorMessage style={{ color: '#ff0000' }} className={styles.ErrorMessage} style={{ color: '#ff0000' }} name="title" component="div" />
          </label>
          <button type="submit" className={`${styles.btn} ${styles.btnInline}`}>
            Create Guide
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateGuideForm;

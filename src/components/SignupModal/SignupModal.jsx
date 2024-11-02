import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './SignupModal.module.css';
import { connect } from 'react-redux';
import { registration } from '../../actions/auth';
import { toast } from 'react-toastify';

const SignupModal = ({ registration, onClose }) => {

  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Incorrect email')
        .required('Area cannot be empty'),
      password: Yup.string()
        .min(6, 'Area cannot be lesser than 6')
        .required('Area cannot be empty'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords mismatch')
        .required('Area cannot be empty'),
    }),
    onSubmit: async (values) => {
      const formData = { email: values.email, password: values.password };
      await registration(formData, () => {
        onClose();
      });
    },
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>Signup</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <label>
            <div className={styles.title}>Email</div>
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: '#ff0000' }}>{formik.errors.email}</div>
            )}
            <input
              className="input"
              type="email"
              {...formik.getFieldProps('email')}
            />
          </label>
          <label>
            <div className={styles.title}>Password</div>
            {formik.touched.password && formik.errors.password && (
              <div style={{ color: '#ff0000' }}>{formik.errors.password}</div>
            )}
            <input
              className="input"
              type="password"
              {...formik.getFieldProps('password')}
            />
          </label>
          <label>
            <div className={styles.title}>Repeat Password</div>
            {formik.touched.repeatPassword && formik.errors.repeatPassword && (
              <div style={{ color: '#ff0000' }}>{formik.errors.repeatPassword}</div>
            )}
            <input
              className="input"
              type="password"
              {...formik.getFieldProps('repeatPassword')}
            />
          </label>
          <button className={styles.btn} type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = { registration };

export default connect(null, mapDispatchToProps)(SignupModal);

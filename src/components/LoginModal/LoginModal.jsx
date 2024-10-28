import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../actions/auth';
import styles from './LoginModal.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginModal = ({ login, onClose }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Incorrect email')
        .required('Area cannot be empty'),
      password: Yup.string()
        .min(6, 'Area cannot be lesser than 6')
        .required('Area cannot be empty'),
    }),
    onSubmit: async (values) => {
      await login(values, () => {
        navigate('/');
        onClose();
      }, (error) => {
        toast.error(error || 'Error');
      });
    },
    
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>Login</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <label>
            <div className={styles.title}>Email</div>
            {formik.touched.email && formik.errors.email && (
              <div className={styles.error}>{formik.errors.email}</div>
            )}
            <input
              className={styles.input}
              type="email"
              {...formik.getFieldProps('email')}
            />
          </label>
          <label>
            <div className={styles.title}>Password</div>
            {formik.touched.password && formik.errors.password && (
              <div className={styles.error}>{formik.errors.password}</div>
            )}
            <input
              className={styles.input}
              type="password"
              {...formik.getFieldProps('password')}
            />
          </label>
          <button className={styles.btn} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = { login };

export default connect(null, mapDispatchToProps)(LoginModal);

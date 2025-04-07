import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../actions/auth';
import styles from './LoginModal.module.css';
import { Modal, Input, Button } from '../UI';
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
        .email('Invalid email')
        .required('Field cannot be empty'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Field cannot be empty'),
    }),
    onSubmit: async (values) => {
      await login(values, () => {
        navigate('/');
        onClose();
      });
    },
  });

  return (
    <Modal isOpen={true} onClose={onClose} title="Login" size="small">
      <div className={styles.loginForm}>
        <form onSubmit={formik.handleSubmit}>
          <Input
            type="email"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
            placeholder="Enter your email"
            fullWidth
          />

          <Input
            type="password"
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            placeholder="Enter your password"
            fullWidth
          />

          <div className={styles.forgotPassword}>
            <a href="#" className={styles.forgotLink}>Forgot password?</a>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={formik.isSubmitting}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const mapDispatchToProps = { login };

export default connect(null, mapDispatchToProps)(LoginModal);

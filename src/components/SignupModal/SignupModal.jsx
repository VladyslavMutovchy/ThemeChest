import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './SignupModal.module.css';
import { connect } from 'react-redux';
import { registration } from '../../actions/auth';
import { Modal, Input, Button } from '../UI';

const SignupModal = ({ registration, onClose }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Field cannot be empty'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Field cannot be empty'),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required('Field cannot be empty'),
    }),
    onSubmit: async (values) => {
      const formData = { email: values.email, password: values.password };
      await registration(formData, () => {
        onClose();
      });
    },
  });

  return (
    <Modal isOpen={true} onClose={onClose} title="Sign Up" size="small">
      <div className={styles.signupForm}>
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
            placeholder="Enter password"
            fullWidth
          />

          <Input
            type="password"
            label="Confirm Password"
            name="repeatPassword"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.repeatPassword && formik.errors.repeatPassword}
            placeholder="Confirm password"
            fullWidth
          />

          <div className={styles.termsAgreement}>
            <p className={styles.termsText}>
              By signing up, you agree to our <a href="#" className={styles.termsLink}>Terms of Service</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>
            </p>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={formik.isSubmitting}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const mapDispatchToProps = { registration };

export default connect(null, mapDispatchToProps)(SignupModal);

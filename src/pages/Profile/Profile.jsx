import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Profile.module.css';
import { registration } from '../../actions/auth';
import standardImg from '../../assets/images/logo.png';

const Profile = () => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const profileSchema = Yup.object().shape({
    name: Yup.string(),
    phone: Yup.string().matches(/^\+?\d+$/, 'Phone number is not valid'),
    language: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    photo: Yup.mixed()
      .nullable()
      .test(
        'fileSize',
        'File size should be under 5 MB',
        (value) => !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test(
        'fileType',
        'Only JPG and PNG files are allowed',
        (value) =>
          !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
      ),
  });

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm your new password'),
  });

  const handleProfileSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    await dispatch(registration(formData));
    setEditProfile(false);
    console.log('Profile Data Submitted:', formData);
  };

  const handlePasswordSubmit = async (values) => {
    if (values.newPassword === values.confirmNewPassword) {
      await dispatch(changePassword(values));
      console.log('Password Data Submitted:', values);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.profileInfo}>
        <div className={styles.profileDetails}>
          <p className={styles.p}></p>
          <strong>Email:</strong> {userData.email}
          <p className={styles.p}></p>
          <strong>Name:</strong> {userData.name || 'Not specified'}
          <p className={styles.p}></p>
          <strong>Phone:</strong> {userData.phone || 'Not specified'}
          <p className={styles.p}></p>
          <strong>Language:</strong> {userData.language || 'Not specified'}
          <p className={styles.p}></p>
          <strong>Country:</strong> {userData.country || 'Not specified'}
          <p className={styles.p}></p>
          <strong>City:</strong> {userData.city || 'Not specified'}
        </div>
        <div className={styles.profilePhoto}>
          <img src={userData.photoUrl || standardImg} alt="Profile" />
        </div>
      </div>
      {editProfile && (
        <Formik
          initialValues={{
            name: userData.name || '',
            phone: userData.phone || '',
            language: userData.language || '',
            country: userData.country || '',
            city: userData.city || '',
            photo: null,
          }}
          validationSchema={profileSchema}
          onSubmit={handleProfileSubmit}
        >
          {({ setFieldValue }) => (
            <Form className={styles.form}>
              <label className={styles.label}>
                <p className={styles.p}>Name:</p>
                <Field className="input" type="text" name="name" />
                <ErrorMessage name="name" component="div" className="error" />
              </label>

              <label className={styles.label}>
                <p className={styles.p}>Phone:</p>
                <Field className="input" type="text" name="phone" />
                <ErrorMessage name="phone" component="div" className="error" />
              </label>

              <label className={styles.label}>
                <p className={styles.p}>Language:</p>
                <Field className="input" type="text" name="language" />
                <ErrorMessage
                  name="language"
                  component="div"
                  className="error"
                />
              </label>

              <label className={styles.label}>
                <p className={styles.p}>Country:</p>
                <Field className="input" type="text" name="country" />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="error"
                />
              </label>

              <label className={styles.label}>
                <p className={styles.p}>City:</p>
                <Field className="input" type="text" name="city" />
                <ErrorMessage name="city" component="div" className="error" />
              </label>

              <label className={styles.label}>
                <p className={styles.p}>Profile Photo:</p>
                <input
                  type="file"
                  className="input"
                  accept=".jpg, .png"
                  onChange={(e) => setFieldValue('photo', e.target.files[0])}
                />
                <ErrorMessage name="photo" component="div" className="error" />
              </label>

              <button className={styles.btn} type="submit">
                Save Changes
              </button>
            </Form>
          )}
        </Formik>
      )}
      {changePassword && (
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordSubmit}
        >
          <Form className={styles.form}>
            <label className={styles.label}>
              <p>Current Password:</p>
              <Field className="input" type="password" name="currentPassword" />
              <ErrorMessage
                style={{ color: '#ff0000' }}
                name="currentPassword"
                component="div"
                className="error"
              />
            </label>

            <label className={styles.label}>
              <p>New Password:</p>
              <Field className="input" type="password" name="newPassword" />
              <ErrorMessage
                style={{ color: '#ff0000' }}
                name="newPassword"
                component="div"
                className="error"
              />
            </label>

            <label className={styles.label}>
              <p>Confirm New Password:</p>
              <Field
                className="input"
                type="password"
                name="confirmNewPassword"
              />
              <ErrorMessage
                style={{ color: '#ff0000' }}
                name="confirmNewPassword"
                component="div"
                className="error"
              />
            </label>

            <button className={styles.btn} type="submit">
              Update Password
            </button>
          </Form>
        </Formik>
      )}
      <div className={styles.buttonGroup}>
        <button
          className={styles.btn}
          onClick={() => setEditProfile((prev) => !prev)}
        >
          {editProfile ? 'Close Edit Profile' : 'Edit Profile'}
        </button>
        <button
          className={styles.btn}
          onClick={() => setChangePassword((prev) => !prev)}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Profile.module.css';
import { toast } from 'react-toastify';
import standardImg from '../../assets/images/logo.png';
import { changePasswordAction, updateUserProfile, getUserData } from '../../actions/profile';
import { logout } from '../../actions/auth';

const Profile = (props) => {
  const { userData, updateUserProfile, changePasswordAction, getUserData } = props;

  const [changePassword, setChangePassword] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Mandarin Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Turkish',
    'Vietnamese',
    'Indonesian',
    'Thai',
    'Dutch',
    'Swedish',
    'Danish',
    'Finnish',
  ];

  useEffect(() => {
    getUserData(userData.id);
  }, []);

  const profileSchema = Yup.object().shape({
    name: Yup.string()
      .max(20, 'Name must be at most 20 characters long')
      .matches(/^[A-Za-zА-Яа-яЁё]+$/, 'Name must contain only letters'),
    phone: Yup.string().matches(/^\+?\d+$/, 'Phone number is not valid'),
    language: Yup.string(),
    country: Yup.string(),
    city: Yup.string(),
    photo: Yup.mixed()
      .nullable()
      .test('fileSize', 'File size should be under 5 MB', (value) => !value || (value && value.size <= 5 * 1024 * 1024))
      .test('fileType', 'Only JPG and PNG files are allowed', (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
  });

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm your new password'),
  });

  const handleProfileSubmit = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key !== 'photo') {
        formData.append(key, values[key]);
      }
    });

    if (values.photo) {
      formData.append('file', values.photo);
    }

    await updateUserProfile(
      formData,
      () => {
        toast.success('Profile updated successfully!');
        if (userData && userData.id) {
          getUserData(userData.id);
        }
      },
      (error) => toast.error('Failed to update profile:', error)
    );

    setEditProfile(false);
  };

  const handlePasswordSubmit = async ( values, { resetForm }) => {
    await changePasswordAction(
      userData.id,
      values,
      () => {
        toast.success('Password updated successfully!');
        resetForm(); // Сброс формы после успешного обновления
        setChangePassword(false);
        setTimeout(() => {
          logout();
          toast.success('Try a new password to log in!');
        }, 3000); // Закрытие формы изменения пароля
      },
      (error) => toast.error('Failed to update password:', error)
    );
  };

  // Основная логика рендеринга
  let content;

  if (editProfile) {
    content = (
      <Formik
        initialValues={{
          id: userData.id,
          name: userData.name || '',
          phone: userData.phone || '',
          language: userData.language || '',
          country: userData.country || '',
          city: userData.city || '',
          photo: userData.photo instanceof File ? userData.photo : null,
        }}
        validationSchema={profileSchema}
        onSubmit={handleProfileSubmit}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form}>
            <label className={styles.label}>
              <p className={styles.title}>Name:</p>
              <Field className="input" type="text" name="name" />
              <ErrorMessage style={{ color: '#ff0000' }} name="name" component="div" className="error" />
            </label>

            <label className={styles.label}>
              <p className={styles.title}>Phone:</p>
              <Field className="input" type="text" name="phone" />
              <ErrorMessage style={{ color: '#ff0000' }} name="phone" component="div" className="error" />
            </label>

            <label className={styles.title}>
              <p className={styles.p}>Language:</p>
              <Field as="select" className={styles.input} name="language">
                <option className="input" value="0">
                  Select a language
                </option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Field>
              <ErrorMessage style={{ color: '#ff0000' }} name="language" component="div" className="error" />
            </label>

            <label className={styles.title}>
              <p className={styles.p}>Country:</p>
              <Field className="input" type="text" name="country" />
              <ErrorMessage style={{ color: '#ff0000' }} name="country" component="div" className="error" />
            </label>

            <label className={styles.title}>
              <p className={styles.p}>City:</p>
              <Field className="input" type="text" name="city" />
              <ErrorMessage style={{ color: '#ff0000' }} name="city" component="div" className="error" />
            </label>

            <label className={styles.title}>
              <p className={styles.p}>Profile Photo:</p>
              <input type="file" className="input" accept=".jpg, .png" onChange={(e) => setFieldValue('photo', e.target.files[0])} />
              <ErrorMessage style={{ color: '#ff0000' }} name="photo" component="div" className="error" />
            </label>

            <button style={{ backgroundColor: '#669900' }} className={styles.btn} type="submit">
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
    );
  } else if (changePassword) {
    content = (
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
            <ErrorMessage style={{ color: '#ff0000' }} name="currentPassword" component="div" className="error" />
          </label>

          <label className={styles.label}>
            <p>New Password:</p>
            <Field className="input" type="password" name="newPassword" />
            <ErrorMessage style={{ color: '#ff0000' }} name="newPassword" component="div" className="error" />
          </label>

          <label className={styles.label}>
            <p>Confirm New Password:</p>
            <Field className="input" type="password" name="confirmNewPassword" />
            <ErrorMessage style={{ color: '#ff0000' }} name="confirmNewPassword" component="div" className="error" />
          </label>

          <button style={{ backgroundColor: '#669900' }} className={styles.btn} type="submit">
            Update Password
          </button>
        </Form>
      </Formik>
    );
  } else {
    content = (
      <div className={styles.profileInfo}>
        <div className={styles.profileDetails}>
          <p className={styles.p}>
            Email: <strong>{userData.email}</strong>
          </p>
          <p className={styles.p}>
            Name: <strong>{userData.name || 'Not specified'}</strong>
          </p>
          <p className={styles.p}>
            Phone: <strong>{userData.phone || 'Not specified'}</strong>
          </p>
          <p className={styles.p}>
            Language: <strong>{userData.language || 'Not specified'}</strong>
          </p>
          <p className={styles.p}>
            Country: <strong>{userData.country || 'Not specified'}</strong>
          </p>
          <p className={styles.p}>
            City: <strong>{userData.city || 'Not specified'}</strong>
          </p>
        </div>
        <div className={styles.profilePhoto}>
          <img src={userData.photoUrl || standardImg} alt="Profile" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2>Profile</h2>
      {content}
      <div className={styles.buttonGroup}>
        <button
          className={styles.btn}
          onClick={() => {
            setEditProfile(!editProfile);
            setChangePassword(false);
          }}
        >
          {editProfile ? 'Close Edit Profile' : 'Edit Profile'}
        </button>
        <button
          className={styles.btn}
          onClick={() => {
            setChangePassword(!changePassword);
            setEditProfile(false);
          }}
        >
          {changePassword ? 'Close Change Password' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateUserProfile,
  changePasswordAction,
  getUserData,
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

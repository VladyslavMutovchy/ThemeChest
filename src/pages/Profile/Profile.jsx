import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Profile.module.css';
import { toast } from 'react-toastify';
import standardImg from '../../assets/images/logo.png';
import { changePasswordAction, updateUserProfile, getUserData } from '../../actions/profile';
import { logout } from '../../actions/auth';
import classNames from 'classnames';
import { Button, Card, Input } from '../../components/UI';

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
        resetForm();
        setChangePassword(false);
        setTimeout(() => {
          logout();
          toast.success('Try a new password to log in!');
        }, 3000);
      },
      (error) => toast.error('Failed to update password:', error)
    );
  };

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
        {({ setFieldValue, values, errors, touched }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <Input
                label="Name"
                type="text"
                name="name"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={touched.name && errors.name}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="Phone"
                type="text"
                name="phone"
                value={values.phone}
                onChange={(e) => setFieldValue('phone', e.target.value)}
                error={touched.phone && errors.phone}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.selectLabel}>Language</label>
              <Field as="select" className={styles.select} name="language">
                <option value="">Select a language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Field>
              {touched.language && errors.language && (
                <div className={styles.errorMessage}>{errors.language}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <Input
                label="Country"
                type="text"
                name="country"
                value={values.country}
                onChange={(e) => setFieldValue('country', e.target.value)}
                error={touched.country && errors.country}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="City"
                type="text"
                name="city"
                value={values.city}
                onChange={(e) => setFieldValue('city', e.target.value)}
                error={touched.city && errors.city}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.fileInputLabel}>Profile Photo</label>
              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  className={styles.fileInput}
                  accept=".jpg, .png"
                  onChange={(e) => setFieldValue('photo', e.target.files[0])}
                />
                <div className={styles.fileInputText}>
                  {values.photo ? values.photo.name : 'Choose a file...'}
                </div>
              </div>
              {touched.photo && errors.photo && (
                <div className={styles.errorMessage}>{errors.photo}</div>
              )}
              <div className={styles.fileInputHint}>Accepted formats: JPG, PNG. Max size: 5MB</div>
            </div>

            <div className={styles.formActions}>
              <Button variant="primary" type="submit">Save Changes</Button>
            </div>
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
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.currentPassword && errors.currentPassword}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && errors.newPassword}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                label="Confirm New Password"
                type="password"
                name="confirmNewPassword"
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmNewPassword && errors.confirmNewPassword}
                fullWidth
              />
            </div>

            <div className={styles.passwordNote}>
              <p>After changing your password, you will be logged out and need to log in again.</p>
            </div>

            <div className={styles.formActions}>
              <Button variant="primary" type="submit">Update Password</Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  } else {
    content = (
      <div className={styles.profileInfoGrid}>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Email</div>
          <div className={styles.infoValue}>{userData.email}</div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Name</div>
          <div className={styles.infoValue}>{userData.name || 'Not specified'}</div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Phone</div>
          <div className={styles.infoValue}>{userData.phone || 'Not specified'}</div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Language</div>
          <div className={styles.infoValue}>{userData.language || 'Not specified'}</div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>Country</div>
          <div className={styles.infoValue}>{userData.country || 'Not specified'}</div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>City</div>
          <div className={styles.infoValue}>{userData.city || 'Not specified'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Your Profile</h1>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.container}>
          <div className={styles.profileLayout}>
            {/* Profile Sidebar */}
            <aside className={styles.profileSidebar}>
              <Card className={styles.profileCard}>
                <div className={styles.profilePhotoContainer}>
                  <div className={styles.profilePhoto}>
                    <img src={userData.photoUrl || standardImg} alt="Profile" />
                  </div>
                  {!editProfile && !changePassword && (
                    <div className={styles.profileName}>
                      <h3>{userData.name || userData.email.split('@')[0]}</h3>
                      <p className={styles.profileEmail}>{userData.email}</p>
                    </div>
                  )}
                </div>

                <div className={styles.profileActions}>
                  <Button
                    variant={editProfile ? "secondary" : "primary"}
                    fullWidth
                    onClick={() => {
                      setEditProfile(!editProfile);
                      setChangePassword(false);
                    }}
                  >
                    {editProfile ? 'Cancel Editing' : 'Edit Profile'}
                  </Button>

                  <Button
                    variant={changePassword ? "secondary" : "outline"}
                    fullWidth
                    onClick={() => {
                      setChangePassword(!changePassword);
                      setEditProfile(false);
                    }}
                  >
                    {changePassword ? 'Cancel' : 'Change Password'}
                  </Button>
                </div>
              </Card>
            </aside>

            {/* Profile Main Content */}
            <div className={styles.profileMainContent}>
              <Card className={styles.contentCard}>
                {editProfile && (
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Edit Your Profile</h2>
                    <p className={styles.sectionDescription}>Update your personal information</p>
                  </div>
                )}

                {changePassword && (
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Change Password</h2>
                    <p className={styles.sectionDescription}>Update your password to keep your account secure</p>
                  </div>
                )}

                {!editProfile && !changePassword && (
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Profile Information</h2>
                    <p className={styles.sectionDescription}>Your personal details</p>
                  </div>
                )}

                <div className={styles.profileContentBody}>
                  {content}
                </div>
              </Card>
            </div>
          </div>
        </div>
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

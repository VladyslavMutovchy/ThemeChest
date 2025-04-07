import React from 'react';
import { Formik, Form } from 'formik';
import Select from 'react-select';
import styles from '../../pages/Creator/Creator.module.css';
import { KEYWORDS } from './keyWords';
import { customStyles } from './styles.Select';
import { Button } from '../../components/UI';

const EditThemesForm = ({ themes, guideTarget, validationSchema, onSubmit }) => {
  // Updated custom styles for the select component
  const updatedCustomStyles = {
    ...customStyles,
    control: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid var(--primary-color)',
      },
      padding: '4px',
      marginBottom: '16px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(var(--primary-color-rgb), 0.1)'
        : state.isFocused
          ? 'rgba(var(--primary-color-rgb), 0.05)'
          : 'transparent',
      color: state.isSelected ? 'var(--primary-color)' : 'var(--text-color)',
      '&:hover': {
        backgroundColor: 'rgba(var(--primary-color-rgb), 0.05)',
      },
    }),
  };

  return (
    <Formik initialValues={{ themes }} enableReinitialize={true} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <Form className={styles.form}>
          <div className={styles.themeContainer}>
            <label className={styles.formLabel}>Selected Themes ({values.themes.length}/6)</label>
            <div className={styles.themesWrapper}>
              {values.themes.length > 0 ? (
                values.themes.map((theme, index) => (
                  <div key={index} className={styles.themeItem}>
                    <span>{theme}</span>
                    <button
                      type="button"
                      className={styles.removeThemeBtn}
                      onClick={() => {
                        const newThemes = values.themes.filter((_, i) => i !== index);
                        setFieldValue('themes', newThemes);
                      }}
                      aria-label={`Remove ${theme} theme`}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyThemes}>No themes selected yet</div>
              )}
            </div>

            <label className={styles.formLabel}>Add Theme</label>
            <Select
              classNamePrefix="custom-select"
              styles={updatedCustomStyles}
              options={KEYWORDS.filter((keyword) => !values.themes.includes(keyword)).map((keyword) => ({
                value: keyword,
                label: keyword,
              }))}
              onChange={(selectedOption) => {
                if (selectedOption && values.themes.length < 6) {
                  setFieldValue('themes', [...values.themes, selectedOption.value]);
                }
                setFieldValue('selectedTheme', null);
              }}
              value={null}
              placeholder="Search and select a theme"
              isClearable
              isDisabled={values.themes.length >= 6}
            />
            {values.themes.length >= 6 && (
              <div className={styles.ErrorMessage}>Maximum of 6 themes reached</div>
            )}
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              Save Themes
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditThemesForm;

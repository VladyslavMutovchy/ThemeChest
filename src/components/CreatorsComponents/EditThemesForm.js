import React from 'react';
import { Formik, Form } from 'formik';
import Select from 'react-select';
import styles from '../../pages/Creator/Creator.module.css';
import { KEYWORDS } from './keyWords';
import { customStyles } from './styles.Select';

const EditThemesForm = ({ themes, guideTarget, validationSchema, onSubmit }) => (
  <Formik initialValues={{ themes }} enableReinitialize={true} validationSchema={validationSchema} onSubmit={onSubmit}>
    {({ values, setFieldValue }) => (
      <Form className={styles.form}>
        <h3>Edit Themes for: {guideTarget.title}</h3>
        <div className={styles.wrapper_themes}>
          <div className={styles.container_themes}>
            {values.themes.length > 0 ? (
              values.themes.map((theme, index) => (
                <div key={index} className={styles.themeItem}>
                  <span>{theme}</span>
                  <button
                    type="button"
                    className={styles.dell_btn}
                    onClick={() => {
                      const newThemes = values.themes.filter((_, i) => i !== index);
                      setFieldValue('themes', newThemes);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.grey_text}>Selected themes</p>
            )}
          </div>

          <Select
            classNamePrefix="custom-select"
            styles={customStyles}
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
          />
        </div>
        <button type="submit" className={styles.btn}>
          Save Themes
        </button>
      </Form>
    )}
  </Formik>
);

export default EditThemesForm;

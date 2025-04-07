import React from 'react';
import styles from './Select.module.css';
import classNames from 'classnames';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Выберите...',
  error,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={classNames(styles.selectContainer, { [styles.fullWidth]: fullWidth }, className)}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={classNames(styles.select, { [styles.error]: error })}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Select;

import React from 'react';
import styles from './Input.module.css';
import classNames from 'classnames';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={classNames(styles.inputContainer, { [styles.fullWidth]: fullWidth }, className)}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(styles.input, { [styles.error]: error })}
        {...props}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Input;

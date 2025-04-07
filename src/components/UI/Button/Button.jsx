import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.fullWidth]: fullWidth },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

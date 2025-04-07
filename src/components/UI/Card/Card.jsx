import React from 'react';
import styles from './Card.module.css';
import classNames from 'classnames';

const Card = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.card,
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

import React, { useState, useEffect } from 'react';
import styles from './SignupModal.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { registration } from '../../actions/auth';
import { toast } from 'react-toastify';

const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(true);
  const [isEmailError, setEmailError] = useState(true);
  const [isValid, setValidity] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation]
            ? setMinLengthError(true)
            : setMinLengthError(false);
          break;
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true);
          break;
        case 'isEmailError':
          // eslint-disable-next-line
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          re.test(String(value).toLowerCase())
            ? setEmailError(false)
            : setEmailError(true);
          break;

        default:
          break;
      }
    }
  }, [value, validations]);

  useEffect(() => {
    if (isEmpty || isEmailError || minLengthError) {
      setValidity(false);
    } else {
      setValidity(true);
    }
  }, [isEmpty, isEmailError, minLengthError]);

  return { isEmpty, minLengthError, isEmailError, isValid };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const valid = useValidation(value, validations);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    setIsDirty(true);
  };
  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid,
  };
};

const SignupModal = (props) => {
  const { registration, onClose } = props;
  const navigate = useNavigate();

  const email = useInput('', { isEmpty: true, minLength: 3, isEmailError: true });
  const password = useInput('', { isEmpty: true, minLength: 6 });
  const repeatPassword = useInput('', { isEmpty: true, minLength: 6 });

  const submitHandler = async () => {
   
    if (!email.isValid) {
      return; 
    } 
  
    if (password.value !== repeatPassword.value) {
      return <div style={{ color: '#ff0000' }}>Passwords mismatch</div>;
    }
  
    const formData = { email: email.value, password: password.value };
    await registration(formData, () => {
      navigate('/');
      onClose();
    }, () => {
      toast.error('Signup failed');
    });
  };
  

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>Signup</h2>
        <form className={styles.form}>
          <label>
            <div className={styles.title}>Email</div>
            {email.isDirty && email.isEmpty && <div style={{ color: '#ff0000' }}>Area cannot be empty</div>}
            {email.isDirty && email.minLengthError && <div style={{ color: '#ff0000' }}>Area cannot be lesser than 6</div>}
            {email.isDirty && email.isEmailError && <div style={{ color: '#ff0000' }}>Incorrect email</div>}
            <input className={styles.input} value={email.value} onChange={email.onChange} onBlur={email.onBlur} type="email" />
          </label>
          <label>
            <div className={styles.title}>Password</div>
            {password.isDirty && password.isEmpty && <div style={{ color: '#ff0000' }}>Area cannot be empty</div>}
            {password.isDirty && password.minLengthError && <div style={{ color: '#ff0000' }}>Area cannot be lesser than 6</div>}
            <input className={styles.input} value={password.value} onChange={password.onChange} onBlur={password.onBlur} type="password" />
          </label>
          <label>
            <div className={styles.title}>Repeat Password</div>
            {repeatPassword.isDirty && repeatPassword.isEmpty && <div style={{ color: '#ff0000' }}>Area cannot be empty</div>}
            {repeatPassword.isDirty && repeatPassword.minLengthError && <div style={{ color: '#ff0000' }}>Area cannot be lesser than 6</div>}
            {repeatPassword.isDirty && password.value !== repeatPassword.value && <div style={{ color: '#ff0000' }}>Passwords do not match</div>}
            <input className={styles.input} value={repeatPassword.value} onChange={repeatPassword.onChange} onBlur={repeatPassword.onBlur} type="password" />
          </label>
          <button className={styles.btn} onClick={submitHandler} type="button">Register</button>
        </form>
        
      </div>
    </div>
  );
};

const mapDispatchToProps = { registration };

export default connect(null, mapDispatchToProps)(SignupModal);

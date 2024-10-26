import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../actions/auth';
import styles from './LoginModal.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const LoginModal = (props) => {
  const { login, onClose } = props;
  const navigate = useNavigate();

  const email = useInput('', {
    isEmpty: true,
    minLength: 3,
    isEmailError: true,
  });
  const password = useInput('', { isEmpty: true, minLength: 6 });

  const submitHandler = async () => {
    if (!email.isValid || !password.isValid) {
      return; 
    }
    const formData = {
      email: email.value,
      password: password.value,
    };
  
    await login(formData, () => {
      navigate('/');
      onClose();
    }, () => {
      toast.error('User not found');
    });
  };
  

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>Login</h2>
        <form className={styles.form}>
          <label>
            <div className={styles.title}>Email</div>
            {email.isDirty && email.isEmpty && <div className={styles.error}>Area cannot be empty</div>}
            {email.isDirty && email.minLengthError && <div className={styles.error}>Area cannot be lesser than 3</div>}
            {email.isDirty && email.isEmailError && <div className={styles.error}>Incorrect email</div>}
            <input
              className={styles.input}
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              type="email"
            />
          </label>
          <label>
            <div className={styles.title}>Password</div>
            {password.isDirty && password.isEmpty && <div className={styles.error}>Area cannot be empty</div>}
            {password.isDirty && password.minLengthError && <div className={styles.error}>Area cannot be lesser than 6</div>}
            <input
              className={styles.input}
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              type="password"
            />
          </label>
          <button
            className={styles.btn}
            onClick={submitHandler}
            type="button"
          >
            Login
          </button>
          <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={true} />
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  login,
};

export default connect(null, mapDispatchToProps)(LoginModal);

import { post } from './api';

export const authAPI = {
  registration(registrationData) {
    return post('auth/registration', registrationData);
  },

  login(loginData) {
    return post('auth/login', loginData);
  },

  googleAuth(code) {
    return post('auth/google', { code });
  },

  facebookAuth(code) {
    return post('auth/facebook', { code });
  },
};

import { postAuth } from './api';

export const authAPI = {
  registration(registrationData) {
    return postAuth('auth/registration', registrationData);
  },

  login(loginData) {
    console.log('======>', loginData);
    return postAuth('auth/login', loginData);
  },

  googleAuth(code) {
    return postAuth('auth/google', { code });
  },

  facebookAuth(code) {
    return postAuth('auth/facebook', { code });
  },
};

import * as _ from 'lodash';
import { toast } from 'react-toastify';

import { logout } from './auth';
import { isFetching } from './preloader';
 
export const actionWrapper = (action, errorCallback) => async (dispatch, getState) => {
  try {
    const newState = await action(dispatch, getState);
    if (newState) {
      dispatch(newState);
    }
  } catch (error) {
    dispatch(isFetching(false));
    const response = _.get(error, 'response.data');

    if (!response) {
      toast.error('Server error', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } else {
      const errorMessage = response.message || 'Server error';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }

    try {
      if (response && response.error === 'jwt expired') {
        return dispatch(logout());
      }

      if (errorCallback) {
        errorCallback(response.error, dispatch);
      } else {
        toast.error(response.message || error.message || 'Server error', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    } catch (parseError) {
      toast.error(error.message || 'Server error', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  }
};

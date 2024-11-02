import * as _ from 'lodash';
import { toast } from 'react-toastify';

import { logout } from './auth';
import { isFetching } from './preloader';
// Логика работы:

//     Внутри функции происходит попытка выполнения переданного действия (action). Если оно возвращает новое состояние (newState), это состояние отправляется в Redux при помощи dispatch.
//     Если происходит ошибка, обработчик ловит её и выполняет следующее:
//         Останавливает индикатор загрузки (dispatch(isFetching(false))).
//         Проверяет наличие ответа сервера через _.get(error, 'request.response'). Если ответа нет, выводится уведомление о серверной ошибке с помощью toast.error.
//         Если ответ сервера существует, функция пытается его разобрать (предполагается, что это JSON). Если токен JWT истёк, вызывается logout(), что приведёт к выходу пользователя из системы.
//         Если ошибка другая, то либо вызывается errorCallback, если он передан, либо выводится стандартное уведомление с ошибкой через toast.

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

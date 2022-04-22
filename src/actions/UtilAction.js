/* eslint-disable no-shadow */
import { REQUEST_SUBTYPE } from './ActionTypes';
import { myLog } from '../Debug';
import LoadingManager from '../components/element/Loading/LoadingManager';
import { getValueFromObjectByKeys } from '../utils/Util';
import { isArray, isString } from 'lodash';
import NavigationService from '../navigation/NavigationService';
import SessionQueue from '../connection/SessionQueue';

const { REQUEST, SUCCESS, ERROR } = REQUEST_SUBTYPE;

export const getAction = ({
  Actions = null,
  actionName = '',
  data = {},
  onAfter = (dispatch, getState, data) => {
    return data;
  },
  onBefore = (dispatch, getState, data) => {
    return data;
  },
}) => {
  if (Actions === null || actionName === '') {
    return null;
  }
  return async (dispatch, getState) => {
    onBefore && onBefore(dispatch, getState, data);
    dispatch(Actions[actionName](data));
    onAfter && onAfter(dispatch, getState, data);
  };
};

export const getActionAPI = ({
  Actions = null,
  visibleSpin = false,
  actionName = '',
  delayTime = 100,
  promiseApi = async () => { },
  arg = {},
  dispatchRedux = true,
  dispatchRequest = true,
  extraDataRedux = {},
  isTouch = false,
  isToast = true,
  displayMessage = true,
  sessionKey = null,
  handlerAfterDismissPopupMessage = () => { },
  onBeforeRequest = (dispatch, getState, arg) => {
    return arg;
  },
  onAfterRequest = (dispatch, getState, arg) => {
    return arg;
  },
  dispatchSuccess = true,
  onBeforeSuccess = (dispatch, getState, data) => {
    return data;
  },
  onAfterSuccess = (dispatch, getState, data) => {
    return data;
  },
  dispatchError = true,
  onBeforeError = (dispatch, getState, data) => {
    return data;
  },
  onAfterError = (error) => {
    return console.error();
  },
}) => {
  if (Actions === null || actionName === '') {
    return null;
  }
  return async (dispatch, getState) => {
    if (visibleSpin) {
      LoadingManager.getInstance().visibleLoading();
    }
    // TcoN.D-Request
    if (onBeforeRequest) {
      let argTmp = onBeforeRequest(dispatch, getState, {
        ...arg,
      });
      if (typeof argTmp === 'object') {
        arg = argTmp;
      }
    }
    dispatchRedux &&
      dispatchRequest &&
      dispatch(
        Actions[actionName + REQUEST]({
          ...arg,
          isTouch,
          isToast,
        })
      );
    onAfterRequest && onAfterRequest(dispatch, getState, { ...arg });
    try {
      onBeforeSuccess && onBeforeSuccess(dispatch, getState);
      const data = await promiseApi();
      dispatchRedux &&
        dispatchSuccess &&
        dispatch(
          Actions[actionName + SUCCESS]({
            ...data,
            extraDataRedux,
            isTouch,
            handlerAfterDismissPopupMessage,
          })
        );
      onAfterSuccess &&
        setTimeout(() => onAfterSuccess(dispatch, getState, data));
      if (visibleSpin) {
        const funcCloseSpin = () => {
          LoadingManager.getInstance().visibleLoading(false);
          handlerCSS && clearTimeout(handlerCSS);
        };
        let handlerCSS = setTimeout(funcCloseSpin, delayTime);
      }
      if (sessionKey) {
        const session = getValueFromObjectByKeys(data, ['data', 'session']);
        myLog('session', sessionKey, SessionQueue.isLatestSession(sessionKey, session));
        if (!SessionQueue.isLatestSession(sessionKey, session)) { throw {}; }
      }
      myLog('GetActionAPI', data);
      return data;
    } catch (err) {
      myLog('UtilActionErr', err);
      const error = getValueFromObjectByKeys(err, ['errors']);
      let errMsg = '';
      if (error) {
        if (isString(error)) {
          errMsg = error;
        }
        if (isArray(error) && error.length > 0) {
          errMsg = error[0];
        }
      }
      if (errMsg && displayMessage) {
        if (isToast) {
          NavigationService.getInstance().showToast({ message: errMsg });
        } else {
          alert(errMsg);
        }
      }
      onBeforeError && onBeforeError(dispatch, getState);
      dispatchRedux &&
        dispatchError &&
        dispatch(
          Actions[actionName + ERROR]({
            ...err,
            isTouch,
            isToast,
            handlerAfterDismissPopupMessage,
          })
        );
      onAfterError && onAfterError(err);
      if (visibleSpin) {
        const funcCloseSpin = () => {
          LoadingManager.getInstance().visibleLoading(false);
          handlerCES && clearTimeout(handlerCES);
        };
        let handlerCES = setTimeout(funcCloseSpin, delayTime);
      }
      throw err;
    }
  };
};

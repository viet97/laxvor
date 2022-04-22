const encodeString = (str, isRequire = false) => {
  if (isRequire) {
    return str;
  }
  return str;
};

export const REQUEST_TYPE = {
  //user
  LOGIN: encodeString('LOGIN'),
};

export const REQUEST_SUBTYPE = {
  REQUEST: encodeString('OnRequest'),
  ERROR: encodeString('OnError'),
  SUCCESS: encodeString('OnSuccess'),
};

export const NORMAL_TYPE = {
  SWITCH_MODE: encodeString('SWITCH_MODE'),
};

export const NAVIGATION_ACTION = {
  NAVIGATE: encodeString('Navigate'),
  GO_BACK: encodeString('GoBack'),
  INIT: encodeString('Init'),
  RESET: encodeString('Reset'),
};

const ActionTypes = {
  NAVIGATION_ACTION,
  REQUEST_TYPE,
  REQUEST_SUBTYPE,
  NORMAL_TYPE,
};

export default ActionTypes;

import { REQUEST_SUBTYPE } from './ActionTypes';

const { REQUEST, SUCCESS, ERROR } = REQUEST_SUBTYPE;

class RAction {
  constructor({ actionListApi = [], actionName = '', actionListNormal = [] }) {
    this.actionListApi = {};
    this.actionListNormal = {};
    for (let i = 0; i < actionListApi.length; i++) {
      const element = actionListApi[i];
      this.actionListApi[element] = element;
    }
    for (let j = 0; j < actionListNormal.length; j++) {
      const element = actionListNormal[j];
      this.actionListNormal[element] = element;
    }
    this.actionName = actionName || '';
    this._init();
  }

  _init() {
    Object.keys(this.actionListNormal).forEach(key => {
      let actionKey = this.actionListNormal[key];
      this[key] = data => {
        let action = {
          type: actionKey,
          key: actionKey,
          data,
        };
        return action;
      };
    });
    Object.keys(this.actionListApi).forEach(key => {
      let actionKey = this.actionListApi[key];
      this[key + REQUEST] = data => {
        let action = {};
        action.type = actionKey + REQUEST;
        action.key = actionKey;
        action.subType = REQUEST;
        if (data) {
          action.data = data;
        }
        return action;
      };
      this[key + SUCCESS] = data => {
        let action = {};
        action.type = actionKey + SUCCESS;
        action.key = actionKey;
        action.subType = SUCCESS;
        if (data) {
          action.data = data;
        }
        return action;
      };
      this[key + ERROR] = data => {
        let action = {};
        action.type = actionKey + ERROR;
        action.key = actionKey;
        action.subType = ERROR;
        if (data) {
          action.data = data;
        }
        return action;
      };
    });
    return this;
  }
}

export const createrAction = ({
  actionListApi = [],
  actionName = '',
  actionListNormal = [],
}) => {
  return new RAction({ actionListApi, actionName, actionListNormal });
};

export default RAction;

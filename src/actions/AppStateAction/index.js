import { createrAction } from '../RAction';
import { NORMAL_TYPE } from '../ActionTypes';
import { getAction } from '../UtilAction';

const { SWITCH_MODE } = NORMAL_TYPE;

const Actions = createrAction({
  actionName: 'AppStateAction',
  actionListNormal: [SWITCH_MODE],
});

const switchMode = data => {
  return getAction({
    Actions: Actions,
    actionName: SWITCH_MODE,
    data: data,
  });
};

export default {
  switchMode,
};

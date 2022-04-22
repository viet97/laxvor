import { REQUEST_TYPE } from '../ActionTypes';
import { createrAction } from '../RAction';

const {

} = REQUEST_TYPE;

const Actions = createrAction({
  actionName: 'UserAction',
  actionListApi: [
  
  ],
});

// const login = ({ email, password }) => {
//   return getActionAPI({
//     Actions,
//     actionName: LOGIN,
//     promiseApi: async () => {
//       return ManagerAPI.getInstance().login({ email, password });
//     },
//   });
// };

export default {
  login,

};

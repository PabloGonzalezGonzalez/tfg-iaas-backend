import { ADD_USER_FILE, CREATE_FILE, RESET_FILE, RESET_PASSWORD_FILE, RESTART_FILE, START_FILE, STOP_FILE } from './files';

export const PLAYBOOKS = {
  create: CREATE_FILE,
  start: START_FILE,
  stop: STOP_FILE,
  restart: RESTART_FILE,
  reset: RESET_FILE,
  resetPassword: RESET_PASSWORD_FILE,
  addUser: ADD_USER_FILE
};

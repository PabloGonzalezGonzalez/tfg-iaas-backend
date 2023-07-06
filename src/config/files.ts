import Path from 'path';

export const START_FILE = Path.join(__dirname, '..', 'ansible', 'start_vm');
export const STOP_FILE = Path.join(__dirname, '..', 'ansible', 'stop_vm');
export const CREATE_FILE = Path.join(__dirname, '..', 'ansible', 'create_vm');
export const REMOVE_FILE = Path.join(__dirname, '..', 'ansible', 'remove_vm');
export const RESTART_FILE = Path.join(__dirname, '..', 'ansible', 'restart_vm');
export const RESET_FILE = Path.join(__dirname, '..', 'ansible', 'reset_vm');
export const ADD_USER_FILE = Path.join(__dirname, '..', 'ansible', 'addUser');
export const RESET_PASSWORD_FILE = Path.join(
  __dirname,
  '..',
  'ansible',
  'reset_password'
);

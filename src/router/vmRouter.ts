import { Request, Response, Router } from 'express';
import { ActionType, createVarsFile, CreateVMInterface, execAnsiblePlaybook } from '../utils/serverUtils';
import Path from 'path'; /* files */

/* files */
const START_FILE = Path.join(__dirname, '..', 'ansible', 'start_vm');
const STOP_FILE = Path.join(__dirname, '..', 'ansible', 'stop_vm');
const CREATE_FILE = Path.join(__dirname, '..', 'ansible', 'create_vm');
const REMOVE_FILE = Path.join(__dirname, '..', 'ansible', 'remove_vm');
const RESTART_FILE = Path.join(__dirname, '..', 'ansible', 'restart_vm');
const RESET_PASSWORD_FILE = Path.join(
  __dirname,
  '..',
  'ansible',
  'reset_password'
);
const TEST_NSUPDATE = Path.join(__dirname, '..', 'ansible', 'test_nsupdate');

/* constants */
const PLAYBOOKS = {
  start: START_FILE,
  stop: STOP_FILE,
  resetPassword: RESET_PASSWORD_FILE,
  restart: RESTART_FILE,
  nsupdate: TEST_NSUPDATE
  // resetVM: RESET_FILE,
  // clone: CLONE_FILE,
  // addUser: ADD_USER_FILE
};

/* router */
const vmRouter = Router();

vmRouter.post('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as CreateVMInterface[] });

    const executePlaybook = new Promise((resolve, reject) => {
      const resultCode = execAnsiblePlaybook(CREATE_FILE);
      if (resultCode === 0) {
        resolve('Success');
      }
      reject('Error');
    });

    executePlaybook.then(
      (value) => res.send(`Codigo: ${value}`),
      (value) => res.send(`Codigo: ${value}`)
    );
  }

  res.send('Error: no body on request');
});

vmRouter.delete('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as string[] });

    const executePlaybook = new Promise((resolve, reject) => {
      const resultCode = execAnsiblePlaybook(REMOVE_FILE);
      if (resultCode === 0) {
        resolve('Success');
      }
      reject('Error');
    });

    executePlaybook.then(
      (value) => res.send(`Codigo: ${value}`),
      (value) => res.send(`Codigo: ${value}`)
    );
  }
  res.send('Error: no body on request');
});

vmRouter.put('/', (req: Request, res: Response) => {
  if (req.body) {
    const { action, nodes, vmUsername } = req.body;
    createVarsFile({
      action: action as ActionType,
      nodes: nodes as string[],
      vmUsername: vmUsername as string
    });

    const executePlaybook = new Promise((resolve, reject) => {
      const resultCode = execAnsiblePlaybook(PLAYBOOKS[`${action}`]);
      if (resultCode === 0) {
        resolve('Success');
      }
      reject('Error');
    });

    executePlaybook.then(
      (value) => res.send(`Codigo: ${value}`),
      (value) => res.send(`Codigo: ${value}`)
    );
  }
  res.send('Error: no body on request');
});

export default vmRouter;

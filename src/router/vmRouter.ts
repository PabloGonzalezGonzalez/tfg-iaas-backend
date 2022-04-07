import { Request, Response, Router } from 'express';
import { actionType, createVarsFile, createVMInterface, execAnsiblePlaybook } from '../utils/serverUtils';
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

/* constants */
const PLAYBOOKS = {
  start: START_FILE,
  stop: STOP_FILE,
  resetPassword: RESET_PASSWORD_FILE,
  restart: RESTART_FILE
  // resetVM: RESET_FILE,
  // clone: CLONE_FILE,
  // addUser: ADD_USER_FILE
};

/* router */
const vmRouter = Router();

vmRouter.post('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as createVMInterface[] });
    execAnsiblePlaybook(CREATE_FILE);
  }
  res.send('Success on creating vm');
});

vmRouter.delete('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as string[] });
    execAnsiblePlaybook(REMOVE_FILE);
  }
  res.send('Success on removing vm');
});

vmRouter.put('/', (req: Request, res: Response) => {
  if (req.body) {
    const { action, nodes, vmUsername } = req.body;
    createVarsFile({
      action: action as actionType,
      nodes: nodes as string[],
      vmUsername: vmUsername as string
    });
    execAnsiblePlaybook(PLAYBOOKS[`${action}`]);
  }
  res.send('Success on making an action');
});

export default vmRouter;

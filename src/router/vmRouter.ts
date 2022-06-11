import { Request, Response, Router } from 'express';
import { createVarsFile, CreateVMInterface, execAnsiblePlaybook } from '../utils/serverUtils';
import Path from 'path';

/* files */
const START_FILE = Path.join(__dirname, '..', 'ansible', 'start_vm');
const STOP_FILE = Path.join(__dirname, '..', 'ansible', 'stop_vm');
const CREATE_FILE = Path.join(__dirname, '..', 'ansible', 'create_vm');
const REMOVE_FILE = Path.join(__dirname, '..', 'ansible', 'remove_vm');
const RESTART_FILE = Path.join(__dirname, '..', 'ansible', 'restart_vm');
const RESET_FILE = Path.join(__dirname, '..', 'ansible', 'reset_vm');
const SHARE_FILE = Path.join(__dirname, '..', 'ansible', 'share_vm');
const RESET_PASSWORD_FILE = Path.join(
  __dirname,
  '..',
  'ansible',
  'reset_password'
);
const INVENTORY_FILE = Path.join(__dirname, '..', 'ansible', 'inventory', 'hosts');

/* constants */
const PLAYBOOKS = {
  start: START_FILE,
  stop: STOP_FILE,
  restartVM: RESTART_FILE,
  resetVM: RESET_FILE,
  shareVM: SHARE_FILE,
  // addUser: ADD_USER_FILE
  resetPassword: RESET_PASSWORD_FILE
};

/* router */
const vmRouter = Router();

/* Post */
vmRouter.post('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as CreateVMInterface[] });
    execAnsiblePlaybook(CREATE_FILE);
  }
  res.send('Success on creating vm');
});

/* Delete */
vmRouter.delete('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as string[] });
    execAnsiblePlaybook(REMOVE_FILE);
  }
  res.send('Success on removing vm');
});

/* Put */
vmRouter.put('/state', (req: Request, res: Response) => {
  // Case: start, stop, restart, reset
  if (req.body) {
    const { actionType, nodes } = req.body;
    createVarsFile({
      actionType,
      nodes
    });
    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`]);
  }
  res.send('Success on changing the state');
});

vmRouter.put('/config', (req: Request, res: Response) => {
  // Case: addUser, resetPassword, shareVM
  if (req.body) {
    const { actionType, nodes, targetUsername, ip } = req.body;

    createVarsFile({
      actionType,
      nodes,
      targetUsername,
      ip
    });
    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`]);
  }
  res.send('Success on making an action');
});

export default vmRouter;

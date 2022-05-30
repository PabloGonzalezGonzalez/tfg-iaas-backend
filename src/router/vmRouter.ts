import { Request, Response, Router } from 'express';
import { ActionType, createVarsFile, CreateVMInterface, execAnsiblePlaybook, NodesType } from '../utils/serverUtils';
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

vmRouter.post('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as CreateVMInterface[] });
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
    const { actionType, nodes, targetUsername } = req.body;
    createVarsFile({
      actionType: actionType as ActionType,
      nodes: nodes as NodesType,
      targetUsername: targetUsername as string
    });

    const inventoryFile = actionType === 'resetPassword' ? INVENTORY_FILE : undefined;
    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`], inventoryFile);
  }
  res.send('Success on making an action');
});

export default vmRouter;

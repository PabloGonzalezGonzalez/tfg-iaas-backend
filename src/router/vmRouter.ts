import { Request, Response, Router } from 'express';
import { createVarsFile, CreateVMInterface, execAnsiblePlaybook2 } from '../utils/serverUtils';
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
// const INVENTORY_FILE = Path.join(__dirname, '..', 'ansible', 'inventory', 'hosts');

/* constants */
const PLAYBOOKS = {
  start: START_FILE,
  stop: STOP_FILE,
  restart: RESTART_FILE,
  reset: RESET_FILE,
  shareVM: SHARE_FILE,
  resetPassword: RESET_PASSWORD_FILE
  // addUser: ADD_USER_FILE
};

/* router */
const vmRouter = Router();

// TODO write on logs
/* Post */
vmRouter.post('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as CreateVMInterface[] });

    execAnsiblePlaybook2(CREATE_FILE)
      .then((data) => {
        res.send(`Codigo ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.send(`Error executing the playbook`);
      });
  }
  res.send('Error: no body on request');
});

/* Delete */
vmRouter.delete('/', (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    createVarsFile({ nodes: nodes as string[] });

    execAnsiblePlaybook2(REMOVE_FILE)
      .then((data) => {
        res.send(`Codigo ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.send(`Error executing the playbook`);
      });
  }
  res.send('Error: no body on request');
});

/* Put */
vmRouter.put('/state', (req: Request, res: Response) => {
  // Case: start, stop, restart, reset
  if (req.body) {
    const { actionType, nodes, cluster } = req.body;
    createVarsFile({
      actionType,
      nodes,
      cluster
    });

    execAnsiblePlaybook2(PLAYBOOKS[`${actionType}`])
      .then((data) => {
        res.send(`Codigo ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.send(`Error executing the playbook`);
      });
  }
  else {
    res.send('Error: no body on request');
  }
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

    execAnsiblePlaybook2(PLAYBOOKS[`${actionType}`])
      .then((data) => {
        res.send(`Codigo ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.send(`Error executing the playbook`);
      });
  }

  res.send('Error: no body on request');
});

export default vmRouter;

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
const ADD_USER_FILE = Path.join(__dirname, '..', 'ansible', 'addUser');
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
  resetPassword: RESET_PASSWORD_FILE,
  addUser: ADD_USER_FILE
};

/* router */
const vmRouter = Router();

// TODO write on logs
/* Post */
vmRouter.post('/', async (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    await createVarsFile({ nodes: nodes as CreateVMInterface[] });

    execAnsiblePlaybook(CREATE_FILE)
      .then((data) => {
        res.status(201).send(`Máquina creada con éxito con código de Ansible ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.status(500).send(`Error interno ejecutando el playbook (ver en logs).`);
      });
  } else {
    res.status(400).send('Faltan parámetros: nodes');
  }
});

/* Delete */
vmRouter.put('/remove', async (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    await createVarsFile({ nodes: nodes as string[] });

    execAnsiblePlaybook(REMOVE_FILE)
      .then((data) => {
        res.status(200).send(`Máquina borrada con éxito con código de Ansible ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.status(500).send(`Error interno ejecutando el playbook (ver en logs).`);
      });
  } else {
    res.status(400).send('Faltan parámetros: nodes');
  }
});

/* Put */
vmRouter.put('/state', async (req: Request, res: Response) => {
  // Case: start, stop, restart, reset
  if (req.body) {
    const { actionType, nodes, cluster } = req.body;
    await createVarsFile({
      actionType,
      nodes,
      cluster
    });

    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`])
      .then((data) => {
        res.status(200).send(`Acción ejecutada con éxito con código de Ansible ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.status(500).send(`Error interno ejecutando el playbook (ver en logs).`);
      });
  } else {
    res.status(400).send('Faltan parámetros obligatorios. Ver documentación para saber parámetros por acción');
  }
});

vmRouter.put('/config', async (req: Request, res: Response) => {
  // Case: addUser, resetPassword
  if (req.body) {
    const { actionType, nodes, targetUsername, ip, vmName } = req.body;
    await createVarsFile({
      actionType,
      nodes,
      targetUsername,
      ip,
      vmName
    });

    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`])
      .then((data) => {
        res.status(200).send(`Acción ejecutada con éxito con código de Ansible ${data.code}`);
      })
      .catch((error) => {
        console.warn(error);
        res.status(500).send(`Error interno ejecutando el playbook (ver en logs).`);
      });
  } else {
    res.status(400).send('Faltan parámetros obligatorios. Ver documentación para saber parámetros por acción');
  }
});

export default vmRouter;

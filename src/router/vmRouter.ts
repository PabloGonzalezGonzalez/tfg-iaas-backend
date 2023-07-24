import { Request, Response, Router } from 'express';
import { createVarsFile, CreateVMInterface, execAnsiblePlaybook } from '../utils/serverUtils';
import { PLAYBOOKS } from '../config';

/* router */
const vmRouter = Router();

/* Post */
vmRouter.post('/', async (req: Request, res: Response) => {
  if (req.body) {
    const { nodes } = req.body;
    await createVarsFile({ nodes: nodes as CreateVMInterface[] });

    execAnsiblePlaybook(PLAYBOOKS['create'])
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

    execAnsiblePlaybook(PLAYBOOKS['remove'])
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
    const { actionType, nodes, targetUsername, ip, vmName, ullUsername } = req.body;
    await createVarsFile({
      actionType,
      nodes,
      targetUsername,
      ip,
      vmName,
      ullUsername
    });

    execAnsiblePlaybook(PLAYBOOKS[`${actionType}`], ullUsername)
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

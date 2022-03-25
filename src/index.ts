import express, { Request, Response } from 'express';
import { createVarsFile, execAnsiblePlaybook } from './utils/serverUtils';
import Path from 'path';

import vmRouter from './router/vmRouter';
import inventoryRouter from './router/inventoryRouter';

/* constants */
const app = express();
const PORT = 3000;

/* files */
const GET_INVENTORY_PATH = Path.join(__dirname, 'ansible', 'get_inventory');
const CREATE_VM_PATH = Path.join(__dirname, 'ansible', 'create_vm');
const START_VM_PATH = Path.join(__dirname, 'ansible', 'start_vm');
const STOP_VM_PATH = Path.join(__dirname, 'ansible', 'stop_vm');
const REMOVE_VM_PATH = Path.join(__dirname, 'ansible', 'remove_vm');
console.log({ CREATE_VM_PATH, GET_INVENTORY_PATH, START_VM_PATH });

/* test */
const tmpVars = {
  action: 'remove',
  username: 'alu0100887037',
  password: 'password',
  nodes: 'pablo-test',
  prefix: 'TFG'
};

app.get('/test/create', (req: Request, res: Response) => {
  createVarsFile(tmpVars);
  execAnsiblePlaybook(CREATE_VM_PATH);

  res.send('test create');
});

app.get('/test/inventory', (req: Request, res: Response) => {
  createVarsFile(tmpVars);
  execAnsiblePlaybook(GET_INVENTORY_PATH);

  res.send('test inventory');
});

/* Final endpoints */
app.use('/vm', vmRouter);

app.use('/inventory', inventoryRouter);

app.get('/test/start', (req: Request, res: Response) => {
  createVarsFile(tmpVars);
  execAnsiblePlaybook(START_VM_PATH);

  res.send('test start');
});

app.get('/test/stop', (req: Request, res: Response) => {
  createVarsFile(tmpVars);
  execAnsiblePlaybook(STOP_VM_PATH);

  res.send('test stop');
});

app.get('/test/remove', (req: Request, res: Response) => {
  createVarsFile(tmpVars);
  execAnsiblePlaybook(REMOVE_VM_PATH);

  res.send('test remove');
});

/* server */
app.listen(PORT, () => {
  console.log('🚀 Running at localhost:3000');
});

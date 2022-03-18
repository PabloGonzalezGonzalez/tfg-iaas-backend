import express, { Request, Response } from 'express';

import Path from 'path';

import vmRouter from './router/vmRouter';
import { createVarsFile, execAnsiblePlaybook } from './utils/serverUtils';
import inventoryRouter from './router/inventoryRouter';

/* constants */
const app = express();
const PORT = 3000;

/* files */
const CREATE_MV_PATH = Path.join(__dirname, 'ansible', 'create_mv');
const GET_INVENTORY_PATH = Path.join(__dirname, 'ansible', 'get_inventory');
console.log({ CREATE_MV_PATH, GET_INVENTORY_PATH });

/* Test endpoints */
app.get('/test', (req: Request, res: Response) => {
  const tmp = {
    action: 'remove',
    username: 'alu0100887037',
    password: 'password'
  };

  createVarsFile(tmp);
  execAnsiblePlaybook(GET_INVENTORY_PATH);

  res.send('test');
});

/* Final endpoints */
app.use('/vm', vmRouter);

app.use('/inventory', inventoryRouter);

app.listen(PORT, () => {
  console.log('🚀 Running at localhost:3000');
});

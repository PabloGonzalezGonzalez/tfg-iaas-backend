import express, { Request, Response } from 'express';
import { createVarsFile, execAnsiblePlaybook } from './utils/serverUtils';
import Path from 'path';

const app = express();

/* constants */
const CREATE_MV_PATH = Path.join(__dirname, 'ansible', 'create_mv');
const GET_INVENTORY_PATH = Path.join(__dirname, 'ansible', 'get_inventory');
console.log({ CREATE_MV_PATH, GET_INVENTORY_PATH });

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

app.listen(3000, () => {
  console.log('🚀 Running at localhost:3000');
});

import express from 'express';
import { createVarsFile, execPlaybook } from './utils/serverUtils';
import Path from 'path';

const app = express();

/* constants */
const CREATE_MV_PATH = Path.join(__dirname, 'ansible', 'create_mv');
const GET_INVENTORY_PATH = Path.join(__dirname, 'ansible', 'get_inventory');
console.log({ CREATE_MV_PATH, GET_INVENTORY_PATH });

const varsFile = Path.join(__dirname, 'files', 'vars.json');
const scriptFile = Path.join(__dirname, 'utils', 'parseJsonToYaml.py');

app.get('/test', (req, res) => {
  const tmp = {
    action: 'create',
    username: 'alu0100887037',
    password: 'password'
  };

  createVarsFile(varsFile, scriptFile, tmp);
  execPlaybook(GET_INVENTORY_PATH);

  res.send('test');
});

app.listen(3000, () => {
  console.log('🚀 Running at localhost:3000');
});

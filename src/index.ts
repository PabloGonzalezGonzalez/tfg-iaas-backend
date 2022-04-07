import express from 'express';

import vmRouter from './router/vmRouter';
import inventoryRouter from './router/inventoryRouter';

/* app */
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* files */
// const GET_INVENTORY_PATH = Path.join(__dirname, 'ansible', 'get_inventory');
// const REMOVE_PATH = Path.join(__dirname, 'ansible', 'remove_vm');
// const START_PATH = Path.join(__dirname, 'ansible', 'start_vm');
// const STOP_PATH = Path.join(__dirname, 'ansible', 'stop_vm');
// const CREATE_PATH = Path.join(__dirname, 'ansible', 'create_vm');

/* test */
// const tmpVars = {
//   action: 'remove',
//   username: 'alu0100887037',
//   password: 'password',
//   nodes: 'pablo-test',
//   prefix: 'TFG',
//   vmName: 'TFG-pablo-test'
// };
//
// app.get('/test/create', (req: Request, res: Response) => {
//   createVarsFile(tmpVars);
//   execAnsiblePlaybook(CREATE_PATH);
//   res.send('test create');
// });
//
// app.get('/test/inventory', (req: Request, res: Response) => {
//   createVarsFile(tmpVars);
//   execAnsiblePlaybook(GET_INVENTORY_PATH);
//   res.send('test inventory');
// });
//
// app.get('/test/start', (req: Request, res: Response) => {
//   createVarsFile(tmpVars);
//   execAnsiblePlaybook(START_PATH);
//   res.send('test start');
// });
//
// app.get('/test/stop', (req: Request, res: Response) => {
//   createVarsFile(tmpVars);
//   execAnsiblePlaybook(STOP_PATH);
//   res.send('test stop');
// });
//
// app.get('/test/remove', (req: Request, res: Response) => {
//   createVarsFile(tmpVars);
//   execAnsiblePlaybook(REMOVE_PATH);
//   res.send('test remove');
// });

/* Final endpoints */
app.use('/vm', vmRouter);
app.use('/inventory', inventoryRouter);

/* server */
const PORT = 3000;
app.listen(PORT, () => {
  console.log('🚀 Running at localhost:3000');
});

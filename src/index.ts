import express from 'express';

import vmRouter from './router/vmRouter';
import inventoryRouter from './router/inventoryRouter';
// import { execAnsiblePlaybook } from './utils/serverUtils';

/* app */
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Final endpoints */
app.use('/vm', vmRouter);
app.use('/inventory', inventoryRouter);

// execAnsiblePlaybook(
//   '/Users/pabloglez/code/personal/TFG/2021-2022/archivos-vicente/DevOps-sheeps-Debian-11-fixed-IP-address'
// );

/* server */
const PORT = 3000;
app.listen(PORT, () => {
  console.log('🚀 Running at localhost:3000');
});

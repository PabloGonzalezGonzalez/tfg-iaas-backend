import { Request, Response, Router } from 'express';
import { execAnsiblePlaybook } from '../utils/serverUtils';
import Path from 'path';

/* files */
const INVENTORY_FILE = Path.join(__dirname, '..', 'ansible', 'get_inventory');
// const INVENTORY_RESULT_FILE = Path.join(__dirname, '..', 'files', 'inventory.yaml');

/* router */
const inventoryRouter = Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
  const executePlaybook = new Promise((resolve, reject) => {
    const resultCode = execAnsiblePlaybook(INVENTORY_FILE);
    // FIXME wrong resultCode
    if (resultCode !== 0) {
      resolve('Success');
    }
    reject('Error');
  });

  executePlaybook.then(
    (value) => {
      res.send(`Codigo: ${value}`);
    },
    (value) => res.send(`Codigo: ${value}`)
  );
});

export default inventoryRouter;

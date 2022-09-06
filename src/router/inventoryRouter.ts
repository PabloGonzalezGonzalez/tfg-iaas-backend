import { Request, Response, Router } from 'express';
import Path from 'path';
import { execAnsiblePlaybook2 } from '../utils/serverUtils';

/* files */
const INVENTORY_FILE = Path.join(__dirname, '..', 'ansible', 'get_inventory');
// const INVENTORY_RESULT_FILE = Path.join(__dirname, '..', 'files', 'inventory.yaml');

/* router */
const inventoryRouter = Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
  // TODO extract invetory from result
  execAnsiblePlaybook2(INVENTORY_FILE)
    .then((data) => {
      res.send(`Codigo ${data.code}`);
    })
    .catch((error) => {
      console.warn(error);
      res.send(`Error executing the playbook`);
    });
});

export default inventoryRouter;

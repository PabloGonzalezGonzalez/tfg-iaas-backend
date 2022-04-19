import { Request, Response, Router } from 'express';
import { execAnsiblePlaybook } from '../utils/serverUtils';
import Path from 'path';

/* files */
const INVENTORY_FILE = Path.join(__dirname, '..', 'ansible', 'get_inventory');

/* router */
const inventoryRouter = Router();

inventoryRouter.get('/', (req: Request, res: Response) => {
  execAnsiblePlaybook(INVENTORY_FILE);

  res.send('Inventory router working correctly');
});

export default inventoryRouter;

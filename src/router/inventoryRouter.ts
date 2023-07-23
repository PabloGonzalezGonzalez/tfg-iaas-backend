import { Request, Response, Router } from 'express';
import { exec } from 'child_process';
import { SERVER_IP } from '../config';

/* router */
const inventoryRouter = Router();

inventoryRouter.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;
  exec(`sh ./scripts/get_inventory.sh ${SERVER_IP} ${id}`, (error, stdout, stderr) => {
    if (error) {
      res.status(400).send(`error: ${error}`);
      return;
    }
    if (stderr) {
      res.status(400).send(`stderr: ${stderr}`);
      return;
    }
    res.status(200).send(`stdout: ${stdout}`);
  });
});

export default inventoryRouter;

import { Request, Response, Router } from 'express';
import { exec } from 'child_process';

/* router */
const inventoryRouter = Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
  exec(`sh ${__dirname}/../scripts/get_inventory.sh`, (error, stdout, stderr) => {
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

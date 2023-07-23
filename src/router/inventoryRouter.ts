import { Request, Response, Router } from 'express';
import { exec } from 'child_process';
import { SERVER_IP } from '../config';
import fs from 'fs';

/* router */
const inventoryRouter = Router();

inventoryRouter.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log('Ejecutando get_inventory...');
  exec(`sh ./scripts/get_inventory.sh ${SERVER_IP} ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(400).send(`error: ${error}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.status(400).send(`stderr: ${stderr}`);
      return;
    }

    try {
      const inventory = fs.readFileSync(`./ansible/inventory/hosts-${id}`, 'utf-8');
      console.log(inventory);
      res.status(200).send(inventory);
    } catch (err) {
      console.log(`Error leyendo el inventario: ${err}`);
      res.status(200).send(`stdout: ${stdout}`);
    }
  });
});

export default inventoryRouter;

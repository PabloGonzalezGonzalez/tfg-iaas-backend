import { Router, Request, Response } from 'express';

const inventoryRouter = Router();

inventoryRouter.get('/', (req: Request, res: Response) => {
  console.log({ req, res });

  res.send('Inventory router working correctly');
});

export default inventoryRouter;

import { Router, Request, Response } from 'express';

const vmRouter = Router();

vmRouter.get('/', (req: Request, res: Response) => {
  console.log({ req, res });

  res.send('Vm router working correctly');
});

export default vmRouter;

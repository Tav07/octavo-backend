import { Request, Response, Router } from "express";

const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default healthRouter;
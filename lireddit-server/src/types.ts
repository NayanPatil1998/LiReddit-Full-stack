import { Response, Request } from "express";
import { Redis } from "ioredis";
export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
};

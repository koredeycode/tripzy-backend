import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateResource =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(
        `Validating request: from ${req.method} ${req.originalUrl} with body:`,
        req.body
      );
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log("Validation successful");
      next();
    } catch (e: any) {
      console.error("Validation error:", e);
      if (e instanceof ZodError) {
        return res.status(400).send((e as any).errors);
      }
      return res.status(400).send(e.errors);
    }
  };

import express from "express";

class InvoiceMiddleware {
  validateDeadlineLaterThanCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body?.created_at_utc || !req.body.deadline_at_utc) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date and deadline date are required!"
      })
    }
    const createdAt = new Date(req.body.created_at_utc).getTime();
    const deadlineAt = new Date(req.body.deadline_at_utc).getTime();

    if (deadlineAt < createdAt) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date cannot be greater than deadline date!"
      })
    }

    next();
  };
}

export default new InvoiceMiddleware();
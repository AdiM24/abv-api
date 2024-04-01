import express from "express";
import AutoProfitLossService from "../services/auto-profit-loss/auto-profit-loss.service";

class AutoProfitLossController {

  async getReport(req: express.Request, res: express.Response) {
    const result = await AutoProfitLossService.getReport(req.query)

    res.status(result?.code).send({
      message: result?.message
    });
  }

  async getReportPdf(req: express.Request, res: express.Response) {
    const result = await AutoProfitLossService.getReportPdf(req.query)

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=export.pdf`)

    result.pipe(res);
  }

}

export default new AutoProfitLossController();

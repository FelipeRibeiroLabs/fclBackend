import * as fcl from "@onflow/fcl";
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? "./.env.test" : "./.env",
});

import express from "express";
import strongErrorHandler from "strong-error-handler";
import { json, urlencoded } from "body-parser";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import orbiesRoutes from "@routes/orbies.routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(
      strongErrorHandler({
        debug: true,
      })
    );
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");
  }

  private routes(): void {
    this.app.get("/healthz", (req, res) => {
      res.json({ fclApiOk: true });
    });

    this.app.use(orbiesRoutes)
  }
}

export default new App().app;

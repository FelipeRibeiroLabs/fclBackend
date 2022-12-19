import OrbiesController from "@controller/orbies/OrbiesController";
import { Router } from "express";

const orbiesRoutes = Router();

orbiesRoutes.post("/getOrbies", OrbiesController.getOrbies);
orbiesRoutes.post("/getServerAuth", OrbiesController.getServerAuth);

export default orbiesRoutes;
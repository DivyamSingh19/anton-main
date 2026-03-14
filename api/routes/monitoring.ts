import { Router } from "express";
import { MonitoringController } from "../controllers/user/monitoring";
import { userAuthMiddleware } from "../middlewares/auth/user";

const monitoringRouter = Router();
const monitoringController = new MonitoringController();

monitoringRouter.post("/start", userAuthMiddleware, monitoringController.start);
monitoringRouter.get("/view", userAuthMiddleware, monitoringController.view);

export default monitoringRouter;

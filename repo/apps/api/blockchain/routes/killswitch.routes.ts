import { Router } from "express";
import * as KillSwitchController from "../controllers/killswitch.controller";

const killswitchRouter = Router();

 
killswitchRouter.get("/cooldown", KillSwitchController.getCooldown);
killswitchRouter.get("/authority", KillSwitchController.getAuthority);
killswitchRouter.get("/kaizen-executor", KillSwitchController.getKaizenExecutor);
killswitchRouter.get("/status", KillSwitchController.getStatus);
killswitchRouter.get("/last-triggered/:target", KillSwitchController.getLastTriggered);
 
killswitchRouter.get("/can-execute/:target/:selector", KillSwitchController.checkCanExecute);
killswitchRouter.get("/owner-of/:target", KillSwitchController.getOwnerOf);
 
killswitchRouter.post("/trigger", KillSwitchController.triggerKillSwitch);
killswitchRouter.post("/resume", KillSwitchController.resumeProtocol);
 
killswitchRouter.get("/events/triggered", KillSwitchController.getKillSwitchTriggeredEvents);
killswitchRouter.get("/events/resumed", KillSwitchController.getProtocolResumedEvents);

export default killswitchRouter;
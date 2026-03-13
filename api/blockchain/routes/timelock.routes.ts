import { Router } from "express";
import * as TimelockController from "../controllers/timelock.controller";

const timelockRouter = Router();

// ─── Config ───────────────────────────────────────────────────────────────────
timelockRouter.get("/config", TimelockController.getConfig);

// ─── Read ─────────────────────────────────────────────────────────────────────
timelockRouter.get("/status/:target",        TimelockController.getStatus);
timelockRouter.get("/is-locked/:target",     TimelockController.getIsLocked);
timelockRouter.get("/lock-duration/:target", TimelockController.getLockDuration);
timelockRouter.get("/locked-until/:target",  TimelockController.getLockedUntil);

// ─── Write ────────────────────────────────────────────────────────────────────
timelockRouter.post("/trigger",           TimelockController.triggerTimelock);
timelockRouter.post("/manual-unlock",     TimelockController.manualUnlock);
timelockRouter.post("/set-lock-duration", TimelockController.setLockDuration);

// ─── Authority ────────────────────────────────────────────────────────────────
timelockRouter.get("/authority/can-execute",   TimelockController.checkCanExecute);
timelockRouter.get("/authority/owner/:target", TimelockController.getOwner);

// ─── Events ───────────────────────────────────────────────────────────────────
timelockRouter.get("/events/triggered",        TimelockController.getTriggeredEvents);
timelockRouter.get("/events/unlocked",         TimelockController.getUnlockedEvents);
timelockRouter.get("/events/duration-updated", TimelockController.getDurationUpdatedEvents);

export default timelockRouter;
import express, { Request, Response, NextFunction } from "express";
import { ProfileController } from "../controllers/user/profile";
import { userAuthMiddleware } from "../middlewares/auth/user";

const profileRouter = express.Router();
const controller = new ProfileController();

profileRouter.get("/", userAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller.get(req, res);
    } catch (error) {
        next(error);
    }
});

profileRouter.post("/create", userAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
       await controller.create(req, res);
    } catch (error) {
        next(error);
    }
});

profileRouter.put("/edit", userAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await  controller.edit(req, res);
    } catch (error) {
        next(error);
    }
});

profileRouter.delete("/", userAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
       await controller.delete(req, res);
    } catch (error) {
        next(error);
    }
});

export default profileRouter;
import { Request, Response, NextFunction } from "express";
import { DelegatedAuthorityService } from "../services/delegated-authority-services";

export class DelegatedAuthorityController {
  constructor(private readonly service: DelegatedAuthorityService) {}

  // ─── Read ────────────────────────────────────────────────────────────────────

  getKaizenExecutor = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const executor = await this.service.getKaizenExecutor();
      res.json({ executor });
    } catch (err) {
      next(err);
    }
  };

  getOwnerOf = async (
    req: Request<{ target: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const owner = await this.service.getOwnerOf(req.params.target);
      res.json({ target: req.params.target, owner });
    } catch (err) {
      next(err);
    }
  };

  isDelegate = async (
    req: Request<{ target: string; user: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.service.isDelegate(
        req.params.target,
        req.params.user
      );
      res.json({ target: req.params.target, user: req.params.user, isDelegate: result });
    } catch (err) {
      next(err);
    }
  };

  isPermissionGranted = async (
    req: Request<{ target: string }, {}, {}, { selector: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { selector } = req.query;
      if (!selector) {
        res.status(400).json({ error: "selector query param is required" });
        return;
      }
      const result = await this.service.isPermissionGranted(
        req.params.target,
        selector
      );
      res.json({ target: req.params.target, selector, isPermissionGranted: result });
    } catch (err) {
      next(err);
    }
  };

  canExecute = async (
    req: Request<{ target: string }, {}, {}, { selector: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { selector } = req.query;
      if (!selector) {
        res.status(400).json({ error: "selector query param is required" });
        return;
      }
      const result = await this.service.canExecute(req.params.target, selector);
      res.json({ target: req.params.target, selector, canExecute: result });
    } catch (err) {
      next(err);
    }
  };

  // ─── Write ───────────────────────────────────────────────────────────────────

  registerTarget = async (
    req: Request<{}, {}, { target: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { target } = req.body;
      if (!target) {
        res.status(400).json({ error: "target is required" });
        return;
      }
      const tx = await this.service.registerTarget(target);
      const receipt = await tx.wait();
      res.status(201).json({ txHash: receipt?.hash, target });
    } catch (err) {
      next(err);
    }
  };

  deactivateTarget = async (
    req: Request<{ target: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tx = await this.service.deactivateTarget(req.params.target);
      const receipt = await tx.wait();
      res.json({ txHash: receipt?.hash, target: req.params.target });
    } catch (err) {
      next(err);
    }
  };

  addDelegate = async (
    req: Request<{ target: string }, {}, { delegate: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { delegate } = req.body;
      if (!delegate) {
        res.status(400).json({ error: "delegate is required" });
        return;
      }
      const tx = await this.service.addDelegate(req.params.target, delegate);
      const receipt = await tx.wait();
      res.status(201).json({ txHash: receipt?.hash, target: req.params.target, delegate });
    } catch (err) {
      next(err);
    }
  };

  removeDelegate = async (
    req: Request<{ target: string; delegate: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tx = await this.service.removeDelegate(
        req.params.target,
        req.params.delegate
      );
      const receipt = await tx.wait();
      res.json({
        txHash: receipt?.hash,
        target: req.params.target,
        delegate: req.params.delegate,
      });
    } catch (err) {
      next(err);
    }
  };

  grantPermission = async (
    req: Request<{ target: string }, {}, { selector: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { selector } = req.body;
      if (!selector) {
        res.status(400).json({ error: "selector is required" });
        return;
      }
      const tx = await this.service.grantPermission(req.params.target, selector);
      const receipt = await tx.wait();
      res.status(201).json({ txHash: receipt?.hash, target: req.params.target, selector });
    } catch (err) {
      next(err);
    }
  };

  revokePermission = async (
    req: Request<{ target: string }, {}, { selector: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { selector } = req.body;
      if (!selector) {
        res.status(400).json({ error: "selector is required" });
        return;
      }
      const tx = await this.service.revokePermission(req.params.target, selector);
      const receipt = await tx.wait();
      res.json({ txHash: receipt?.hash, target: req.params.target, selector });
    } catch (err) {
      next(err);
    }
  };
}
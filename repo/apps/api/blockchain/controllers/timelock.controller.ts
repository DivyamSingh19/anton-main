import { Request, Response } from "express";
import { ethers } from "ethers";
import { AntonTimeLock__factory } from "../ts"
import { DelegatedAuthority__factory } from "../ts";
import * as TimelockService from "../services/timelock.service";
import { encodeCallData } from "../services/timelock.service";


function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) throw new Error("RPC_URL not set in environment");
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getSigner(): ethers.Wallet {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("PRIVATE_KEY not set in environment");
  return new ethers.Wallet(privateKey, getProvider());
}

function getTimelockContract(withSigner = false): ReturnType<typeof AntonTimeLock__factory.connect> {
  const address = process.env.TIMELOCK_ADDRESS;
  if (!address) throw new Error("TIMELOCK_ADDRESS not set in environment");
  return AntonTimeLock__factory.connect(address, withSigner ? getSigner() : getProvider());
}

function getAuthorityContract(): ReturnType<typeof DelegatedAuthority__factory.connect> {
  const address = process.env.AUTHORITY_ADDRESS;
  if (!address) throw new Error("AUTHORITY_ADDRESS not set in environment");
  return DelegatedAuthority__factory.connect(address, getProvider());
}

function param(req: Request, key: string): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

function handleError(res: Response, err: unknown): void {
  const message = err instanceof Error ? err.message : "Unknown error";
  const isClientError =
    message.startsWith("Invalid address") ||
    message.includes("must be") ||
    message.includes("is required");
  res.status(isClientError ? 400 : 500).json({ success: false, error: message });
}

// ─── Config ───────────────────────────────────────────────────────────────────

export async function getConfig(_req: Request, res: Response): Promise<void> {
  try {
    const data = await TimelockService.getTimelockConfig(getTimelockContract());
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getStatus(req: Request, res: Response): Promise<void> {
  try {
    const data = await TimelockService.getTimelockStatus(
      getTimelockContract(),
      param(req, "target")
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getIsLocked(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const isLocked = await TimelockService.checkIsLocked(getTimelockContract(), target);
    res.json({ success: true, data: { target, isLocked } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getLockDuration(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const lockDuration = await TimelockService.getLockDuration(getTimelockContract(), target);
    res.json({ success: true, data: { target, lockDuration } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getLockedUntil(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const result = await TimelockService.getLockedUntil(getTimelockContract(), target);
    res.json({ success: true, data: { target, ...result } });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function triggerTimelock(req: Request, res: Response): Promise<void> {
  try {
    const { target, callData, functionSignature, args } = req.body;
    if (!target) { res.status(400).json({ success: false, error: "target is required" }); return; }

    let resolvedCallData: string;

    if (functionSignature) {
      try {
        resolvedCallData = encodeCallData(functionSignature, args ?? []);
      } catch (encErr) {
        const msg = encErr instanceof Error ? encErr.message : String(encErr);
        res.status(400).json({ success: false, error: `Failed to encode functionSignature: ${msg}` });
        return;
      }
    } else if (callData && callData !== "0x" && callData.length >= 10) {
      resolvedCallData = callData;
    } else {
      res.status(400).json({
        success: false,
        error: 'Provide functionSignature (e.g. "pause()") or a valid hex callData with a 4-byte selector.',
      });
      return;
    }

    const data = await TimelockService.triggerTimelock(
      getTimelockContract(true),
      target,
      resolvedCallData
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function manualUnlock(req: Request, res: Response): Promise<void> {
  try {
    const { target } = req.body;
    if (!target) { res.status(400).json({ success: false, error: "target is required" }); return; }

    const data = await TimelockService.manualUnlock(
      getTimelockContract(true),
      target
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function setLockDuration(req: Request, res: Response): Promise<void> {
  try {
    const { target, duration } = req.body;
    if (!target) { res.status(400).json({ success: false, error: "target is required" }); return; }
    if (duration === undefined || duration === null) { res.status(400).json({ success: false, error: "duration is required" }); return; }

    const data = await TimelockService.setLockDuration(
      getTimelockContract(true),
      target,
      duration.toString()
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Authority ────────────────────────────────────────────────────────────────

export async function checkCanExecute(req: Request, res: Response): Promise<void> {
  try {
    const { target, selector } = req.query as { target?: string; selector?: string };
    if (!target) { res.status(400).json({ success: false, error: "target query param is required" }); return; }
    if (!selector) { res.status(400).json({ success: false, error: "selector query param is required" }); return; }

    const canExecute = await TimelockService.canExecute(
      getAuthorityContract(),
      target,
      selector
    );
    res.json({ success: true, data: { target, selector, canExecute } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getOwner(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const owner = await TimelockService.getOwnerOf(getAuthorityContract(), target);
    res.json({ success: true, data: { target, owner } });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

function parseBlockRange(req: Request): {
  fromBlock: number | "earliest";
  toBlock: number | "latest";
} {
  return {
    fromBlock: req.query.fromBlock ? Number(req.query.fromBlock) : "earliest",
    toBlock: req.query.toBlock ? Number(req.query.toBlock) : "latest",
  };
}

export async function getTriggeredEvents(req: Request, res: Response): Promise<void> {
  try {
    const { fromBlock, toBlock } = parseBlockRange(req);
    const data = await TimelockService.getTimelockTriggeredEvents(
      getTimelockContract(),
      fromBlock,
      toBlock
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getUnlockedEvents(req: Request, res: Response): Promise<void> {
  try {
    const { fromBlock, toBlock } = parseBlockRange(req);
    const data = await TimelockService.getManualUnlockEvents(
      getTimelockContract(),
      fromBlock,
      toBlock
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getDurationUpdatedEvents(req: Request, res: Response): Promise<void> {
  try {
    const { fromBlock, toBlock } = parseBlockRange(req);
    const data = await TimelockService.getDurationUpdatedEvents(
      getTimelockContract(),
      fromBlock,
      toBlock
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}
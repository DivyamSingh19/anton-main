import { Request, Response } from "express";
import { ethers } from "ethers";
import { KillSwitch__factory } from "../ts";
import { DelegatedAuthority__factory } from "../ts";
import type { KillSwitch } from "../ts/KillSwitch/KillSwitch";
import type { IDelegatedAuthority } from "../ts/KillSwitch/IDelegatedAuthority";
import * as KillSwitchSvc from "../services/killswitch.service";

 
function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) throw new Error("Contract error: RPC_URL env var is not set");
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getSigner(): ethers.Wallet {
  const privateKey = process.env.SIGNER_PRIVATE_KEY;
  if (!privateKey) throw new Error("Contract error: SIGNER_PRIVATE_KEY env var is not set");
  return new ethers.Wallet(privateKey, getProvider());
}

function getKillSwitchContract(withSigner = false): KillSwitch {
  const address = process.env.KILL_SWITCH_ADDRESS;
  if (!address) throw new Error("Contract error: KILL_SWITCH_ADDRESS env var is not set");
  const runner = withSigner ? getSigner() : getProvider();
  return KillSwitch__factory.connect(address, runner);
}

function getAuthorityContract(): IDelegatedAuthority {
  const address = process.env.DELEGATED_AUTHORITY_ADDRESS;
  if (!address) throw new Error("Contract error: DELEGATED_AUTHORITY_ADDRESS env var is not set");
  return DelegatedAuthority__factory.connect(address, getProvider());
}

function param(req: Request, key: string): string {
  const value = req.params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function handleError(res: Response, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  if (message.startsWith("Validation error:")) {
    res.status(400).json({ success: false, error: message });
  } else {
    res.status(500).json({ success: false, error: message });
  }
}

// ─── View Controllers ─────────────────────────────────────────────────────────

export async function getCooldown(req: Request, res: Response): Promise<void> {
  try {
    const cooldown = await KillSwitchSvc.getCooldown(getKillSwitchContract());
    res.json({ success: true, data: { cooldown } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getAuthority(req: Request, res: Response): Promise<void> {
  try {
    const authority = await KillSwitchSvc.getAuthority(getKillSwitchContract());
    res.json({ success: true, data: { authority } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getKaizenExecutor(req: Request, res: Response): Promise<void> {
  try {
    const kaizenExecutor = await KillSwitchSvc.getKaizenExecutor(getKillSwitchContract());
    res.json({ success: true, data: { kaizenExecutor } });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getStatus(req: Request, res: Response): Promise<void> {
  try {
    const data = await KillSwitchSvc.getStatus(getKillSwitchContract());
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getLastTriggered(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const data = await KillSwitchSvc.getLastTriggered(getKillSwitchContract(), target);
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Authority View Controllers ───────────────────────────────────────────────

export async function checkCanExecute(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const selector = param(req, "selector");
    const data = await KillSwitchSvc.checkCanExecute(getAuthorityContract(), target, selector);
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getOwnerOf(req: Request, res: Response): Promise<void> {
  try {
    const target = param(req, "target");
    const data = await KillSwitchSvc.getOwnerOf(getAuthorityContract(), target);
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}
 
export async function triggerKillSwitch(req: Request, res: Response): Promise<void> {
  try {
    const { target, pauseCallData } = req.body as {
      target: string;
      pauseCallData: string;
    };
    const data = await KillSwitchSvc.triggerKillSwitch(
      getKillSwitchContract(true),
      target,
      pauseCallData
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function resumeProtocol(req: Request, res: Response): Promise<void> {
  try {
    const { target, resumeCallData } = req.body as {
      target: string;
      resumeCallData: string;
    };
    const data = await KillSwitchSvc.resumeProtocol(
      getKillSwitchContract(true),
      target,
      resumeCallData
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

// ─── Event Query Controllers ──────────────────────────────────────────────────

export async function getKillSwitchTriggeredEvents(req: Request, res: Response): Promise<void> {
  try {
    const fromBlock = req.query.fromBlock ? Number(req.query.fromBlock) : undefined;
    const toBlock = req.query.toBlock ? Number(req.query.toBlock) : undefined;
    const data = await KillSwitchSvc.getKillSwitchTriggeredEvents(
      getKillSwitchContract(),
      fromBlock,
      toBlock
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}

export async function getProtocolResumedEvents(req: Request, res: Response): Promise<void> {
  try {
    const fromBlock = req.query.fromBlock ? Number(req.query.fromBlock) : undefined;
    const toBlock = req.query.toBlock ? Number(req.query.toBlock) : undefined;
    const data = await KillSwitchSvc.getProtocolResumedEvents(
      getKillSwitchContract(),
      fromBlock,
      toBlock
    );
    res.json({ success: true, data });
  } catch (err) {
    handleError(res, err);
  }
}
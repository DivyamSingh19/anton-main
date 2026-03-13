import { ethers } from "ethers";
import { getTimelockContract, getAuthorityContract } from "../provider";

export async function getDefaultLockDuration(): Promise<string> {
  const contract = getTimelockContract();
  const duration = await contract.DEFAULT_LOCK_DURATION();
  return duration.toString();
}

export async function getMaxLockDuration(): Promise<string> {
  const contract = getTimelockContract();
  const duration = await contract.MAX_LOCK_DURATION();
  return duration.toString();
}

export async function getAuthority(): Promise<string> {
  const contract = getTimelockContract();
  return await contract.authority();
}

export async function getKaizenExecutor(): Promise<string> {
  const contract = getTimelockContract();
  return await contract.kaizenExecutor();
}

export async function isLocked(target: string): Promise<boolean> {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const contract = getTimelockContract();
  return await contract.isLocked(target);
}

export async function getLockDuration(target: string): Promise<string> {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const contract = getTimelockContract();
  const duration = await contract.lockDuration(target);
  return duration.toString();
}

export async function getLockedUntil(
  target: string
): Promise<{ timestamp: string; date: string }> {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const contract = getTimelockContract();
  const ts = await contract.lockedUntil(target);
  return {
    timestamp: ts.toString(),
    date: ts > 0n ? new Date(Number(ts) * 1000).toISOString() : "Not locked",
  };
}

export async function getFullTimelockStatus(target: string) {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const contract = getTimelockContract();

  const [locked, duration, until] = await Promise.all([
    contract.isLocked(target),
    contract.lockDuration(target),
    contract.lockedUntil(target),
  ]);

  return {
    target,
    isLocked: locked,
    lockDuration: duration.toString(),
    lockedUntil: {
      timestamp: until.toString(),
      date: until > 0n ? new Date(Number(until) * 1000).toISOString() : "Not locked",
    },
  };
}

// ─── Write Operations ─────────────────────────────────────────────────────────

export async function triggerTimelock(target: string, callData: string) {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  if (!ethers.isHexString(callData)) throw new Error("callData must be a hex string");

  const contract = getTimelockContract(true);
  const tx = await contract.triggerTimelock(target, callData);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status === 1 ? "success" : "failed",
  };
}

export async function manualUnlock(target: string) {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");

  const contract = getTimelockContract(true);
  const tx = await contract.manualUnlock(target);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status === 1 ? "success" : "failed",
  };
}

export async function setLockDuration(target: string, duration: string) {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const durationBig = BigInt(duration);
  if (durationBig < 0n) throw new Error("duration must be non-negative");

  const contract = getTimelockContract(true);
  const tx = await contract.setLockDuration(target, durationBig);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status === 1 ? "success" : "failed",
  };
}

// ─── Authority Operations ─────────────────────────────────────────────────────

export async function canExecute(target: string, selector: string): Promise<boolean> {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  if (!ethers.isHexString(selector)) throw new Error("selector must be a hex string");

  const contract = getAuthorityContract();
  return await contract.canExecute(target, selector);
}

export async function ownerOf(target: string): Promise<string> {
  if (!ethers.isAddress(target)) throw new Error("Invalid address: target");
  const contract = getAuthorityContract();
  return await contract.ownerOf(target);
}

// ─── Event Queries ────────────────────────────────────────────────────────────

export async function getTimelockTriggeredEvents(
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
) {
  const contract = getTimelockContract();
  const filter = contract.filters.TimelockTriggered();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e: any) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    executor: e.args.executor,
    unlockTime: e.args.unlockTime.toString(),
    unlockDate: new Date(Number(e.args.unlockTime) * 1000).toISOString(),
  }));
}

export async function getManualUnlockEvents(
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
) {
  const contract = getTimelockContract();
  const filter = contract.filters.ManualUnlock();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e: any) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    owner: e.args.owner,
  }));
}

export async function getDurationUpdatedEvents(
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
) {
  const contract = getTimelockContract();
  const filter = contract.filters.TimelockDurationUpdated();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e: any) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    duration: e.args.duration.toString(),
  }));
}
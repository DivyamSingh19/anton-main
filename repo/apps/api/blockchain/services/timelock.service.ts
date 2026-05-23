import { ethers } from "ethers";
import { AntonTimeLock } from "../ts/AntonTimlelock/AntonTimeLock";
import { IDelegatedAuthority } from "../ts/AntonTimlelock/IDelegatedAuthority";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TxReceipt {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  status: "success" | "failed";
}

export interface LockedUntilResult {
  timestamp: string;
  date: string;
}

export interface TimelockStatus {
  target: string;
  isLocked: boolean;
  lockDuration: string;
  lockedUntil: LockedUntilResult;
}

export interface TimelockConfig {
  defaultLockDuration: string;
  maxLockDuration: string;
  authority: string;
  kaizenExecutor: string;
}

export interface TimelockTriggeredEvent {
  txHash: string;
  blockNumber: number;
  target: string;
  executor: string;
  unlockTime: string;
  unlockDate: string;
}

export interface ManualUnlockEvent {
  txHash: string;
  blockNumber: number;
  target: string;
  owner: string;
}

export interface DurationUpdatedEvent {
  txHash: string;
  blockNumber: number;
  target: string;
  duration: string;
}

// ─── Guards ───────────────────────────────────────────────────────────────────

function assertAddress(value: string, name: string): void {
  if (!ethers.isAddress(value)) {
    throw new Error(`Invalid address: ${name}`);
  }
}

function assertHex(value: string, name: string): void {
  if (!ethers.isHexString(value)) {
    throw new Error(`${name} must be a hex string`);
  }
}

export function encodeCallData(
  functionSignature: string,
  args: unknown[] = []
): string {
  const iface = new ethers.Interface([`function ${functionSignature}`]);
  const fnName = functionSignature.split("(")[0];
  return iface.encodeFunctionData(fnName, args);
}

function parseTxReceipt(receipt: ethers.TransactionReceipt): TxReceipt {
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status === 1 ? "success" : "failed",
  };
}

function formatLockedUntil(ts: bigint): LockedUntilResult {
  return {
    timestamp: ts.toString(),
    date: ts > BigInt(0) ? new Date(Number(ts) * 1000).toISOString() : "Not locked",
  };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export async function getTimelockConfig(
  contract: AntonTimeLock
): Promise<TimelockConfig> {
  const [defaultLockDuration, maxLockDuration, authority, kaizenExecutor] =
    await Promise.all([
      contract.DEFAULT_LOCK_DURATION(),
      contract.MAX_LOCK_DURATION(),
      contract.authority(),
      contract.kaizenExecutor(),
    ]);

  return {
    defaultLockDuration: defaultLockDuration.toString(),
    maxLockDuration: maxLockDuration.toString(),
    authority,
    kaizenExecutor,
  };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getTimelockStatus(
  contract: AntonTimeLock,
  target: string
): Promise<TimelockStatus> {
  assertAddress(target, "target");

  const [locked, duration, until] = await Promise.all([
    contract.isLocked(target),
    contract.lockDuration(target),
    contract.lockedUntil(target),
  ]);

  return {
    target,
    isLocked: locked,
    lockDuration: duration.toString(),
    lockedUntil: formatLockedUntil(until),
  };
}

export async function checkIsLocked(
  contract: AntonTimeLock,
  target: string
): Promise<boolean> {
  assertAddress(target, "target");
  return contract.isLocked(target);
}

export async function getLockDuration(
  contract: AntonTimeLock,
  target: string
): Promise<string> {
  assertAddress(target, "target");
  const duration = await contract.lockDuration(target);
  return duration.toString();
}

export async function getLockedUntil(
  contract: AntonTimeLock,
  target: string
): Promise<LockedUntilResult> {
  assertAddress(target, "target");
  const ts = await contract.lockedUntil(target);
  return formatLockedUntil(ts);
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function triggerTimelock(
  contract: AntonTimeLock,
  target: string,
  callData: string
): Promise<TxReceipt> {
  assertAddress(target, "target");
  assertHex(callData, "callData");

  const tx = await contract.triggerTimelock(target, callData);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction failed: no receipt returned");
  return parseTxReceipt(receipt);
}

export async function manualUnlock(
  contract: AntonTimeLock,
  target: string
): Promise<TxReceipt> {
  assertAddress(target, "target");

  const tx = await contract.manualUnlock(target);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction failed: no receipt returned");
  return parseTxReceipt(receipt);
}

export async function setLockDuration(
  contract: AntonTimeLock,
  target: string,
  duration: string
): Promise<TxReceipt> {
  assertAddress(target, "target");
  const durationBig = BigInt(duration);
  if (durationBig < BigInt(0)) throw new Error("duration must be non-negative");

  const tx = await contract.setLockDuration(target, durationBig);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction failed: no receipt returned");
  return parseTxReceipt(receipt);
}

// ─── Authority ────────────────────────────────────────────────────────────────

export async function canExecute(
  authority: IDelegatedAuthority,
  target: string,
  selector: string
): Promise<boolean> {
  assertAddress(target, "target");
  assertHex(selector, "selector");
  return authority.canExecute(target, selector);
}

export async function getOwnerOf(
  authority: IDelegatedAuthority,
  target: string
): Promise<string> {
  assertAddress(target, "target");
  return authority.ownerOf(target);
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getTimelockTriggeredEvents(
  contract: AntonTimeLock,
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
): Promise<TimelockTriggeredEvent[]> {
  const filter = contract.filters.TimelockTriggered();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    executor: e.args.executor,
    unlockTime: e.args.unlockTime.toString(),
    unlockDate: new Date(Number(e.args.unlockTime) * 1000).toISOString(),
  }));
}

export async function getManualUnlockEvents(
  contract: AntonTimeLock,
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
): Promise<ManualUnlockEvent[]> {
  const filter = contract.filters.ManualUnlock();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    owner: e.args.owner,
  }));
}

export async function getDurationUpdatedEvents(
  contract: AntonTimeLock,
  fromBlock: number | "earliest" = "earliest",
  toBlock: number | "latest" = "latest"
): Promise<DurationUpdatedEvent[]> {
  const filter = contract.filters.TimelockDurationUpdated();
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((e) => ({
    txHash: e.transactionHash,
    blockNumber: e.blockNumber,
    target: e.args.target,
    duration: e.args.duration.toString(),
  }));
}
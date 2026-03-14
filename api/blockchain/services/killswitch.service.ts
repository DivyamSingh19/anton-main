import { ethers } from "ethers";
import type { KillSwitch } from "../ts/KillSwitch/KillSwitch";
import type { IDelegatedAuthority } from "../ts/KillSwitch/IDelegatedAuthority";

// ─── Typed Interfaces ────────────────────────────────────────────────────────

export interface TxReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: number;
}

export interface KillSwitchStatus {
  cooldown: string;
  authority: string;
  kaizenExecutor: string;
}

export interface LastTriggeredResult {
  target: string;
  lastTriggered: string;
  lastTriggeredDate: string | null;
}

export interface CanExecuteResult {
  target: string;
  selector: string;
  canExecute: boolean;
}

export interface OwnerOfResult {
  target: string;
  owner: string;
}

export interface KillSwitchTriggeredEvent {
  target: string;
  executor: string;
  selector: string;
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
}

export interface ProtocolResumedEvent {
  target: string;
  owner: string;
  blockNumber: number;
  transactionHash: string;
}

// ─── Guards ──────────────────────────────────────────────────────────────────

function assertAddress(value: string, name: string): void {
  if (!ethers.isAddress(value)) {
    throw new Error(`Validation error: "${name}" is not a valid address — got: ${value}`);
  }
}

function assertHex(value: string, name: string): void {
  if (!ethers.isHexString(value)) {
    throw new Error(`Validation error: "${name}" is not a valid hex string — got: ${value}`);
  }
}

// ─── Private Helpers ─────────────────────────────────────────────────────────

function parseTxReceipt(receipt: ethers.TransactionReceipt): TxReceipt {
  return {
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status ?? 0,
  };
}

function formatTimestamp(ts: bigint): string {
  return ts.toString();
}

function formatTimestampAsDate(ts: bigint): string | null {
  const num = Number(ts);
  if (num === 0) return null;
  return new Date(num * 1000).toISOString();
}

// ─── View Functions ───────────────────────────────────────────────────────────

export async function getCooldown(contract: KillSwitch): Promise<string> {
  const cooldown = await contract.COOLDOWN();
  return cooldown.toString();
}

export async function getAuthority(contract: KillSwitch): Promise<string> {
  return contract.authority();
}

export async function getKaizenExecutor(contract: KillSwitch): Promise<string> {
  return contract.kaizenExecutor();
}

export async function getStatus(contract: KillSwitch): Promise<KillSwitchStatus> {
  const [cooldown, authority, kaizenExecutor] = await Promise.all([
    contract.COOLDOWN(),
    contract.authority(),
    contract.kaizenExecutor(),
  ]);
  return {
    cooldown: cooldown.toString(),
    authority,
    kaizenExecutor,
  };
}

export async function getLastTriggered(
  contract: KillSwitch,
  target: string
): Promise<LastTriggeredResult> {
  assertAddress(target, "target");
  const lastTriggered = await contract.lastTriggered(target);
  return {
    target,
    lastTriggered: formatTimestamp(lastTriggered),
    lastTriggeredDate: formatTimestampAsDate(lastTriggered),
  };
}

// ─── Authority View Functions ─────────────────────────────────────────────────

export async function checkCanExecute(
  authorityContract: IDelegatedAuthority,
  target: string,
  selector: string
): Promise<CanExecuteResult> {
  assertAddress(target, "target");
  assertHex(selector, "selector");
  const canExecute = await authorityContract.canExecute(target, selector);
  return { target, selector, canExecute };
}

export async function getOwnerOf(
  authorityContract: IDelegatedAuthority,
  target: string
): Promise<OwnerOfResult> {
  assertAddress(target, "target");
  const owner = await authorityContract.ownerOf(target);
  return { target, owner };
}

// ─── Write Functions ──────────────────────────────────────────────────────────

export async function triggerKillSwitch(
  contract: KillSwitch,
  target: string,
  pauseCallData: string
): Promise<TxReceipt> {
  assertAddress(target, "target");
  assertHex(pauseCallData, "pauseCallData");
  const tx = await contract.triggerKillSwitch(target, pauseCallData);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Contract error: transaction receipt is null");
  return parseTxReceipt(receipt);
}

export async function resumeProtocol(
  contract: KillSwitch,
  target: string,
  resumeCallData: string
): Promise<TxReceipt> {
  assertAddress(target, "target");
  assertHex(resumeCallData, "resumeCallData");
  const tx = await contract.resumeProtocol(target, resumeCallData);
  const receipt = await tx.wait();
  if (!receipt) throw new Error("Contract error: transaction receipt is null");
  return parseTxReceipt(receipt);
}

// ─── Event Queries ────────────────────────────────────────────────────────────

export async function getKillSwitchTriggeredEvents(
  contract: KillSwitch,
  fromBlock?: number,
  toBlock?: number
): Promise<KillSwitchTriggeredEvent[]> {
  const filter = contract.filters.KillSwitchTriggered();
  const logs = await contract.queryFilter(filter, fromBlock, toBlock);
  return logs.map((log) => ({
    target: log.args.target,
    executor: log.args.executor,
    selector: log.args.selector,
    timestamp: log.args.timestamp.toString(),
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
  }));
}

export async function getProtocolResumedEvents(
  contract: KillSwitch,
  fromBlock?: number,
  toBlock?: number
): Promise<ProtocolResumedEvent[]> {
  const filter = contract.filters.ProtocolResumed();
  const logs = await contract.queryFilter(filter, fromBlock, toBlock);
  return logs.map((log) => ({
    target: log.args.target,
    owner: log.args.owner,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
  }));
}
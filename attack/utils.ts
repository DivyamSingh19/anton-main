 

import { ethers, Contract, Wallet, JsonRpcProvider } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();


export const LENDING_ABI = [
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function borrow(uint256 amount)",
  "function repay() payable",
  "function depositCollateral() payable",
  "function acquireVotingPower(uint256 amount)",
  "function delegate(address to)",
  "function propose(address target, bytes calldata) returns (uint256)",
  "function executeProposal(uint256 proposalId)",
  "function setAdmin(address newAdmin)",
  "function emergencyWithdraw(address to, uint256 amount)",
  "function pause(string reason)",
  "function unpause()",
  "function updateKaizenGuardian(address)",
  "function totalLiquidity() view returns (uint256)",
  "function shares(address) view returns (uint256)",
  "function getShareValue(address) view returns (uint256)",
  "function isPaused() view returns (bool)",
  "function admin() view returns (address)",
  "function borrowed(address) view returns (uint256)",
  "function collateral(address) view returns (uint256)",
  "function votingPower(address) view returns (uint256)",
  "function proposals(uint256) view returns (address target, bytes callData, uint256 votes, bool executed, uint256 createdAt)",
  "event Paused(address indexed by, string reason)",
  "event KaizenPauseTriggered(address indexed guardian, uint256 blockNumber, bytes32 threatId)",
  "event EmergencyWithdrawal(address indexed by, address indexed to, uint256 amount)",
  "event Deposit(address indexed user, uint256 amount, uint256 sharesMinted)",
  "event Withdraw(address indexed user, uint256 amount, uint256 sharesBurned)",
  "event Borrow(address indexed user, uint256 amount, uint256 collateral)",
];

export const REENTRANCY_ABI = [
  "function seedPosition() payable",
  "function attack(uint256 depth)",
  "function drain()",
  "function getBalance() view returns (uint256)",
  "function attackDepth() view returns (uint256)",
  "function totalDrained() view returns (uint256)",
  "event AttackStarted(uint256 initialBalance, uint256 targetBalance)",
  "event ReentrantCall(uint256 depth, uint256 contractBalance)",
  "event AttackComplete(uint256 totalDrained, uint256 depth)",
];

export const FLASH_LOAN_ABI = [
  "function attack(uint256 priceMultiplier)",
  "function drain()",
  "function getProfit() view returns (uint256)",
  "event FlashLoanReceived(uint256 amount)",
  "event OracleManipulated(uint256 priceBefore, uint256 priceAfter, uint256 multiplier)",
  "event BorrowExecuted(uint256 amount, uint256 collateralValue)",
  "event AttackComplete(uint256 profit)",
];

export const GOVERNANCE_ABI = [
  "function attack() payable",
  "function drain()",
  "function acquiredVotingPower() view returns (uint256)",
  "function proposalId() view returns (uint256)",
  "event VotingPowerAcquired(uint256 amount, uint256 totalSupply)",
  "event MaliciousProposalCreated(uint256 proposalId, address drainTarget, uint256 drainAmount)",
  "event ProposalExecuted(uint256 proposalId, uint256 amountDrained)",
  "event AttackComplete(uint256 stolen)",
];

export const PRIV_ESC_ABI = [
  "function seizeAdmin()",
  "function drain()",
  "function atomicAttack()",
  "function adminSeized() view returns (bool)",
  "event AdminSeized(address indexed from, address indexed to)",
  "event TreasuryDrained(address indexed to, uint256 amount)",
  "event AttackComplete(uint256 stolen)",
];

export const ORACLE_ABI = [
  "function getPrice(address asset) view returns (uint256)",
  "function updatePrice(address asset, uint256 price)",
  "function transferOwnership(address newOwner)",
  "function owner() view returns (address)",
  "function lastPrice() view returns (uint256)",
  "function lastUpdateBlock() view returns (uint256)",
];


export function getProvider(): JsonRpcProvider {
  return new JsonRpcProvider(process.env.SEPOLIA_RPC_URL!);
}

export function getDeployerWallet(): Wallet {
  return new Wallet(process.env.DEPLOYER_PRIVATE_KEY!, getProvider());
}

export function getAttackerWallet(): Wallet {
  return new Wallet(process.env.ATTACKER_PRIVATE_KEY!, getProvider());
}

export function getKaizenWallet(): Wallet {
  return new Wallet(process.env.KAIZEN_HOT_WALLET_KEY!, getProvider());
}

export function getLendingPool(signer: Wallet): Contract {
  return new Contract(process.env.KAIZEN_LEND_ADDRESS!, LENDING_ABI, signer);
}


export const C = {
  red:    (s: string) => `\x1b[31m${s}\x1b[0m`,
  green:  (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s: string) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s: string) => `\x1b[2m${s}\x1b[0m`,
};

export function banner(title: string, char = "━") {
  const line = char.repeat(62);
  console.log(`\n${C.cyan(line)}`);
  console.log(C.bold(`  ${title}`));
  console.log(`${C.cyan(line)}\n`);
}

export function step(n: number, msg: string) {
  console.log(`${C.yellow(`[${n}]`)} ${msg}`);
}

export function success(msg: string) {
  console.log(`${C.green("✓")} ${msg}`);
}

export function warn(msg: string) {
  console.log(`${C.red("⚠")} ${msg}`);
}

export function etherscan(txHash: string) {
  return `${C.dim(`https://sepolia.etherscan.io/tx/${txHash}`)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export async function waitAndLog(
  tx: ethers.TransactionResponse,
  label: string
): Promise<ethers.TransactionReceipt> {
  process.stdout.write(`  ${C.dim("waiting...")} `);
  const receipt = await tx.wait();
  process.stdout.write(`\r`);
  success(`${label}: block ${receipt!.blockNumber} | ${etherscan(tx.hash)}`);
  return receipt!;
}

export function eth(wei: bigint): string {
  return `${parseFloat(ethers.formatEther(wei)).toFixed(4)} ETH`;
}

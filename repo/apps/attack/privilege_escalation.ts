/**
 * KAIZEN DEMO — Attack 4: Privilege Escalation / Admin Key Compromise
 *
 * Mirrors: Ronin Bridge ($625M, March 2022), Harmony Horizon ($100M, June 2022)
 * Expected Kaizen response: AUTONOMOUS_KILL_SWITCH (score ~94–97)
 *
 * This is the most dramatic demo:
 *   → A wallet that has NEVER interacted with the protocol calls setAdmin()
 *   → Transfers admin rights to the attacker
 *   → Immediately drains 99% of TVL via emergencyWithdraw()
 *
 * What Kaizen detects in one block:
 *   → admin_function_called = true
 *   → new_admin_address = true (this address has zero prior tx history)
 *   → total_eth_outflow = 99% of TVL
 *   → outflow_vs_7d_avg = 200x+ normal
 *   → transfer_count = 1–2 (clean professional drain)
 *
 * Severity: 96/100 — highest single-signal severity in the rule engine
 * The kill switch fires in the SAME BLOCK.
 *
 * Run: npx ts-node scripts/attacks/04_privilege_escalation.ts
 */

import { ethers, Contract, Wallet } from "ethers";
import {
  banner, step, success, warn, etherscan, sleep, waitAndLog, eth,
  getDeployerWallet, getAttackerWallet, C,
  PRIV_ESC_ABI, LENDING_ABI,
} from "./utils";

async function main() {
  banner("ATTACK 4: PRIVILEGE ESCALATION  (Ronin Bridge / Harmony pattern)");

  const deployer = getDeployerWallet();
  const attacker = getAttackerWallet();
  const provider = attacker.provider!;

  const protocolAsDeployer = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    deployer
  );
  const protocolAsAttacker = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    attacker
  );
  const attackContract = new Contract(
    process.env.PRIV_ESC_ATTACKER_ADDRESS!,
    PRIV_ESC_ABI,
    attacker
  );

  // ── Pre-attack state ──────────────────────────────────────────────────────
  const tvlBefore   = await protocolAsAttacker.totalLiquidity() as bigint;
  const currentAdmin = await protocolAsAttacker.admin() as string;

  console.log(`${C.dim("Protocol TVL:")}        ${eth(tvlBefore)}`);
  console.log(`${C.dim("Current admin:")}       ${currentAdmin}`);
  console.log(`${C.dim("Attacker address:")}    ${attacker.address}`);
  console.log(`${C.dim("Attack contract:")}     ${process.env.PRIV_ESC_ATTACKER_ADDRESS!}`);
  console.log();

  // Verify the attack address has never interacted
  const attackerTxCount = await provider.getTransactionCount(
    process.env.PRIV_ESC_ATTACKER_ADDRESS!
  );
  console.log(`${C.dim("Attack contract tx history:")} ${attackerTxCount} prior transactions`);
  if (attackerTxCount <= 1) {
    console.log(C.red(`  → This address is essentially fresh. Kaizen's new_admin_address rule fires.`));
  }
  console.log();

  // ── Step 1: Transfer admin to attacker contract ───────────────────────────
  // In a real attack: the legitimate admin's private key is compromised
  // Here: deployer voluntarily sets admin to attack contract (simulating compromise)
  step(1, "Simulating compromised admin key...");
  step(1, C.dim("(deployer sets admin to attack contract — mirrors Ronin validator key leak)"));

  const setAdminTx = await protocolAsDeployer.setAdmin(
    process.env.PRIV_ESC_ATTACKER_ADDRESS!
  );
  await waitAndLog(setAdminTx, "Admin transferred to attack contract");

  const newAdmin = await protocolAsAttacker.admin() as string;
  console.log(`  ${C.red("→")} New admin: ${newAdmin}`);
  console.log();

  // ── Step 2: Drain — this is the block Kaizen sees ─────────────────────────
  step(2, C.red("New admin address calls emergencyWithdraw()..."));
  step(2, C.dim("This is what Kaizen detects: admin_function_called=true, new_admin_address=true"));
  step(2, C.dim("Combined with outflow spike → score 96 → AUTONOMOUS_KILL_SWITCH"));
  console.log();

  // Event listeners
  attackContract.on("AdminSeized", (from: string, to: string) => {
    console.log(`  ${C.red("⚡")} Admin seized: ${from} → ${to}`);
  });
  attackContract.on("TreasuryDrained", (to: string, amount: bigint) => {
    console.log(`  ${C.red("⚡")} Treasury drained: ${eth(amount)} → ${to}`);
  });
  attackContract.on("AttackComplete", (stolen: bigint) => {
    console.log();
    success(C.bold(`Admin compromise complete — stolen: ${eth(stolen)}`));
  });

  const drainTx = await attackContract.drain({
    gasLimit: 300_000,
  });
  const receipt = await waitAndLog(drainTx, "Drain transaction confirmed");
  console.log();

  // ── Check Kaizen response ─────────────────────────────────────────────────
  await sleep(3000);

  const tvlAfter = await protocolAsAttacker.totalLiquidity() as bigint;
  const isPaused = await protocolAsAttacker.isPaused() as boolean;

  step(3, "Post-attack state:");
  console.log(`  ${C.dim("TVL before:")}    ${eth(tvlBefore)}`);
  console.log(`  ${C.dim("TVL after:")}     ${eth(tvlAfter)}`);
  console.log(`  ${C.dim("Drained:")}       ${eth(tvlBefore - tvlAfter)}`);
  console.log();

  if (isPaused) {
    success(C.bold("🛡  KAIZEN KILL SWITCH FIRED — Protocol paused"));
    console.log(C.dim("  Remaining funds protected. Attacker's further actions blocked."));
  } else {
    warn("Kaizen response pending — check dashboard for threat event");
  }

  console.log(C.dim(`\n  Drain tx: ${etherscan(drainTx.hash)}`));
  console.log(C.dim(`  Block:    ${receipt.blockNumber}`));

  attackContract.removeAllListeners();
}

main().catch(e => {
  console.error(C.red("Attack failed:"), e.message);
  process.exit(1);
});

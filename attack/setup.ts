 
import { ethers, Contract, Wallet } from "ethers";
import {
  banner, step, success, eth, etherscan, waitAndLog, sleep,
  getDeployerWallet, getAttackerWallet, getKaizenWallet, C,
  LENDING_ABI,
} from "./utils";

const SEED_DEPOSITS = 8;
const DEPOSIT_AMOUNT = ethers.parseEther("0.03");

async function main() {
  banner("KAIZEN DEMO SETUP", "═");

  const deployer = getDeployerWallet();
  const attacker = getAttackerWallet();
  const kaizen   = getKaizenWallet();
  const provider = deployer.provider!;

  const protocol = new Contract(
    process.env.KAIZEN_LEND_ADDRESS!,
    LENDING_ABI,
    deployer
  );

  step(0, "Verifying environment...");
  const [deployerBal, attackerBal, kaizenBal, tvl, isPaused] = await Promise.all([
    provider.getBalance(deployer.address),
    provider.getBalance(attacker.address),
    provider.getBalance(kaizen.address),
    protocol.totalLiquidity(),
    protocol.isPaused(),
  ]);

  console.log(`  ${C.dim("Deployer:      ")} ${deployer.address} (${eth(deployerBal as bigint)})`);
  console.log(`  ${C.dim("Attacker:      ")} ${attacker.address} (${eth(attackerBal as bigint)})`);
  console.log(`  ${C.dim("Kaizen wallet: ")} ${kaizen.address}   (${eth(kaizenBal as bigint)})`);
  console.log(`  ${C.dim("Protocol TVL:  ")} ${eth(tvl as bigint)}`);
  console.log(`  ${C.dim("Protocol:      ")} ${isPaused ? C.red("PAUSED") : C.green("LIVE")}`);
  console.log();

  if (deployerBal < ethers.parseEther("0.3")) {
    console.log(C.red("  ⚠ Deployer needs at least 0.3 ETH on Sepolia"));
    process.exit(1);
  }

  if (isPaused) {
    step(1, C.yellow("Protocol is paused from previous demo — unpausing..."));
    const unpauseTx = await protocol.unpause();
    await waitAndLog(unpauseTx, "Protocol unpaused");
    console.log();
  }

  step(2, `Seeding ${SEED_DEPOSITS} normal deposits to build activity baseline...`);
  console.log(C.dim("  (This simulates normal protocol usage — makes attack anomaly visible)"));
  console.log();

  for (let i = 0; i < SEED_DEPOSITS; i++) {
    const tx = await protocol.deposit({ value: DEPOSIT_AMOUNT });
    await waitAndLog(tx, `Deposit ${i + 1}/${SEED_DEPOSITS} (${eth(DEPOSIT_AMOUNT)})`);
    if (i < SEED_DEPOSITS - 1) await sleep(5000);
  }

  console.log();

  const finalTvl = await protocol.totalLiquidity() as bigint;

  step(3, "Setup complete:");
  console.log(`  ${C.dim("Protocol TVL:")}    ${eth(finalTvl)}`);
  console.log(`  ${C.dim("Status:")}          ${C.green("LIVE — ready for demo")}`);
  console.log();

  success(C.bold("Ready. Run attack scripts in order:"));
  console.log(`  npx ts-node scripts/attacks/01_reentrancy.ts`);
  console.log(`  npx ts-node scripts/attacks/02_flash_loan_oracle.ts`);
  console.log(`  npx ts-node scripts/attacks/03_governance.ts`);
  console.log(`  npx ts-node scripts/attacks/04_privilege_escalation.ts`);
  console.log();
  console.log(C.dim("  Or run the full demo sequence:"));
  console.log(`  npx ts-node scripts/attacks/demo.ts`);
}

main().catch(e => {
  console.error(C.red("Setup failed:"), e.message);
  process.exit(1);
});

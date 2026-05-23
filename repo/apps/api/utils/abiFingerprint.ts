export interface AbiItem {
  type: string;
  name?: string;
  stateMutability?: string;
  inputs?: any[];
  outputs?: any[];
}

export function generateFingerprint(abi: AbiItem[]) {
  const payableFunctions: string[] = [];
  const adminFunctions: string[] = [];
  const valueFunctions: string[] = [];
  const governanceFunctions: string[] = [];
  const allFunctions: string[] = [];

  const highRiskEvents: string[] = [];
  const flowEvents: string[] = [];
  const governanceEvents: string[] = [];
  const allEvents: string[] = [];

  const adminKeywords = ["admin", "owner", "emergency", "pause", "unpause", "oracle", "set"];
  const valueKeywords = ["flashloan", "withdraw", "deposit", "borrow", "repay", "transfer", "mint", "burn"];
  const govKeywords = ["propose", "execute", "vote", "delegate", "acquire"];

  for (const item of abi) {
    if (item.type === "function" && item.name) {
      allFunctions.push(item.name);

      if (item.stateMutability === "payable") {
        payableFunctions.push(item.name);
      }

      const nameLower = item.name.toLowerCase();

      if (adminKeywords.some(kw => nameLower.includes(kw))) {
        adminFunctions.push(item.name);
      }
      if (valueKeywords.some(kw => nameLower.includes(kw))) {
        valueFunctions.push(item.name);
      }
      if (govKeywords.some(kw => nameLower.includes(kw))) {
        governanceFunctions.push(item.name);
      }
    } else if (item.type === "event" && item.name) {
      allEvents.push(item.name);
      const nameLower = item.name.toLowerCase();

      if (adminKeywords.some(kw => nameLower.includes(kw)) || nameLower.includes("emergency") || nameLower.includes("pause") || nameLower.includes("changed")) {
        highRiskEvents.push(item.name);
      }
      if (valueKeywords.some(kw => nameLower.includes(kw)) || nameLower.includes("loan")) {
        flowEvents.push(item.name);
      }
      if (govKeywords.some(kw => nameLower.includes(kw)) || nameLower.includes("proposal")) {
        governanceEvents.push(item.name);
      }
    }
  }

  const signals = {
    hasFlashLoan: allFunctions.some(f => f.toLowerCase().includes("flashloan")),
    hasAdminChange: adminFunctions.some(f => f.toLowerCase().includes("admin") || f.toLowerCase().includes("owner")),
    hasGovernance: governanceFunctions.length > 0,
    hasEmergencyWithdraw: adminFunctions.some(f => f.toLowerCase().includes("emergency")),
    isPayable: payableFunctions.length > 0,
  };

  return {
    payableFunctions,
    adminFunctions,
    valueFunctions,
    governanceFunctions,
    allFunctions,
    events: {
      high_risk: highRiskEvents,
      flow: flowEvents,
      governance: governanceEvents,
      all: allEvents
    },
    signals
  };
}

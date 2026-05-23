import { ethers } from "ethers";

type ContractCheckResult = {
  valid: boolean;
  isContract: boolean;
  reason?: string;
};

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export async function checkContractAddress(
  address: string
): Promise<ContractCheckResult> {
  try {
    
    if (!ethers.isAddress(address)) {
      return {
        valid: false,
        isContract: false,
        reason: "Invalid Ethereum address format",
      };
    }
 
    const code = await provider.getCode(address);

    
    if (code === "0x") {
      return {
        valid: true,
        isContract: false,
        reason: "No contract deployed at this address",
      };
    }

    return {
      valid: true,
      isContract: true,
    };
  } catch (error: any) {
    return {
      valid: false,
      isContract: false,
      reason: error.message,
    };
  }
}
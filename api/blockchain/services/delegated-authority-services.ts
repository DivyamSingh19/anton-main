import { ethers, BytesLike, InterfaceAbi } from "ethers";
import { DelegatedAuthority } from "../ts/DelegatedAuthority";
import DelegatedAuthorityABI from "../abi/DelegatedAuthority/DelegatedAuthority.json";
 
const CONTRACT_INTERFACE = new ethers.Interface(
  DelegatedAuthorityABI as unknown as InterfaceAbi
);

export class DelegatedAuthorityService {
  private contract: DelegatedAuthority;

  constructor(
    contractAddress: string,
    signerOrProvider: ethers.Signer | ethers.Provider
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      CONTRACT_INTERFACE,
      signerOrProvider
    ) as unknown as DelegatedAuthority;
  }

  // ─── Read Methods ────────────────────────────────────────────────────────────

  async getKaizenExecutor(): Promise<string> {
    return this.contract.kaizenExecutor();
  }

  async getOwnerOf(target: string): Promise<string> {
    return this.contract.ownerOf(target);
  }

  async isDelegate(target: string, user: string): Promise<boolean> {
    return this.contract.isDelegate(target, user);
  }

  async isDelegateRaw(target: string, delegate: string): Promise<boolean> {
    return this.contract.delegates(target, delegate);
  }

  async isPermissionGranted(target: string, selector: BytesLike): Promise<boolean> {
    return this.contract.isPermissionGranted(target, selector);
  }

  async canExecute(target: string, selector: BytesLike): Promise<boolean> {
    return this.contract.canExecute(target, selector);
  }

  // ─── Write Methods ───────────────────────────────────────────────────────────

  async registerTarget(target: string): Promise<ethers.ContractTransactionResponse> {
    return this.contract.registerTarget(target);
  }

  async deactivateTarget(target: string): Promise<ethers.ContractTransactionResponse> {
    return this.contract.deactivateTarget(target);
  }

  async addDelegate(
    target: string,
    delegate: string
  ): Promise<ethers.ContractTransactionResponse> {
    return this.contract.addDelegate(target, delegate);
  }

  async removeDelegate(
    target: string,
    delegate: string
  ): Promise<ethers.ContractTransactionResponse> {
    return this.contract.removeDelegate(target, delegate);
  }

  async grantPermission(
    target: string,
    selector: BytesLike
  ): Promise<ethers.ContractTransactionResponse> {
    return this.contract.grantPermission(target, selector);
  }

  async revokePermission(
    target: string,
    selector: BytesLike
  ): Promise<ethers.ContractTransactionResponse> {
    return this.contract.revokePermission(target, selector);
  }

  // ─── Event Listeners ─────────────────────────────────────────────────────────

  onTargetRegistered(
    callback: (target: string, owner: string) => void
  ): void {
    this.contract.on(this.contract.filters.TargetRegistered(), (target, owner) => {
      callback(target, owner);
    });
  }

  onTargetDeactivated(callback: (target: string) => void): void {
    this.contract.on(this.contract.filters.TargetDeactivated(), (target) => {
      callback(target);
    });
  }

  onDelegateAdded(
    callback: (target: string, delegate: string) => void
  ): void {
    this.contract.on(this.contract.filters.DelegateAdded(), (target, delegate) => {
      callback(target, delegate);
    });
  }

  onDelegateRemoved(
    callback: (target: string, delegate: string) => void
  ): void {
    this.contract.on(this.contract.filters.DelegateRemoved(), (target, delegate) => {
      callback(target, delegate);
    });
  }

  onPermissionGranted(
    callback: (target: string, selector: string) => void
  ): void {
    this.contract.on(this.contract.filters.PermissionGranted(), (target, selector) => {
      callback(target, selector);
    });
  }

  onPermissionRevoked(
    callback: (target: string, selector: string) => void
  ): void {
    this.contract.on(this.contract.filters.PermissionRevoked(), (target, selector) => {
      callback(target, selector);
    });
  }

  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }
}
import { Router } from "express";
import { ethers } from "ethers";
import { DelegatedAuthorityService } from "../services/delegated-authority-services";
import { DelegatedAuthorityController } from "../controllers/delegated-authority.controller";
 
export function delegatedAuthorityRouter(
  signerOrProvider: ethers.Signer | ethers.Provider,
  contractAddress: string
): Router {
  const router = Router();
  const service = new DelegatedAuthorityService(contractAddress, signerOrProvider);
  const controller = new DelegatedAuthorityController(service);

  // ─── Read Routes ─────────────────────────────────────────────────────────────

  /**
   * GET /kaizen-executor
   * Returns the address of the kaizenExecutor.
   */
  router.get("/kaizen-executor", controller.getKaizenExecutor);

  /**
   * GET /targets/:target/owner
   * Returns the owner of a registered target.
   */
  router.get("/targets/:target/owner", controller.getOwnerOf);

  /**
   * GET /targets/:target/delegates/:user
   * Returns whether `user` is a delegate for `target`.
   */
  router.get("/targets/:target/delegates/:user", controller.isDelegate);

  /**
   * GET /targets/:target/permissions?selector=0xabcd1234
   * Returns whether the given 4-byte selector is permitted on `target`.
   */
  router.get("/targets/:target/permissions", controller.isPermissionGranted);

  /**
   * GET /targets/:target/can-execute?selector=0xabcd1234
   * Full execution check — verifies both active status and permission.
   */
  router.get("/targets/:target/can-execute", controller.canExecute);

  // ─── Write Routes ─────────────────────────────────────────────────────────────

  /**
   * POST /targets
   * Body: { target: string }
   * Registers a new target contract. Caller becomes the owner.
   */
  router.post("/targets", controller.registerTarget);

  /**
   * DELETE /targets/:target
   * Deactivates a registered target.
   */
  router.delete("/targets/:target", controller.deactivateTarget);

  /**
   * POST /targets/:target/delegates
   * Body: { delegate: string }
   * Adds a delegate for the given target.
   */
  router.post("/targets/:target/delegates", controller.addDelegate);

  /**
   * DELETE /targets/:target/delegates/:delegate
   * Removes a specific delegate from the given target.
   */
  router.delete("/targets/:target/delegates/:delegate", controller.removeDelegate);

  /**
   * POST /targets/:target/permissions
   * Body: { selector: string }  (4-byte hex selector, e.g. "0xabcd1234")
   * Grants permission for a function selector on the given target.
   */
  router.post("/targets/:target/permissions", controller.grantPermission);

  /**
   * DELETE /targets/:target/permissions
   * Body: { selector: string }
   * Revokes permission for a function selector on the given target.
   */
  router.delete("/targets/:target/permissions", controller.revokePermission);

  return router;
}
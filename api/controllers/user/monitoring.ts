import prisma from "../../db/db";
import { Request, Response } from "express";
import { InfluxDB } from "@influxdata/influxdb-client";
import { HTTPStatus } from "../../utils/httpstatus";
import { generateFingerprint, AbiItem } from "../../utils/abiFingerprint";
import { pushNewContract,pushPauseContract } from "../../kafka/config";

export class MonitoringController {
  start = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized",
        });
      }

      const { projectId } = req.body;
      if (!projectId) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Project ID is required",
        });
      }

      const project = await prisma.userProjects.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(HTTPStatus.Notfound).json({
          success: false,
          message: "Project not found",
        });
      }

      if (project.userId !== userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "You are not authorized to monitor this project",
        });
      }

      // ── ABI extraction ──────────────────────────────────────────────
      let abiJson: AbiItem[] = [];
      const raw = project.abi as any;
      console.log("ABI TYPE:", typeof raw);
      console.log("IS ARRAY:", Array.isArray(raw));
      console.log(
        "KEYS:",
        raw && typeof raw === "object" ? Object.keys(raw) : "N/A",
      );
      console.log("raw.abi type:", raw?.abi ? typeof raw.abi : "NO .abi");
      console.log("raw.abi is array:", Array.isArray(raw?.abi));
      console.log(
        "raw.abi length:",
        Array.isArray(raw?.abi) ? raw.abi.length : "N/A",
      );
      if (Array.isArray(raw)) {
        // Stored as a plain array of ABI items
        abiJson = raw;
      } else if (raw && typeof raw === "object") {
        if (Array.isArray(raw.abi)) {
          // Wrapped object: { id, abi: [...], bytecode: {}, metadata: {} }
          abiJson = raw.abi;
        } else {
          // Last resort: pick the largest array value in the object
          const arrays = Object.values(raw).filter((v): v is any[] =>
            Array.isArray(v),
          );
          if (arrays.length > 0) {
            abiJson = arrays.reduce((a, b) => (b.length > a.length ? b : a));
          }
        }
      } else if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            abiJson = parsed;
          } else if (parsed && Array.isArray(parsed.abi)) {
            abiJson = parsed.abi;
          }
        } catch {
          abiJson = [];
        }
      }

      if (abiJson.length === 0) {
        console.warn(
          `[Monitoring] Project ${projectId} has empty/invalid ABI. Using fallback []`,
        );
      }
      // ───────────────────────────────────────────────────────────────

      const fingerprint = generateFingerprint(abiJson);

      await prisma.userMonitoringList.upsert({
        where: {
          userId_projectId: { userId, projectId },
        },
        update: { isActive: true },
        create: { userId, projectId, isActive: true },
      });

      await prisma.contractFingerPrint.upsert({
        where: { projectId },
        update: {
          payableFunctions: fingerprint.payableFunctions,
          adminFunctions: fingerprint.adminFunctions,
          valueFunctions: fingerprint.valueFunctions,
          governanceFunctions: fingerprint.governanceFunctions,
          allFunctions: fingerprint.allFunctions,
          highRiskEvents: fingerprint.events.high_risk,
          flowEvents: fingerprint.events.flow,
          governanceEvents: fingerprint.events.governance,
          allEvents: fingerprint.events.all,
          hasFlashLoan: fingerprint.signals.hasFlashLoan,
          hasAdminChange: fingerprint.signals.hasAdminChange,
          hasGovernance: fingerprint.signals.hasGovernance,
          hasEmergencyWithdraw: fingerprint.signals.hasEmergencyWithdraw,
          isPayable: fingerprint.signals.isPayable,
        },
        create: {
          projectId,
          payableFunctions: fingerprint.payableFunctions,
          adminFunctions: fingerprint.adminFunctions,
          valueFunctions: fingerprint.valueFunctions,
          governanceFunctions: fingerprint.governanceFunctions,
          allFunctions: fingerprint.allFunctions,
          highRiskEvents: fingerprint.events.high_risk,
          flowEvents: fingerprint.events.flow,
          governanceEvents: fingerprint.events.governance,
          allEvents: fingerprint.events.all,
          hasFlashLoan: fingerprint.signals.hasFlashLoan,
          hasAdminChange: fingerprint.signals.hasAdminChange,
          hasGovernance: fingerprint.signals.hasGovernance,
          hasEmergencyWithdraw: fingerprint.signals.hasEmergencyWithdraw,
          isPayable: fingerprint.signals.isPayable,
        },
      });

      await pushNewContract(projectId, project.contractAddress, fingerprint);

      await prisma.userProjects.update({
        where: { id: projectId },
        data: { monitoringStatus: "ACTIVE" },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        message: "Monitoring started successfully",
        data: { fingerprint },
      });
    } catch (error) {
      console.error("Monitoring start error:", error);
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };

  view = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized",
        });
      }

      const { projectId } = req.query;

      const monitoringList = await prisma.userMonitoringList.findMany({
        where: {
          userId,
          ...(projectId ? { projectId: String(projectId) } : {}),
        },
        include: {
          project: {
            include: {
              fingerprint: true,
            },
          },
        },
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        data: monitoringList,
      });
    } catch (error) {
      console.error("Monitoring view error:", error);
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
  pause = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(HTTPStatus.Unauthorized).json({
        success: false,
        message: "User not authorized",
      });
    }

    const { projectId } = req.body;
    if (!projectId) {
      return res.status(HTTPStatus.BadRequest).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await prisma.userProjects.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(HTTPStatus.Notfound).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.userId !== userId) {
      return res.status(HTTPStatus.Unauthorized).json({
        success: false,
        message: "You are not authorized to pause monitoring for this project",
      });
    }

    if (project.monitoringStatus !== "ACTIVE") {
      return res.status(HTTPStatus.BadRequest).json({
        success: false,
        message: "Monitoring is not active for this project",
      });
    }

    // Mark monitoring as inactive in the monitoring list
    await prisma.userMonitoringList.update({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: { isActive: false },
    });

    // Update project monitoring status to INACTIVE
    await prisma.userProjects.update({
      where: { id: projectId },
      data: { monitoringStatus: "INACTIVE" },
    });

    // Push pause event to Kafka — sec server picks this up and removes
    // the contract from its active monitoring list
    await pushPauseContract(projectId, project.contractAddress);

    return res.status(HTTPStatus.Success).json({
      success: true,
      message: "Monitoring paused successfully",
    });
  } catch (error) {
    console.error("Monitoring pause error:", error);
    return res.status(HTTPStatus.InternalError).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

  getTimeSeries = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(HTTPStatus.Unauthorized).json({
          success: false,
          message: "User not authorized",
        });
      }

      const { contractAddress } = req.params;
      if (!contractAddress) {
        return res.status(HTTPStatus.BadRequest).json({
          success: false,
          message: "Contract address is required",
        });
      }

      // Initialize InfluxDB client (using same env vars as WS)
      const url = process.env.INFLUX_URL || "http://localhost:8086";
      const token = process.env.INFLUX_TOKEN;
      const org = process.env.INFLUX_ORG || "kaizen";
      const bucket = process.env.INFLUX_BUCKET || "kaizen_metrics";

      if (!token) {
        return res.status(HTTPStatus.InternalError).json({
          success: false,
          message: "InfluxDB token not configured",
        });
      }

      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

      // Query past 24 hours of data for this contract
      const fluxQuery = `
        from(bucket:"${bucket}")
          |> range(start: -24h)
          |> filter(fn: (r) => r._measurement == "contract_metrics")
          |> filter(fn: (r) => r.contractAddress == "${String(contractAddress).toLowerCase()}")
          |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
          |> sort(columns: ["_time"], desc: false)
      `;

      const results: any[] = [];
      
      await new Promise<void>((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            results.push(o);
          },
          error(error) {
            console.error("InfluxDB query error:", error);
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      return res.status(HTTPStatus.Success).json({
        success: true,
        data: results,
      });

    } catch (error) {
      console.error("Monitoring timeSeries error:", error);
      return res.status(HTTPStatus.InternalError).json({
        success: false,
        error: (error as Error).message,
      });
    }
  };
}

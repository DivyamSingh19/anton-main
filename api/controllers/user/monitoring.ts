import prisma from "../../db/db";
import { Request,Response } from "express";
import { HTTPStatus } from "../../utils/httpstatus";

import { generateFingerprint, AbiItem } from "../../utils/abiFingerprint";
import { pushNewContract } from "../../kafka/config";

//this will be hit from the frontend by the user on the frontend i am rendering the projects using the getProjectAll api so when user clicks on the 
//button /start is hit once it is hit we do 3 things = > add to db (usermonitoringlist), generate a fingerprint from the abi.json file and then we push the contract address,projectId and fingerprint the fingerprint schema is below and update the schema.prisma to match it to the kafka instance topic-name new-contracts , next we  update the status in projects Monitoring to active
export class MonitoringController{
    start = async (req:Request,res:Response) => {
        try {
            const userId = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User not authorized"
                })
            }
            const {projectId} = req.body
            if (!projectId) {
                return res.status(HTTPStatus.BadRequest).json({
                    success: false,
                    message: "Project ID is required"
                });
            }

            const project = await prisma.userProjects.findUnique({
                where: { id: projectId }
            });

            if (!project) {
                return res.status(HTTPStatus.Notfound).json({
                    success: false,
                    message: "Project not found"
                });
            }

            if (project.userId !== userId) {
                return res.status(HTTPStatus.Unauthorized).json({
                    success: false,
                    message: "You are not authorized to monitor this project"
                });
            }

            // Generate fingerprint
            let abiStr = '';
            if (typeof project.abi === 'string') {
                abiStr = project.abi;
            } else {
                abiStr = JSON.stringify(project.abi);
            }
            const abiJson: AbiItem[] = JSON.parse(abiStr);
            const fingerprint = generateFingerprint(abiJson);

            // Add to UserMonitoringList
            await prisma.userMonitoringList.upsert({
                where: {
                    userId_projectId: {
                        userId,
                        projectId
                    }
                },
                update: {
                    isActive: true
                },
                create: {
                    userId,
                    projectId,
                    isActive: true
                }
            });

            // Add fingerprint to DB
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
                    isPayable: fingerprint.signals.isPayable
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
                    isPayable: fingerprint.signals.isPayable
                }
            });

            // Publish to Kafka
            await pushNewContract(projectId, project.contractAddress, fingerprint);

            // Update monitoring status to active
            await prisma.userProjects.update({
                where: { id: projectId },
                data: { monitoringStatus: "ACTIVE" }
            });

            return res.status(HTTPStatus.Success).json({
                success: true,
                message: "Monitoring started successfully",
                data: {
                    fingerprint
                }
            });

        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                error:(error as Error).message
            })
        }
    }
    view = async (req:Request,res:Response) => {
        try {
            const userId  = req.userId
            if(!userId){
                return res.status(HTTPStatus.Unauthorized).json({
                    success:false,
                    message:"User not authorized"
                })
            }

            const { projectId } = req.query;

            const monitoringList = await prisma.userMonitoringList.findMany({
                where: {
                    userId,
                    ...(projectId ? { projectId: String(projectId) } : {})
                },
                include: {
                    project: {
                        include: {
                            fingerprint: true
                        }
                    }
                }
            });

            return res.status(HTTPStatus.Success).json({
                success: true,
                data: monitoringList
            });
        } catch (error) {
            return res.status(HTTPStatus.InternalError).json({
                success:false,
                error:(error as Error).message
            })
        }
    }    
}
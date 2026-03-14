import prisma from "./db/db";

async function checkAbi() {
  const project = await prisma.userProjects.findFirst();
  if (project) {
    console.log("Found project:", project.id);
    console.log("Type of abi:", typeof project.abi);
    console.log("IsArray:", Array.isArray(project.abi));
    console.log("Keys if object:", typeof project.abi === 'object' && project.abi !== null ? Object.keys(project.abi) : 'N/A');
    console.log("Is plain object:", Object.prototype.toString.call(project.abi) === '[object Object]');
    console.log("First 100 chars of abi stringified:", JSON.stringify(project.abi).substring(0, 100));
  } else {
    console.log("No projects found.");
  }
}
checkAbi().catch(console.error).finally(() => prisma.$disconnect());

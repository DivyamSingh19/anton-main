import express from "express";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

const app = express();
const port = 4001;

app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "UP", service: "kaizen-orchestrator" });
});

app.listen(port, () => {
  console.log(`Orchestrator server running on port ${port}`);
});

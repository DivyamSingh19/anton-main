import mongoose from "mongoose";

const MempoolEventSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true },
  transactionHash: { type: String, required: true },
  from: { type: String },
  to: { type: String },
  value: { type: String },
  timestamp: { type: Date, default: Date.now },
  projectId: { type: String },
});

export const MempoolEvent = mongoose.model("MempoolEvent", MempoolEventSchema);

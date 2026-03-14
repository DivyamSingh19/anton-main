import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const url = process.env.INFLUX_URL || "http://localhost:8086";
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG || "kaizen";
const bucket = process.env.INFLUX_BUCKET || "kaizen_metrics";

if (!token) {
  logger.warn("InfluxDB token not provided. Timeseries metrics will not be saved.");
}

export const influxDB = new InfluxDB({ url, token: token || "" });
export const writeApi = influxDB.getWriteApi(org, bucket, "ns");

export interface TransactionMetrics {
  total_eth_outflow: number;
  total_eth_inflow: number;
  net_flow: number;
  largest_single_transfer: number;
  transfer_count: number;
  unique_callers: number;
  total_function_calls: number;
  new_caller_ratio: number;
  admin_function_called: number;
  new_admin_address: number;
  avg_gas_price: number;
  gas_price_ratio_to_network: number;
  token_transfer_volume: number;
  voting_power_concentration: number;
  delegation_spike: number;
  outflow_vs_7d_avg: number;
  outflow_zscore: number;
  caller_zscore: number;
  calls_per_caller: number;
  outflow_per_transfer: number;
  inflow_outflow_ratio: number;
}

export const writeMetrics = async (contractAddress: string, metrics: TransactionMetrics) => {
  if (!token) return;

  try {
    const point = new Point("contract_metrics")
      .tag("contractAddress", contractAddress.toLowerCase())
      .floatField("total_eth_outflow", metrics.total_eth_outflow)
      .floatField("total_eth_inflow", metrics.total_eth_inflow)
      .floatField("net_flow", metrics.net_flow)
      .floatField("largest_single_transfer", metrics.largest_single_transfer)
      .floatField("transfer_count", metrics.transfer_count)
      .floatField("unique_callers", metrics.unique_callers)
      .floatField("total_function_calls", metrics.total_function_calls)
      .floatField("new_caller_ratio", metrics.new_caller_ratio)
      .floatField("admin_function_called", metrics.admin_function_called)
      .floatField("new_admin_address", metrics.new_admin_address)
      .floatField("avg_gas_price", metrics.avg_gas_price)
      .floatField("gas_price_ratio_to_network", metrics.gas_price_ratio_to_network)
      .floatField("token_transfer_volume", metrics.token_transfer_volume)
      .floatField("voting_power_concentration", metrics.voting_power_concentration)
      .floatField("delegation_spike", metrics.delegation_spike)
      .floatField("outflow_vs_7d_avg", metrics.outflow_vs_7d_avg)
      .floatField("outflow_zscore", metrics.outflow_zscore)
      .floatField("caller_zscore", metrics.caller_zscore)
      .floatField("calls_per_caller", metrics.calls_per_caller)
      .floatField("outflow_per_transfer", metrics.outflow_per_transfer)
      .floatField("inflow_outflow_ratio", metrics.inflow_outflow_ratio);

    writeApi.writePoint(point);
    await writeApi.flush();
  } catch (err) {
    logger.error("Error writing metrics to InfluxDB", { error: err });
  }
};

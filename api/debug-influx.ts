import { InfluxDB } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

const url = process.env.INFLUX_URL || "";
const token = process.env.INFLUX_TOKEN || "";
const org = process.env.INFLUX_ORG || "kaizen";
const bucket = process.env.INFLUX_BUCKET || "main";

async function debugInflux() {
  console.log(`Connecting to: ${url}`);
  console.log(`Org: ${org}, Bucket: ${bucket}`);
  
  if (!token) {
    console.error("No token found!");
    return;
  }

  const influx = new InfluxDB({ url, token });
  const queryApi = influx.getQueryApi(org);
  
  // 1. Check for ANY data in contract_metrics
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "contract_metrics")
      |> group(columns: ["contractAddress"])
      |> distinct(column: "contractAddress")
  `;

  console.log("Querying unique contract addresses in InfluxDB...");
  try {
    const addresses: Set<string> = new Set();
    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const obj = tableMeta.toObject(row);
          if (obj.contractAddress) addresses.add(obj.contractAddress);
          else if (obj._value) addresses.add(obj._value);
        },
        error(err) {
          reject(err);
        },
        complete() {
          resolve();
        },
      });
    });
    
    console.log("Found contract addresses:", Array.from(addresses));

    // 2. Query raw data for one monitored address if found
    if (addresses.size > 0) {
        const firstAddr = Array.from(addresses)[0];
        console.log(`Querying raw fields for ${firstAddr}...`);
        const rawQuery = `
            from(bucket: "${bucket}")
                |> range(start: -24h)
                |> filter(fn: (r) => r._measurement == "contract_metrics")
                |> filter(fn: (r) => r.contractAddress == "${firstAddr}")
                |> limit(n: 5)
        `;
        const rows: any[] = [];
        await new Promise<void>((resolve, reject) => {
            queryApi.queryRows(rawQuery, {
                next(row, tableMeta) {
                    rows.push(tableMeta.toObject(row));
                },
                error(err) { reject(err); },
                complete() { resolve(); },
            });
        });
        console.log("Raw rows sample:", JSON.stringify(rows, null, 2));
    } else {
        console.log("No data found in 'contract_metrics' measurement in the last 24h.");
        
        // Check ALL measurements
        console.log("Checking all measurements in the bucket...");
        const allMeasQuery = `
            import "influxdata/influxdb/schema"
            schema.measurements(bucket: "${bucket}")
        `;
        const measurements: string[] = [];
        await new Promise<void>((resolve, reject) => {
            queryApi.queryRows(allMeasQuery, {
                next(row, tableMeta) {
                    measurements.push(tableMeta.toObject(row)._value);
                },
                error(err) { reject(err); },
                complete() { resolve(); },
            });
        });
        console.log("Available measurements:", measurements);
    }
  } catch (error) {
    console.error("Error querying InfluxDB:", error);
  }
}

debugInflux().catch(console.error);

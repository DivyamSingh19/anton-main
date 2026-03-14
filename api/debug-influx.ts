import { InfluxDB, Point } from "@influxdata/influxdb-client";
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
  
  // TEST WRITE
  console.log("Attempting a test write...");
  const writeApi = influx.getWriteApi(org, bucket, "ns");
  const testPoint = new Point("debug_test")
    .tag("test", "true")
    .floatField("value", Math.random());
  
  writeApi.writePoint(testPoint);
  try {
    await writeApi.flush();
    console.log("Test point written and flushed.");
  } catch (e) {
    console.error("Flush failed:", e);
  }

  const queryApi = influx.getQueryApi(org);
  
  // Query ALL data in the last 1h to see if anything is there
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> limit(n: 5)
  `;

  console.log("Running query:", fluxQuery);
  try {
    const results: any[] = [];
    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          results.push(tableMeta.toObject(row));
        },
        error(err) {
          reject(err);
        },
        complete() {
          resolve();
        },
      });
    });
    
    console.log(`Found ${results.length} total rows in last hour.`);
    if (results.length > 0) {
      console.log("Sample rows:", JSON.stringify(results, null, 2));
    }
  } catch (error) {
    console.error("Error querying InfluxDB:", error);
  }
}

debugInflux().catch(console.error);

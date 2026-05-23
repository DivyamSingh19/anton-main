import { InfluxDB, Point } from '@influxdata/influxdb-client'

const url = process.env.INFLUX_URL!
const token = process.env.INFLUX_TOKEN!
const org = process.env.INFLUX_ORG!
const bucket = process.env.INFLUX_BUCKET!

export const influx = new InfluxDB({ url, token })
export const writeApi = influx.getWriteApi(org, bucket)
export const queryApi = influx.getQueryApi(org)

export const createFeaturePoint = ({
  userId,
  projectId,
  contractAddress,
  chainId,
  features
}: any) => {

  const point = new Point('contract_features')
    .tag('userId', userId)
    .tag('projectId', projectId)
    .tag('contractAddress', contractAddress)
    .tag('chainId', chainId)

    .floatField('avg_call_rate', features.avg_call_rate)
    .floatField('rare_function_ratio', features.rare_function_ratio)
    .floatField('treasury_outflow_std', features.treasury_outflow_std)
    .floatField('admin_action_freq', features.admin_action_freq)
    .floatField('state_transition_entropy', features.state_transition_entropy)
    .floatField('governance_volatility', features.governance_volatility)

  return point
}
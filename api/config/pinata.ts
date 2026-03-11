import { PinataSDK } from "pinata";

const pinataConfig = new PinataSDK({
    pinataJwt:process.env.PINATA_JWT as string,
    pinataGatewayKey: process.env.PINATA_GATEWAY as string
})

export const pinata = pinataConfig
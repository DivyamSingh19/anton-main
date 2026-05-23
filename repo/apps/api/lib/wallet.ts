import fs from "fs"

export const jwk = JSON.parse(
    fs.readFileSync("secrets/arweave-key.json","utf-8")
)
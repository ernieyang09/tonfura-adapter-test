import TonWeb from "tonweb"
import TonAdapter from "./adapter"
import "dotenv/config"

const { TONFURA_API_KEY = "", SEED_STRING = "" } = process.env

const getClient = () =>
  new TonAdapter({
    apiKey: TONFURA_API_KEY,
  })

const getKeyPair = () => {
  const seed = TonWeb.utils.hexToBytes(SEED_STRING)
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed)

  return keyPair
}

export { getClient, getKeyPair }

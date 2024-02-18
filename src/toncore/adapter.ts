import axios from "axios"
import { TonClient, HttpApi } from "@ton/ton"
import { Network } from "tonfura-sdk"

const ProxiedHttp = new Proxy(HttpApi, {
  construct(target, args) {
    // Intercept the creation of new instances and modify input
    const instance = Reflect.construct(target, args)
    const doCallProxy = new Proxy(instance.doCall, {
      async apply(doCallTarget, thisArg, doCallArgs) {
        // Intercept the apply (method call) and modify the method
        // const modifiedMethod = doCallArgs[0].toUpperCase() // For example, convert method to uppercase
        const modifiedMethod = "ton_" + doCallArgs[0]
        console.log(`Proxy doCall method called with method: ${modifiedMethod}`)
        doCallArgs[0] = modifiedMethod
        return Reflect.apply(doCallTarget, thisArg, doCallArgs)
      },
    })

    instance.doCall = doCallProxy

    return instance
  },
})

class ToncoreAdapter extends TonClient {
  constructor({ apiKey, network }: { apiKey: string; network: Network }) {
    super({
      endpoint: "",
    })
    this.api = new ProxiedHttp(
      `https://tonfura-testnet-rpc-develop.fdc.ai/v1/json-rpc/${apiKey}`,
      {
        adapter: async (config) => {
          const r = await axios.defaults.adapter!(config)

          if (r.status !== 200) {
            throw r
          }

          r.data = JSON.stringify({
            ...JSON.parse(r.data),
            ok: true,
          })

          return r
        },
      }
    )
  }
}

export default ToncoreAdapter


import TonWeb from "tonweb"

const TonWebWrappedHttpProvider = new Proxy(TonWeb.HttpProvider, {
  construct(target, args) {
    // Intercept the creation of new instances and modify input
    const instance = new target(...args)

    const sendProxy = new Proxy(instance.send, {
      async apply(doCallTarget, thisArg, doCallArgs) {
        // Intercept the apply (method call) and modify the method
        // const modifiedMethod = doCallArgs[0].toUpperCase() // For example, convert method to uppercase
        const modifiedMethod = "ton_" + doCallArgs[0]
        console.log(`Proxy doCall method called with method: ${modifiedMethod}`)
        doCallArgs[0] = modifiedMethod

        return Reflect.apply(doCallTarget, thisArg, doCallArgs)
      },
    })

    instance.send = sendProxy

    return instance
  },
})

class TonAdapter extends TonWeb {
  constructor({ apiKey }: { apiKey: string }) {
    super(
      new TonWebWrappedHttpProvider(
        `https://tonfura-api-production.fdc.ai/v1/json-rpc/${apiKey}`
      )
    )
  }
}

export default TonAdapter

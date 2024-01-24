import * as tonMnemonic from "tonweb-mnemonic"

function toHexString(byteArray: Uint8Array) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2)
    })
    .join("")
}

const main = async () => {
  const seed = await tonMnemonic.mnemonicToSeed([
    /* mnemonic */
  ])
  console.log(toHexString(seed))
}

try {
  main()
} catch (e) {
  console.log(e)
}

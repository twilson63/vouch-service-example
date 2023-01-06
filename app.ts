import express from 'express'
import Arweave from 'arweave'
const arweave = Arweave.init({host:'arweave.net', port: 443, protocol: 'https'})

const app = express()

app.post('/', express.json(), async (req, res) => {
  //console.log(req.body)
  // need to verify tx using arweave.crypto.verify
  const result = await verify(req.body)
  console.log(result)
  res.json({hello: 'world'})
})

app.get('/', (req, res) => {
  res.json('Vouch Service')
})

export default app


async function verify({data, publicKey, signature}) {
  return arweave.crypto.verify(
    publicKey,
    arweave.utils.b64UrlToBuffer(data),
    arweave.utils.b64UrlToBuffer(signature)
  )
}
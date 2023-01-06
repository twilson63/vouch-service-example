import { test } from 'uvu'
import * as assert from 'uvu/assert'
import request from 'supertest'

import Arweave from 'arweave'
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

import app from './app'

test('GET / vouch service', () => {
  request(app).get('/').expect(200).end((err, res) => {
    //console.log(err)
    assert.equal(res.body, 'Vouch Service')
    
  })
})

test('POST / vouch request', async () => {
  const jwk = await arweave.wallets.generate()
  
  const data = Arweave.utils.stringToBuffer(JSON.stringify({
    address: '1234',
    service: 'stamps',
    type: 'vouch'
  }))
  const signature = await Arweave.crypto.sign(jwk, data)
  const payload = {
    data: Arweave.utils.bufferTob64Url(data),
    publicKey: jwk.n,
    signature: Arweave.utils.bufferTob64Url(signature)
  }
 
  request(app).post('/')
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      console.log(res.body)
      assert.ok(true)
    })
})

test.run()
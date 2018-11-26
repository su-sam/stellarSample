const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const userId = 'GB76WPMTKS4RCPVJKY3HDVCS64OYGBI5V7G4TUWBLZFGJ65PBR2WEX4E';

const rp = require('request-promise');
const options = {
    uri: ' https://horizon-testnet.stellar.org/accounts/GB76WPMTKS4RCPVJKY3HDVCS64OYGBI5V7G4TUWBLZFGJ65PBR2WEX4E/effects',
    //qs: ,
    json: true
  }

server.effects()
  .forAccount(userId)
  .call()
  .then(function (effectResults) {
    console.log(`=====ACCOUNT : ${userId} =====`)
    for (let rec of effectResults.records) {
         let ids = (rec["_links"].operation.href).replace('https://horizon-testnet.stellar.org/operations/','')
         server.operations()
            .operation(ids)
            .call()
            .then(function (operationsResult) {

                console.log('\n\nDATE : '+operationsResult.created_at)
                console.log('TYPE : '+operationsResult.type)
                console.log('FROM : '+operationsResult.from)
                console.log('TO : '+operationsResult.to)
                console.log('AMOUNT : '+operationsResult.amount)
                console.log('ASSET CODE : '+operationsResult.asset_code)
                console.log('ASSET ISSUER : '+operationsResult.asset_issuer)
                console.log('HASH : '+operationsResult.transaction_hash)
             })
            .catch(function (err) {
                console.log(err)
            })
    }
  })
  .catch(function (err) {
    console.log(err)
  })

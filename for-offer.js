const StellarSdk = require('stellar-sdk')

StellarSdk.Network.useTestNetwork()

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')

//const user1 = 'GAXKYZM7ZXTMHOLOKHEHVAXR27UT7SLDQC5NO4BMMAMSMXDUSQ3LCZNU'
const user1key = StellarSdk.Keypair.fromSecret('SAYNVRST37VL2Z4VXW3AUET5Y6ULQ5CXVBAISGNS4RIMH5ESKDPPYWY2');
//const user2 = 'GB76WPMTKS4RCPVJKY3HDVCS64OYGBI5V7G4TUWBLZFGJ65PBR2WEX4E'
const user2key = StellarSdk.Keypair.fromSecret('SAALDUWFQD7AMYAU65TXMJQ5PFEZNHDUWGEG5NHYDKMZVWOSU6DJSAWW');

//custom asset
//asset name must be 4, 12 char -> [a-z][A-Z][0-9]
const asset1Name = 'GREEN';
const issuing1Id = 'GCAQBBGUEVLS2EHIKVRX5X4UDJP5AVPNSO3CDM4RVEZO5KY75D5E3IFE';
const asset2Name = 'BLUE';
const issuing2Id = 'GCAQBBGUEVLS2EHIKVRX5X4UDJP5AVPNSO3CDM4RVEZO5KY75D5E3IFE';


//new asset object
const assetGreen = new StellarSdk.Asset(asset1Name, issuing1Id)
const assetBlue = new StellarSdk.Asset(asset2Name, issuing2Id)

//print balance
const printBalance = async publicKey => {
    try {
        const acc = await server.loadAccount(publicKey);
        console.log(`\n=========== ACCOUNT ${publicKey} ===========`)
        for (let balance of acc.balances){
            for (let key in balance) {
                console.log(`${key}: ${balance[key]}`);
              }
        }
    } catch (errorr) {
        console.error(errorr)
    }
}

//main func
const start = async () => {
  const user1 = await server.loadAccount(user1key.publicKey())
  const user2 = await server.loadAccount(user2key.publicKey())

  console.log('=====BEFORE OFFER=====')
  await printBalance(user1key.publicKey())
  await printBalance(user2key.publicKey())
  console.log('')
  console.log('')

  console.log('user 1 offer to sell Green for Blue')
  const tx1 = new StellarSdk.TransactionBuilder(user1)
    .addOperation(StellarSdk.Operation.manageOffer({
        selling: assetGreen,
        buying: assetBlue,
        amount: '100',
        price: 1
      }))
    .build()
  tx1.sign(user1key)
  await server.submitTransaction(tx1)

  console.log('user 2 offer to sell Blue for Green')
  const tx2 = new StellarSdk.TransactionBuilder(user2)
    .addOperation(StellarSdk.Operation.manageOffer({
        selling: assetBlue,
        buying: assetGreen,
        amount: '100',
        price: 1
      }))
    .build()
  tx2.sign(user2key)
  await server.submitTransaction(tx2)

  console.log('=====AFTER OFFER=====')
  await printBalance(user1key.publicKey())
  await printBalance(user2key.publicKey())
  console.log('')
  console.log('')
}

start()
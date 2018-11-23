const StellarSdk = require('stellar-sdk');
// const pair = StellarSdk.Keypair.random();//gen new acc
//const pair = StellarSdk.Keypair.fromSecret('SAKC6MCFJ2IYS7QIJIFBFQNFS6GGDF2YGEZV7MVNAQI63IQSY2ZK7MRC');
const pair = StellarSdk.Keypair.fromSecret('SAYNVRST37VL2Z4VXW3AUET5Y6ULQ5CXVBAISGNS4RIMH5ESKDPPYWY2');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')


const rp = require('request-promise');

const options = {
    uri: 'https://friendbot.stellar.org',
    qs: { addr: pair.publicKey() },
    json: true
  }

const printBalance = async () => {
    try {
        const acc = await server.loadAccount(pair.publicKey());
        for (let balance of acc.balances){
            for (let key in balance) {
                console.log(`${key}: ${balance[key]}`);
              }
        }
    } catch (errorr) {
        console.error(errorr)
    }
}

const start = async () => {
    try {
         //const reqMoneyResponse = await rp(options); //req money for new acc
        await printBalance(pair.publicKey());
         //console.log(reqMoneyResponse); //log req money for new acc
    } catch (e) {
        console.error(e)
    }
     console.log(pair.publicKey());
     console.log(pair.secret());  
}

start()
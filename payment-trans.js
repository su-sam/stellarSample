//do payment transaction

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork();

//issuing acc //'secret key'
const issuingKey = StellarSdk.Keypair.fromSecret('SAKC6MCFJ2IYS7QIJIFBFQNFS6GGDF2YGEZV7MVNAQI63IQSY2ZK7MRC');
//distribution acc //'secret key' or you can use his PUBLIC KEY
const distributionKey = StellarSdk.Keypair.fromSecret('SAYNVRST37VL2Z4VXW3AUET5Y6ULQ5CXVBAISGNS4RIMH5ESKDPPYWY2');
//const distributionKey = 'GAXKYZM7ZXTMHOLOKHEHVAXR27UT7SLDQC5NO4BMMAMSMXDUSQ3LCZNU'



//print Acc balance
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


const start = async () => {
    try {
        //check before payment
        console.log('BEFORE PAYMENT');
        printBalance(issuingKey.publicKey());
        printBalance(distributionKey.publicKey());
        
        //load account
        const issuingAcc = await server.loadAccount(issuingKey.publicKey())
        const distributionAcc = await server.loadAccount(distributionKey.publicKey())

        //issuing do payment
        const issuingPayment = new StellarSdk.TransactionBuilder(issuingAcc)
        .addOperation(StellarSdk.Operation.payment({
            destination: distributionKey.publicKey(),
            asset: StellarSdk.Asset.native(), //for native asset
            amount: '100'
        }))
        .build();
        issuingPayment.sign(issuingKey);
        await server.submitTransaction(issuingPayment)

        //check after payment
        console.log("\n\nAFTER PAYMENT");
        printBalance(issuingKey.publicKey());
        printBalance(distributionKey.publicKey());
        

    } catch (e) {
        console.log(e)
    }
}

start();
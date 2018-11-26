//issue new asset and DO first payment

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork();

//issuing acc //'secret key'
const issuingKey = StellarSdk.Keypair.fromSecret('SAKC6MCFJ2IYS7QIJIFBFQNFS6GGDF2YGEZV7MVNAQI63IQSY2ZK7MRC');
//distribution acc //'secret key'
const distributionKey = StellarSdk.Keypair.fromSecret('SAALDUWFQD7AMYAU65TXMJQ5PFEZNHDUWGEG5NHYDKMZVWOSU6DJSAWW');

//asset name must be 4, 12 char -> [a-z][A-Z][0-9]
const assetName = 'BLUE';

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
        

        const issuingAcc = await server.loadAccount(issuingKey.publicKey())
        const distributionAcc = await server.loadAccount(distributionKey.publicKey())

        //create new asset
        const assetNew = new StellarSdk.Asset(assetName, issuingKey.publicKey());
        console.log (`\n\nsuccess! ASSET ${assetName} of ${issuingKey.publicKey()} has been created !!!`);
        
        //create trustline //1st time payment
        const trustline = new StellarSdk.TransactionBuilder(distributionAcc)
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: assetNew, //!! new Asset
            limit: '10000'
        }))
        .build()
        trustline.sign(distributionKey)
        await server.submitTransaction(trustline)

        //issuing give his asset (100 GREEN) to distribution
        const issuingPayment = new StellarSdk.TransactionBuilder(issuingAcc)
        .addOperation(StellarSdk.Operation.payment({
            destination: distributionKey.publicKey(),
            asset: assetNew,
            amount: '1000'
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
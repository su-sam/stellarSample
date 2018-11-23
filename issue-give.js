const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork();

//issuing acc
const mrAKey = StellarSdk.Keypair.fromSecret('SAKC6MCFJ2IYS7QIJIFBFQNFS6GGDF2YGEZV7MVNAQI63IQSY2ZK7MRC');
//distribution acc
const mrBKey = StellarSdk.Keypair.fromSecret('SAYNVRST37VL2Z4VXW3AUET5Y6ULQ5CXVBAISGNS4RIMH5ESKDPPYWY2');

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
        console.log('BEFORE GIVE ASSET');
        printBalance(mrAKey.publicKey());
        printBalance(mrBKey.publicKey());
        

        const mrAAcc = await server.loadAccount(mrAKey.publicKey())
        const mrBAcc = await server.loadAccount(mrBKey.publicKey())

        //create new asset
        const assetGreen = new StellarSdk.Asset('GREEN', mrAKey.publicKey());

        //create trustline
        const trustline = new StellarSdk.TransactionBuilder(mrBAcc)
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: assetGreen,
            limit: '1000'
        }))
        .build()
        trustline.sign(mrBKey)
        await server.submitTransaction(trustline)

        //mrA give his asset (100 GREEN) to mrB
        const mrAPayment = new StellarSdk.TransactionBuilder(mrAAcc)
        .addOperation(StellarSdk.Operation.payment({
            destination: mrBKey.publicKey(),
            asset: assetGreen,
            amount: '100'
        }))
        .build();
        mrAPayment.sign(mrAKey);
        await server.submitTransaction(mrAPayment)

        //check after payment
        console.log("\n\nAFTER PAYMENT");
        printBalance(mrAKey.publicKey());
        printBalance(mrBKey.publicKey());
        

    } catch (e) {
        console.log(e)
    }
}

start();
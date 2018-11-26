//do payment transaction

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
StellarSdk.Network.useTestNetwork();

//custom asset
//asset name must be 4, 12 char -> [a-z][A-Z][0-9]
const assetName = 'GREEN';
const issuingId = 'GCAQBBGUEVLS2EHIKVRX5X4UDJP5AVPNSO3CDM4RVEZO5KY75D5E3IFE';

//user1 to user2
//const user1 = 'GAXKYZM7ZXTMHOLOKHEHVAXR27UT7SLDQC5NO4BMMAMSMXDUSQ3LCZNU'
const user1 = StellarSdk.Keypair.fromSecret('SAYNVRST37VL2Z4VXW3AUET5Y6ULQ5CXVBAISGNS4RIMH5ESKDPPYWY2');

//const user2 = 'GB76WPMTKS4RCPVJKY3HDVCS64OYGBI5V7G4TUWBLZFGJ65PBR2WEX4E'
const user2 = StellarSdk.Keypair.fromSecret('SAALDUWFQD7AMYAU65TXMJQ5PFEZNHDUWGEG5NHYDKMZVWOSU6DJSAWW');


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
        printBalance(user1.publicKey());
        printBalance(user2.publicKey());
        
        //load account
        const issuingAcc = await server.loadAccount(user1.publicKey())
        //custom asset
        const assetNew = new StellarSdk.Asset(assetName, issuingId);

        //issuing do payment
        const issuingPayment = new StellarSdk.TransactionBuilder(issuingAcc)
        .addOperation(StellarSdk.Operation.payment({
            destination: user2.publicKey(),
            asset : assetNew,
            //asset: StellarSdk.Asset.native(), //for native asset
            amount: '100'
        }))
        .build();
        issuingPayment.sign(user1);
        await server.submitTransaction(issuingPayment)

        //check after payment
        console.log("\n\nAFTER PAYMENT");
        printBalance(user1.publicKey());
        printBalance(user2.publicKey());
        

    } catch (e) {
        console.log(e)
    }
}

start();
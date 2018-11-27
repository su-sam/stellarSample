const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')

// master-acc set weight at set-option 
//--> master key = 2
//--> addition key =1
//--> low = 0, med=2, high=2
//--> then who have addition key he will do low threshold
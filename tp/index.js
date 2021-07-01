const { TransactionProcessor } = require('sawtooth-sdk/processor');
const healthcareHandler = require('./handler');
const address = process.argv[2]
const transactionProcessor = new TransactionProcessor(address);

transactionProcessor.addHandler(new healthcareHandler());
transactionProcessor.start();

console.log(`Welcome to healthcare`);
console.log(`Connecting to Sawtooth validator at Validator 0`);

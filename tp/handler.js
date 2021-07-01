const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const cbor = require('cbor');
const ClientStore = require('./ClientStore');

var { TP_FAMILY, TP_NAMESPACE } = require('./constants');

class healthcareHandler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, ['1.0'], [TP_NAMESPACE]);
    }

    async handleAddDoctor(context, payload) {
        const clientStore = new ClientStore(context);
        const doctorExists = await clientStore.doctorExists(payload.doctorId);
        if (doctorExists) {
            throw new InvalidTransaction(`doctor with doctorId : ${payload.doctorId} already exists!`);
        } else {
            return await clientStore.addDoctor(payload);
        }
    }

    async handleAddPatient(context, payload) {
        const clientStore = new ClientStore(context);
        const patientExists = await clientStore.patientExists(payload.patientId);
        if (patientExists) {
            throw new InvalidTransaction(`patient with patientId : ${payload.patientId} already exists!`);
        } else {
            return await clientStore.addPatient(payload);
        }
    }

    async handleAddPrescription(context, payload){
        const clientStore= new ClientStore(context);
        const doctorExists= await clientStore.doctorExists(payload.doctorId);
        const patientExists= await clientStore.patientExists(payload.patientId);
        if(!(doctorExists && patientExists)){
            throw new InvalidTransaction(`patientId or doctorId doesn't exist`);
        }else{
            return await clientStore.addPrescription(payload);
        }
    }

    async handleAddRecord(context, payload){
        const clientStore= new ClientStore(context);
        const doctorExists= await clientStore.doctorExists(payload.doctorId);
        const patientExists= await clientStore.patientExists(payload.patientId);
        if(!(doctorExists && patientExists)){
            throw new InvalidTransaction(`patientId or doctorId doesn't exist`);
        }else{
            return await clientStore.addRecord(payload);
        }
    }

    async handleGetDetails(context, payload) {
        const clientStore = new ClientStore(context);
        const patientExists = await clientStore.patientExists(payload.patientId);
        if (patientExists) {
            return await clientStore.getPatient(payload.patientId);
        }
        else {
            throw new InvalidTransaction(`patient with patientId : ${payload.patientId} does not exists!`);
        }
    }

    async handleTransaction(context, payload){
        const clientStore = new ClientStore(context);
        const doctorExists= await clientStore.doctorExists(payload.doctorId);
        const patientExists= await clientStore.patientExists(payload.patientId);
        if(!(doctorExists && patientExists)){
            throw new InvalidTransaction(`patientId or doctorId doesn't exist`);
        }else{
            return await clientStore.transaction(payload);
        }
    }

    async handleSendDetails(context, payload){
        const clientStore = new ClientStore(context);
        const doctorExists= await clientStore.doctorExists(payload.doctorId);
        const patientExists= await clientStore.patientExists(payload.patientId);
        if(!(doctorExists && patientExists)){
            throw new InvalidTransaction(`patientId or doctorId doesn't exist`);
        }else{
            return await clientStore.sendDetails(payload);
        }
    }

    async apply(transactionProcessRequest, context) {
        let payload = cbor.decode(transactionProcessRequest.payload);
        switch (payload.action) {
            case 'addDoctor':
                return await this.handleAddDoctor(context, payload);
            case 'addPatient':
                return await this.handleAddPatient(context, payload);
            case 'addPrescription':
                return await this.handleAddPrescription(context, payload);
            case 'addRecord':
                return await this.handleAddRecord(context, payload);
            case 'viewDetails':
                return await this.handleGetDetails(context, payload);
            case 'transaction':
                return await this.handleTransaction(context, payload);
            case 'sendDetails':
                return await this.handleSendDetails(context,payload);
            default:
                throw new InvalidTransaction(
                    `Action must be addDoctor, addPatient, addPrescription, addRecord, transaction, viewDetails and not ${payload.action}`
                );
        }
    }
}

module.exports = healthcareHandler;



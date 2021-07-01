var { _hash } = require('./lib');
var { TP_NAMESPACE } = require('./constants');
var serialise = require('./serialiser');

class ClientStore {
    constructor(context) {
        this.context = context;
        this.timeout = 500;
    }

    async addPatient(patient) {
        const address = patientAddress(patient.patientId);
        let patientInfo = {
            patientId: patient.patientId,
            name: patient.name,
            age: patient.age,
            contact: patient.contact,
            accBalance: 1000,
            prescriptions:[],
            records:[]
        };
        let serialised = serialise(patientInfo);
        let data = Buffer.from(serialised);
        return await this.context.setState({ [address]: data }, this.timeout);
    }

    async patientExists(patientId) {
        const address = patientAddress(patientId);
        let patientInfo = await this.context.getState([address], this.timeout);
        const patient = patientInfo[address][0];
        if (patient == undefined || patient == null) {
            return false;
        } else {
            return true;
        }
    }

    async addDoctor(doctor) {
        const address = doctorAddress(doctor.doctorId);
        let doctorInfo = {
            doctorId: doctor.doctorId,
            name: doctor.name,
            specialisation:doctor.specialisation,
            age: doctor.age,
            contact: doctor.contact,
            accBalance: 10,
            patients:[]
        };
        let serialised = serialise(doctorInfo);
        let data = Buffer.from(serialised);
        return await this.context.setState({ [address]: data }, this.timeout);
    }

    async doctorExists(doctorId) {
        const address = doctorAddress(doctorId);
        let doctorInfo = await this.context.getState([address], this.timeout);
        const doctor = doctorInfo[address][0];
        if (doctor == undefined || doctor == null) {
            return false;
        } else {
            return true;
        }
    }

    async getPatient(patientId) {
        const address = patientAddress(patientId);
        let patientInfo = await this.context.getState([address], this.timeout);
        const patientData = patientInfo[address];
        if (Buffer.isBuffer(patientData)) {
            const json = patientData.toString();
            const patient = JSON.parse(json);
            return patient;
        } else {
            return undefined;
        }
    }

    async addPrescription(Prescription){
        const address = patientAddress(Prescription.patientId);
        let prescription={
            prescriptionId: Prescription.prescriptionId,
            drugName: Prescription.drugName,
            doctorId: Prescription.doctorId,
            timestamp: Prescription.timestamp
        };
        let patientInfo = await this.context.getState([address], this.timeout);
        const patientData = patientInfo[address];
        if (Buffer.isBuffer(patientData)) {
            const json = patientData.toString();
            const patient = JSON.parse(json);
            patient.prescriptions.push(prescription);
            let serialised = serialise(patient);
            let data = Buffer.from(serialised);
            return await this.context.setState({ [address]: data }, this.timeout);
        } else {
            return undefined;
        }
    }

    async addRecord(Record){
        const address = patientAddress(Record.patientId);
        let record={
            RecordId: Record.RecordId,
            disease : Record.disease,
            doctorId: Record.doctorId,
            timestamp: Record.timestamp
        };
        let patientInfo = await this.context.getState([address], this.timeout);
        const patientData = patientInfo[address];
        if (Buffer.isBuffer(patientData)) {
            const json = patientData.toString();
            const patient = JSON.parse(json);
            patient.records.push(record);
            let serialised = serialise(patient);
            let data = Buffer.from(serialised);
            return await this.context.setState({ [address]: data }, this.timeout);
        } else {
            return undefined;
        }
    }

    async sendDetails(detail){
        const address = patientAddress(detail.patientId);
        const doc = doctorAddress(detail.doctorId);
        let patientInfo = await this.context.getState([address], this.timeout);
        let docInfo = await this.context.getState([doc],this.timeout);
        const patientData = patientInfo[address];
        const docData = docInfo[doc];
        if (Buffer.isBuffer(patientData)&& Buffer.isBuffer(docData)) {
            const json = patientData.toString();
            const patient = JSON.parse(json);

            const djson = docData.toString();
            const doctor = JSON.parse(djson);

            doctor.patients.push(patient);
            let serialised = serialise(doctor);
            let data = Buffer.from(serialised);
            return await this.context.setState({ [doc]: data }, this.timeout);
        } else {
            return undefined;
        }
    }

    async transaction(detail){
        const address = patientAddress(detail.patientId);
        const doc = doctorAddress(detail.doctorId);
        let patientInfo = await this.context.getState([address], this.timeout);
        let docInfo = await this.context.getState([doc],this.timeout);
        const patientData = patientInfo[address];
        const docData = docInfo[doc];
        if (Buffer.isBuffer(patientData)&& Buffer.isBuffer(docData)) {
            const json = patientData.toString();
            const patient = JSON.parse(json);
            const djson = docData.toString();
            const doctor = JSON.parse(djson);

            patient.accBalance=parseInt(patient.accBalance)-parseInt(detail.val);
            doctor.accBalance=parseInt(doctor.accBalance)-parseInt(detail.val);

            let serialisedd = serialise(doctor);
            let datad = Buffer.from(serialisedd);
            let serialisedp = serialise(patient);
            let datap = Buffer.from(serialisedp);

            let setStatep = await this.context.setState({ [address]: datap }, this.timeout);
            let setStated = await this.context.setState({ [doc]: datad }, this.timeout);
            return setStated && setStatep;
        } else {
            return undefined;
        }
    }

}

const patientAddress = patientId => TP_NAMESPACE + '00' + _hash(patientId).substring(0, 62);
const doctorAddress = doctorId => TP_NAMESPACE + '01' + _hash(doctorId).substring(0, 62);

module.exports = ClientStore;
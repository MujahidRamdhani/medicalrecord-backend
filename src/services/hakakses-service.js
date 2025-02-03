//import { v4 as uuidv4 } from 'uuid';
//import status from 'http-status';
import pkg from 'fabric-network';
const {  Wallets, Gateway} = pkg;
//import path from 'path';
//import time from '../utils/time.js';
import fabric from '../applications/fabric.js';
import wallet from '../applications/wallet.js';
//import util from '../utils/util.js';
//import prismaClient from '../applications/database.js';

const channelName = 'hak-akses-channel';
const chaincodeName = 'hak-akses-chaincode';

const create = async (user, request) => {
    const chaincodeMethodName = 'CreateHakAkses';
    const body = request;
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    
    //console.log('idDokter', idDokter);
    
    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }
        console.log('user', user);
        // Get the contract from the network.
        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);
        
        console.log('request', request);
        const payload = {
            Id_Hak_Akses: body.Id_Hak_Akses,
            No_RM: body.No_RM,
            NIK_Pasien: body.NIK_Pasien,
            NIP_Dokter: nipDokter,
            Hak_Akses: body.Hak_Akses,
        };
console.log('payload', payload);
        const args = [
            payload.Id_Hak_Akses,
            payload.No_RM,
            payload.NIK_Pasien,
            payload.NIP_Dokter, 
            payload.Hak_Akses, 
        ];
        console.log('args', args);
        const result = await contract.submitTransaction(chaincodeMethodName, ...args);
        gateway.disconnect();
        const resultString = result.toString();
 
        return resultString 
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        throw error;
    }
};

// const createHakAksesUser = async (user, request) => {
//     const chaincodeMethodName = 'CreateHakAkses';
//     const body = request;
//     const email = user.email;
//     const role = user.role;
    
//     //console.log('idDokter', idDokter);
    
//     try {
//         const identity = await wallet.getIdentity(email);
//         if (!identity) {
//             console.log(`An identity for the user "${email}" does not exist in the wallet`);
//             console.log('Run the user enrollment script before retrying');
//             return;
//         }
//         console.log('user', user);
//         // Get the contract from the network.
//         const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);
        
//         console.log('request', request);
//         const noRM = `RM-${body.nikPasien}`;
//         const idHak = `${body.nikPasien}${body.nipDokter}`;
//         const payload = {
//             Id_Hak_Akses: idHak,
//             No_RM: noRM,
//             NIK_Pasien: body.nikPasien,
//             NIP_Dokter: body.nipDokter,
//             Hak_Akses: "True",
//         };
// console.log('payload', payload);
//         const args = [
//             payload.Id_Hak_Akses,
//             payload.No_RM,
//             payload.NIK_Pasien,
//             payload.NIP_Dokter, 
//             payload.Hak_Akses, 
//         ];
//         console.log('args', args);
//         const result = await contract.submitTransaction(chaincodeMethodName, ...args);
//         gateway.disconnect();
//         const resultString = result.toString();
 
//         return resultString 
//     } catch (error) {
//         console.error(`Failed to submit transaction: ${error}`);
//         throw error;
//     }
// };

const createHakAksesUser = async (user, request) => {
    const chaincodeMethodNameCreate = 'CreateHakAkses';
    const chaincodeMethodNameRead = 'ReadAsset';
    const chaincodeMethodNameUpdateStatus = 'UpdateStatusHakAkses';
    const body = request;
    const email = user.email;
    const role = user.role;

    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        // Get the contract from the network
        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

        const noRM = `RM-${body.nikPasien}`;
        const idHak = `${body.nikPasien}${body.nipDokter}`;

        try {
            // Check if the access ID already exists
            const existingHakAkses = await contract.evaluateTransaction(chaincodeMethodNameRead, idHak);
            if (existingHakAkses && existingHakAkses.length > 0) {
                const existingData = JSON.parse(existingHakAkses.toString());

                if (existingData.Hak_Akses === "False") {
                    // Update hak akses to true
                    const updateResult = await contract.submitTransaction(
                        chaincodeMethodNameUpdateStatus,
                        idHak,
                        "True"
                    );
                    console.log('Hak akses updated to true:', updateResult.toString());
                    gateway.disconnect();
                    return updateResult.toString();
                } else {
                    console.log('Hak akses already exists and is true:', existingData);
                    gateway.disconnect();
                    return JSON.stringify(existingData);
                }
            }
        } catch (readError) {
            console.log(`Hak akses not found. Creating a new one: ${readError.message}`);
        }

        // If ID doesn't exist, create a new hak akses
        const payload = {
            Id_Hak_Akses: idHak,
            No_RM: noRM,
            NIK_Pasien: body.nikPasien,
            NIP_Dokter: body.nipDokter,
            Hak_Akses: "True",
        };

        const args = [
            payload.Id_Hak_Akses,
            payload.No_RM,
            payload.NIK_Pasien,
            payload.NIP_Dokter,
            payload.Hak_Akses,
        ];

        const result = await contract.submitTransaction(chaincodeMethodNameCreate, ...args);
        console.log('New hak akses created:', result.toString());
        gateway.disconnect();
        return result.toString();

    } catch (error) {
        console.error(`Failed to process transaction: ${error}`);
        throw error;
    }
};


const update = async (user, request, Id_Hak_Akses) => {
    const chaincodeMethodName = 'UpdateStatusHakAkses';
    const body = request;
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    
    //console.log('idDokter', idDokter);
    
    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

        const payload = {
            Id_Hak_Akses: Id_Hak_Akses,
            Hak_Akses: body.Hak_Akses,
        };

        const args = [
            payload.Id_Hak_Akses,
            payload.Hak_Akses,
        ];

        const result = await contract.submitTransaction(chaincodeMethodName, ...args);
        gateway.disconnect();
        const resultString = result.toString();
 
        return resultString 
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        throw error;
    }
};

const findOne = async (user, Id_Hak_Akses) => {
    const chaincodeMethodName = 'ReadAsset';
    const email = user.email;
    const role = user.role;

    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

        const payload = {
            Id_Hak_Akses: Id_Hak_Akses
        };

        const args = [
            payload.Id_Hak_Akses
        ];

        const result = await contract.submitTransaction(chaincodeMethodName, ...args);
        gateway.disconnect();
        const resultJSON = JSON.parse(result.toString());
        return resultJSON;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        throw error;
    }
};

const findAllFilterByNIPDokter = async (user) => {
    const chaincodeMethodName = 'GetAllAssets';
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);
        const result = await contract.evaluateTransaction(chaincodeMethodName);
        gateway.disconnect();

        // Parse and log the response
        const resultArray = JSON.parse(result.toString());
        console.log("Full Chaincode Response:", resultArray);

        // Check if response is an array
        if (!Array.isArray(resultArray)) {
            console.error("Unexpected response structure:", resultArray);
            throw new Error("Invalid response format: Expected an array.");
        }

        // Filter by 'dokterId'
        const filteredData = resultArray.filter(item => item.NIP_Dokter === nipDokter);
        return filteredData;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    }
};

const findAllFilterByDokterFilterHakAksesTrue = async (user) => {
    const chaincodeMethodName = 'GetAllAssets';
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);
        const result = await contract.evaluateTransaction(chaincodeMethodName);
        gateway.disconnect();

        // Parse and log the response
        const resultArray = JSON.parse(result.toString());
        console.log("Full Chaincode Response:", resultArray);

        // Check if response is an array
        if (!Array.isArray(resultArray)) {
            console.error("Unexpected response structure:", resultArray);
            throw new Error("Invalid response format: Expected an array.");
        }

        // Filter by 'dokterId'
        const filteredData = resultArray.filter(item => item.NIP_Dokter === nipDokter && item.Hak_Akses === "True");
        return filteredData;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    }
};

const findAllFilterByPasienNIK = async (user) => {
    const chaincodeMethodName = 'GetAllAssets';
    const email = user.email;
    const role = user.role;
    const pasienNIK = user.idRole;
    try {
        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);
        const result = await contract.evaluateTransaction(chaincodeMethodName);
        gateway.disconnect();

        // Parse and log the response
        const resultArray = JSON.parse(result.toString());
        console.log("Full Chaincode Response:", resultArray);

        // Check if response is an array
        if (!Array.isArray(resultArray)) {
            console.error("Unexpected response structure:", resultArray);
            throw new Error("Invalid response format: Expected an array.");
        }

        // Filter by 'nikPasien'
        const filteredData = resultArray.filter(item => item.NIK_Pasien === pasienNIK);
        return filteredData;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    }
};

const historyHakAkses = async (user, Id_Hak_Akses) => {
    const chaincodeMethodName = 'GetHistoryById';
    // Check to see if we've already enrolled the user.
    const email = user.email
    const role = user.role
    const identity = await wallet.getIdentity(email);
    if (!identity) {
        console.log(`An identity for the user "${email}" does not exist in the wallet`);
        console.log('Run the user enrollment script before retrying');
        return;
    }

    // Get the contract from the network.
    const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

   
  // queryAllAssets transaction 
   const result = await contract.evaluateTransaction(chaincodeMethodName, Id_Hak_Akses);

    // Disconnect from the gateway.
    gateway.disconnect();

    const resultJSON = JSON.parse(result.toString());

    return resultJSON
};


const hakAksesServices = { create, update, findAllFilterByNIPDokter, findAllFilterByPasienNIK , 
    findOne, historyHakAkses, findAllFilterByDokterFilterHakAksesTrue, createHakAksesUser};
export default hakAksesServices;

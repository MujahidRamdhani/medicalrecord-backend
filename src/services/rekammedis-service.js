//import { v4 as uuidv4 } from 'uuid';
//import status from 'http-status';
import pkg from 'fabric-network';
const {  Wallets, Gateway} = pkg;
//import path from 'path';
import time from '../utils/time.js';
import fabric from '../applications/fabric.js';
import wallet from '../applications/wallet.js';
//import util from '../utils/util.js';
import prismaClient from '../applications/database.js';

const channelName = 'rekam-medis-channel';
const chaincodeName = 'rekam-medis-chaincode';

const create = async (user, request) => {
    const chaincodeMethodName = 'CreateRekamMedis';
    const body = request;
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    
    console.log('nipDokter', nipDokter);
    
    try {
        const dokterWithDetails = await prismaClient.dokter.findUnique({
            where: { nip: nipDokter },
            select: {
              nama: true, // Nama dokter
              pelayananKesehatan: {
                select: {
                  nama: true, // Nama pelayanan kesehatan
                },
              },
            },
          });
          
          console.log(dokterWithDetails);

        const { nama_dokter, nama_pelayanan_kesehatan } = {
            nama_dokter: dokterWithDetails?.nama || null,
            nama_pelayanan_kesehatan: dokterWithDetails?.pelayananKesehatan?.nama || null,
          };

          
          //console.log('dokterWithPelayanan', dokterWithPelayanan);
          //console.log('adminadminPelayananWithPelayananKesehatanPela', adminPelayananWithPelayananKesehatan);
          //console.log('getKodePelayanan', getKodePelayanan);
          

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
            No_RM: body.No_RM,
            NIK_Pasien: body.NIK_Pasien,
            Nama_Pasien: body.Nama_Pasien,
            Tgl_Periksa: time.getCurrentTime(),
            Keluhan_Utama: body.Keluhan_Utama,
            Keluhan_Tambahan: body.Keluhan_Tambahan,
            Lama_Sakit: body.Lama_Sakit,
            Alergi: body.Alergi,
            Tekanan_Darah: body.Tekanan_Darah,
            Tinggi_Badan: body.Tinggi_Badan,
            Berat_Badan: body.Berat_Badan,
            Detak_Nadi: body.Detak_Nadi,
            Pernafasan: body.Pernafasan,
            Suhu: body.Suhu,
            Detak_Jantung: body.Detak_Jantung,
            Diagnosis: body.Diagnosis,
            Keterangan_Diagnosis: body.Keterangan_Diagnosis,
            Tindakan: body.Tindakan,
            Obat_Diberikan: body.Obat_Diberikan,
            NIP_Dokter: nipDokter,
            Nama_Dokter: nama_dokter,
            Nama_Pelayanan_Kesehatan: nama_pelayanan_kesehatan,
        };
console.log('payload', payload);
        const args = [
            payload.No_RM,
            payload.NIK_Pasien,
            payload.Nama_Pasien,
            payload.Tgl_Periksa,
            payload.Keluhan_Utama,
            payload.Keluhan_Tambahan,
            payload.Lama_Sakit,
            payload.Alergi,
            payload.Tekanan_Darah,
            payload.Tinggi_Badan,
            payload.Berat_Badan,
            payload.Detak_Nadi,
            payload.Pernafasan,
            payload.Suhu,
            payload.Detak_Jantung,
            payload.Diagnosis,
            payload.Keterangan_Diagnosis,
            payload.Tindakan,
            payload.Obat_Diberikan,
            payload.NIP_Dokter,
            payload.Nama_Dokter,
            payload.Nama_Pelayanan_Kesehatan,
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

const update = async (user, request, No_RM) => {
    const chaincodeMethodName = 'UpdateRekamMedis';
    const body = request;
    const email = user.email;
    const role = user.role;
    const nipDokter = user.idRole;
    
    //console.log('idDokter', idDokter);
    
    try {
        const dokterWithDetails = await prismaClient.dokter.findUnique({
            where: { nip: nipDokter },
            select: {
              nama: true, // Nama dokter
              pelayananKesehatan: {
                select: {
                  nama: true, // Nama pelayanan kesehatan
                },
              },
            },
          });
          
          console.log(dokterWithDetails);

        const { nama_dokter, nama_pelayanan_kesehatan } = {
            nama_dokter: dokterWithDetails?.nama || null,
            nama_pelayanan_kesehatan: dokterWithDetails?.pelayananKesehatan?.nama || null,
          };

        const identity = await wallet.getIdentity(email);
        if (!identity) {
            console.log(`An identity for the user "${email}" does not exist in the wallet`);
            console.log('Run the user enrollment script before retrying');
            return;
        }

        const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

        const payload = {
            No_RM: body.No_RM,
            NIK_Pasien: body.NIK_Pasien,
            Nama_Pasien: body.Nama_Pasien,
            Tgl_Periksa: time.getCurrentTime(),
            Keluhan_Utama: body.Keluhan_Utama,
            Keluhan_Tambahan: body.Keluhan_Tambahan,
            Lama_Sakit: body.Lama_Sakit,
            Alergi: body.Alergi,
            Tekanan_Darah: body.Tekanan_Darah,
            Tinggi_Badan: body.Tinggi_Badan,
            Berat_Badan: body.Berat_Badan,
            Detak_Nadi: body.Detak_Nadi,
            Pernafasan: body.Pernafasan,
            Suhu: body.Suhu,
            Detak_Jantung: body.Detak_Jantung,
            Diagnosis: body.Diagnosis,
            Keterangan_Diagnosis: body.Keterangan_Diagnosis,
            Tindakan: body.Tindakan,
            Obat_Diberikan: body.Obat_Diberikan,
            NIP_Dokter: nipDokter,
            Nama_Dokter: nama_dokter,
            Nama_Pelayanan_Kesehatan: nama_pelayanan_kesehatan,
        };

        const args = [
            payload.No_RM,
            payload.NIK_Pasien,
            payload.Nama_Pasien,
            payload.Tgl_Periksa,
            payload.Keluhan_Utama,
            payload.Keluhan_Tambahan,
            payload.Lama_Sakit,
            payload.Alergi,
            payload.Tekanan_Darah,
            payload.Tinggi_Badan,
            payload.Berat_Badan,
            payload.Detak_Nadi,
            payload.Pernafasan,
            payload.Suhu,
            payload.Detak_Jantung,
            payload.Diagnosis,
            payload.Keterangan_Diagnosis,
            payload.Tindakan,
            payload.Obat_Diberikan,
            payload.NIP_Dokter,
            payload.Nama_Dokter,
            payload.Nama_Pelayanan_Kesehatan,
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

const findOne = async (user, No_RM) => {
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
            No_RM: No_RM
        };

        const args = [
            payload.No_RM
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

const findAll = async (user) => {
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

const getAllRekamMedisByPasienNIK = async (user, NIK_Pasien) => {
    const chaincodeMethodName = 'GetAllAssets';
    const email = user.email;
    const role = user.role;
    const pasienNIK = NIK_Pasien;
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

        // Filter by 
        const filteredData = resultArray.filter(item => item.NIK_Pasien === pasienNIK);
        console.log('filter', filteredData)
        return filteredData;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    }
};

const historyRekamMedis = async (user, No_RM) => {
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
   const result = await contract.evaluateTransaction(chaincodeMethodName, No_RM);

    // Disconnect from the gateway.
    gateway.disconnect();

    const resultJSON = JSON.parse(result.toString());

    return resultJSON
};

const historyRekamMedisFilterByPasienNIK = async (user, No_RM, NIK_Pasien) => {
    const chaincodeMethodName = 'GetHistoryById';
    // Check to see if we've already enrolled the user.
    const email = user.email
    const role = user.role
    const pasienNIK = NIK_Pasien

    const identity = await wallet.getIdentity(email);
    if (!identity) {
        console.log(`An identity for the user "${email}" does not exist in the wallet`);
        console.log('Run the user enrollment script before retrying');
        return;
    }

    // Get the contract from the network.
    const { contract, gateway } = await fabric.getContract(email, role, channelName, chaincodeName);

   
  // queryAllAssets transaction 
   const result = await contract.evaluateTransaction(chaincodeMethodName, No_RM);

    // Disconnect from the gateway.
    gateway.disconnect();

    const resultArray = JSON.parse(result.toString());

    // Filter by 'nikPasien'
    const filteredData = resultArray.filter(item => item.NIK_Pasien === pasienNIK);
    return filteredData;
};


const rekamMedisServices = { create, update, findAll , findOne, 
    historyRekamMedis, historyRekamMedisFilterByPasienNIK, getAllRekamMedisByPasienNIK};
export default rekamMedisServices;

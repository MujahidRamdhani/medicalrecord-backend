import path from 'path';
import fs from 'fs/promises';
//import { v4 as uuidv4 } from 'uuid';
// const readFile = async (pathFilename) => {
//   try {
//     const result = await fs.readFile(pathFilename, 'utf8');
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

import { fileURLToPath } from 'url';
// Mendapatkan __dirname di ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const getAttributeName = (type) => {
  console.log("data",type);
 
  if (typeof type !== 'string') {
    throw new Error('Invalid type: type must be a string', type);
  }

  type = type.toLowerCase();

  if (type === 'adminsistem') {
    return {
      roleName: 'adminsistem',
      tableName: 'adminsistem',
      databaseRoleName: 'ADMINSISTEM',
      organizationName: 'AdminSistem',
      affiliationName: 'adminsistem.rekammedis',
    };
  }

  if (type === 'adminpelayanan') {
    return {
      roleName: 'adminpelayanan',
      tableName: 'adminpelayanan',
      databaseRoleName: 'ADMINPELAYANAN',
      organizationName: 'AdminPelayanan',
      affiliationName: 'adminpelayanan.rekammedis',
    };
  }

  if (type === 'dokter') {
    return {
      roleName: 'dokter',
      tableName: 'dokter',
      databaseRoleName: 'DOKTER',
      organizationName: 'Dokter',
      affiliationName: 'dokter.rekammedis',
    };
  }
  if (type === 'pasien') {
    return {
      roleName: 'pasien',
      tableName: 'pasien',
      databaseRoleName: 'PASIEN',
      organizationName: 'Pasien',
      affiliationName: 'pasien.rekammedis',
    };
  }

  throw new Error('Invalid type');
};




async function readConfigFile(pathFilename) {
  try {
    const result = await fs.readFile(pathFilename, 'utf-8');
    return result;
  } catch (error) {
    console.error('Error reading file:', error);
  }
}


const readFile = async (pathFilename) => {
  try {
    const result = await fs.readFile(pathFilename, 'utf8');
    return result;
  } catch (error) {
    console.error(error);
  }
};



async function getNetworkInfo(organizationName) {
  
    const fabricConfig = await readFile('src/config/fabric-config.json');;

    console.log(fabricConfig)
    const { email, password, msp, connectionProfile } = JSON.parse(fabricConfig).orgs[organizationName];;
    const { certificateAuthorities } = connectionProfile;
    const { url, caName, tlsCACerts, } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];
    const caTLSCACerts = tlsCACerts.pem;
    const caUrl = url;
    return {msp, caTLSCACerts, caUrl, caName,  password, connectionProfile, email}
}


async function getNetworkInfoAdmin(organizationName) {
  
  const fabricConfig = await readFile('src/config/fabric-config.json');;

  console.log(fabricConfig)
  const { email, password, msp, connectionProfile } = JSON.parse(fabricConfig).orgs[organizationName];;
  const { certificateAuthorities } = connectionProfile;
  const { url, caName, tlsCACerts, } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];
  const caTLSCACerts = tlsCACerts.pem;
  const caUrl = url;
  return {msp, caTLSCACerts, caUrl, caName,  password, connectionProfile, email}
}


const util = { getAttributeName, getNetworkInfo, getNetworkInfoAdmin};
export default util;

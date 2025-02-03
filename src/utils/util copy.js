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

 
  if (typeof type !== 'string') {
    throw new Error('Invalid type: type must be a string', type);
  }

  type = type.toLowerCase();

  if (type === 'dinas') {
    return {
      roleName: 'dinas',
      tableName: 'dinas',
      databaseRoleName: 'DINAS',
      organizationName: 'Dinas',
      affiliationName: 'dinas.department1',
    };
  }

  if (type === 'koperasi') {
    return {
      roleName: 'koperasi',
      tableName: 'koperasi',
      databaseRoleName: 'KOPERASI',
      organizationName: 'Koperasi',
      affiliationName: 'koperasi.department1',
    };
  }

  if (type === 'petani') {
    return {
      roleName: 'petani',
      tableName: 'petani',
      databaseRoleName: 'PETANI',
      organizationName: 'Petani',
      affiliationName: 'petani.department1',
    };
  }
  if (type === 'public') {
    return {
      roleName: 'public',
      tableName: 'public',
      databaseRoleName: 'PUBLIC',
      organizationName: 'Public',
      affiliationName: 'public.department1',
    };
  }

  throw new Error('Invalid type');
};



async function getNetworkInfo(organizationName) {
    const ccpPath = path.resolve(__dirname, 'D:/palm_mapping/palm-mapping/prisma/src/config/fabric-config.json'); 
    const ccp = JSON.parse(await fs.readFile(ccpPath, 'utf8'));
    const {email, password,  msp, connectionProfile } = ccp.orgs[organizationName];
    const { certificateAuthorities } = connectionProfile;
    const { url, caName, tlsCACerts, } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];
    const caTLSCACerts = tlsCACerts.pem;
    const caUrl = url;
    return {msp, caTLSCACerts, caUrl, caName, ccp, password, connectionProfile, email}
}



// const getOrganizationInfo = async (organizationName) => {
//   const fabricConfig = await readFile('src/config/fabric-config.json');
//   const { email, password, msp, connectionProfile } = JSON.parse(fabricConfig).orgs[organizationName];
//   const { certificateAuthorities } = connectionProfile;
//   const { url, caName, httpOptions, tlsCACerts } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];

//   return {
//     email,
//     password,
//     msp,
//     certificateAuthority: {
//       url,
//       caName,
//       httpOptions,
//       tlsCACerts,
//     },
//     connectionProfile,
//   };
// };



const util = { getAttributeName, getNetworkInfo};
export default util;

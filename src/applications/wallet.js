import pkg from 'fabric-network';
const { Wallets } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Mendapatkan __dirname di ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// async function getNetworkConfig(organizationName) {
//     const ccpPath = path.resolve(__dirname, 'C:/Users/Administrator/Documents/program/authentication/backend/controllers/fabric.json');
//     const ccp = JSON.parse(await fs.readFile(ccpPath, 'utf8'));
//     const { email, password, msp, connectionProfile } = ccp.orgs[organizationName];
//     const { certificateAuthorities } = connectionProfile;
//     const { url, caName, httpOptions, tlsCACerts } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];
//     const caTLSCACerts = tlsCACerts.pem;
//     const caUrl = url;
//     return msp, caTLSCACerts, caUrl, caName
// }

async function getWallet() {
    const walletPath = path.join(process.cwd(), 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
}

async function getIdentity(userId) {
    const wallet = await getWallet();
    return await wallet.get(userId);
}

async function checkUserExists(userId) {
    const existingIdentity = await getIdentity(userId);
    if (existingIdentity) {
        throw new Error(`An identity for the user "${userId}" already exists in the wallet`);
        
    }
}

async function checkAdminExists(userId) {
    const existingIdentity = await getIdentity(userId);
    if (existingIdentity) {
        throw new Error(`An identity for the admin user "${userId}" already exists in the wallet`);
    }
}

async function createIdentity(userId, credentials, mspId) {
    
    const wallet = await getWallet();
    const x509Identity = {
        credentials: {
            certificate: credentials.certificate,
            privateKey: credentials.privateKey,
        },
        mspId: mspId,
        type: 'X.509',
    };
    
    await wallet.put(userId, x509Identity);
}

async function getAdminUserContext(adminId) {
    const adminIdentity = await getIdentity(adminId);
    if (!adminIdentity) {
        console.log(`An identity for the admin user "${adminId}" does not exist in the wallet`);
        console.log('Run the enrollAdmin.js application before retrying');
        return null;
    }
    const wallet = await getWallet();
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminId);
    return adminUser;
}

async function checkIdentity(user) {
    const identity = await getIdentity(user);
    if (!identity) {
        console.log(`An identity for the user "${user}" does not exist in the wallet`);
        console.log('Run the user enrollment script before retrying');
        throw new Error(`Identity for user "${user}" not found`);
    }
    return identity;
}

const wallet = { getWallet, getIdentity, createIdentity, checkIdentity, checkUserExists, checkAdminExists, getAdminUserContext };
export default wallet;

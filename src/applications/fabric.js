import pkg from 'fabric-network';
const { Gateway } = pkg;
import wallet from './wallet.js';
import util from '../utils/util.js';

async function connectGateway(email, role) {
    const roleMapping = {
        'adminsistem': 'AdminSistem',
        'adminpelayanan': 'AdminPelayanan',
        'dokter': 'Dokter',
        'pasien': 'Pasien'
    };

    console.log('role',role);

    const organizationName = roleMapping[role.toLowerCase()] || util.getAttributeName(role);
    const {connectionProfile} = await util.getNetworkInfo(organizationName);
    const userWallet = await wallet.getWallet();
    const gateway = new Gateway();

    console.log('OrganizationName', organizationName);

    await gateway.connect(connectionProfile, {
        wallet: userWallet,
        identity: email,
        discovery: { enabled: true, asLocalhost: true }
    });

    return gateway;
}

async function getContract(email, role, channelName, chaincodeName) {
    const gateway = await connectGateway(email, role);  // corrected function call
    const network = await gateway.getNetwork(channelName);
    const contractPromise = network.getContract(chaincodeName); // Return the promise directly
    const channel = network.getChannel();
    const contract =  contractPromise;
    return { contract, gateway, channel };
}

// Function to disconnect from the gateway
async function disconnectGateway(gateway) {
    await gateway.disconnect();
}

const fabric = { getContract, disconnectGateway };
export default fabric;

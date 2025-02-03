import FabricCAServices from 'fabric-ca-client';
import wallet from './wallet.js';
import util from '../utils/util.js';


async function enrollAdmin(adminId, role) {
    const { organizationName } = util.getAttributeName(role);
    const {caTLSCACerts, caUrl, password, caName, msp } = await util.getNetworkInfo(organizationName);
    const enrollmentSecret = password;
    const ca = new FabricCAServices(caUrl, { trustedRoots: caTLSCACerts, verify: false }, caName);
    const adminExists = await wallet.getIdentity(adminId);
    if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
        return
    }

    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: enrollmentSecret });
    await wallet.createIdentity(adminId, {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
    }, msp);
    return `Successfully enrolled admin user "${adminId}" and imported it into the wallet`
}

async function registerAndEnrollUser(userId, adminId, role) {
    const { organizationName, affiliation } = util.getAttributeName(role);
    const { caUrl, msp, email } = await util.getNetworkInfo(organizationName);

    console.log(`organizationName: ${organizationName}, affiliation: ${affiliation}, caUrl: ${caUrl}, userId: ${userId}`);

    const ca = new FabricCAServices(caUrl, { verify: false });
    const userExists = await wallet.getIdentity(userId);
    if (userExists) {
        console.log(`An identity for the user "${userId}" already exists in the wallet`);
        return;
    }

    const adminUser = await wallet.getAdminUserContext(email);
    if (!adminUser) {
        console.log(`Admin user context not found for email: ${email}`);
        return;
    }

    let secret;
    try {
        console.log(`Registering user with enrollmentID: ${userId} and affiliation: ${affiliation}`);
        secret = await ca.register({ affiliation: affiliation, enrollmentID: userId, role: 'client' }, adminUser);
    } catch (error) {
        if (error.code === 74) { // Handle user already registered error
            console.log(`Identity '${userId}' is already registered`);
            // Assume that if the user is already registered, we can proceed to enroll
            secret = 'dummySecret'; // Use a placeholder, we won't actually need it for enrollment
        } else {
            throw error; // Re-throw if it's a different error
        }
    }

    console.log(`Enrolling user with enrollmentID: ${userId} and secret: ${secret}`);
    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });

    await wallet.createIdentity(userId, {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
    }, msp);

    return `Successfully registered and enrolled user "${userId}" and imported it into the wallet`;
}



const invoke = { enrollAdmin, registerAndEnrollUser };
export default invoke;


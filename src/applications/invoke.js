import FabricCAServices from 'fabric-ca-client';
import wallet from './wallet.js';
import util from '../utils/util.js';
import userService from '../services/user-service.js';

async function enrollAdmin(adminId, role) {
    const { organizationName } = util.getAttributeName(role);
    const {caTLSCACerts, caUrl, password, caName, msp, email } = await util.getNetworkInfoAdmin(organizationName);
    const enrollmentSecret = password;
    const ca = new FabricCAServices(caUrl, { trustedRoots: caTLSCACerts, verify: false }, caName);
    const adminExists = await wallet.getIdentity(adminId);
    if (adminExists) {
        throw new ResponseError(403, `Identitas untuk pengguna : "${adminId}" sudah ada di dalam wallet`);
    }

    const enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: enrollmentSecret });
    await wallet.createIdentity(adminId, {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
    }, msp);
    
    await userService.updateStatusWallet(adminId)
    return `Successfully enrolled admin user "${adminId}" and imported it into the wallet`
}

async function registerAndEnrollUser(userId, role) {
    const { organizationName, affiliation } = util.getAttributeName(role);
    const { caUrl, msp, email } = await util.getNetworkInfo(organizationName);
   

    const ca = new FabricCAServices(caUrl, { verify: false });
    const userExists = await wallet.getIdentity(userId);
console.log('email:', email)

    if (userExists) {
        throw new ResponseError(401,`Identitas untuk pengguna "${userId}"  sudah ada di dalam wallet`)
    }

    const adminUser = await wallet.getAdminUserContext(email);
    if (!adminUser) {
        throw new ResponseError(401,`Pengguna admin tidak ditemukan untuk  email: ${email}`)
    }

    console.log('userId:', userId)
    
    let secret;
    try {
        secret = await ca.register({ affiliation: affiliation, enrollmentID: userId, role: 'client' }, adminUser);

        console.log('affiliation:', affiliation)
        console.log('secret:', secret)
        
    } catch (error) {
        if (error.code === 74) { 
            throw new ResponseError(401,`Identitas '${userId}' sudah terdaftar`)
        } else {
            throw error; 
        }
    }
    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });

    await wallet.createIdentity(userId, {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
    }, msp);

    await userService.updateStatusWallet(userId)

    return `Berhasil Register dan Enroll Certificate Authory "${userId}" dan disimpan dalam wallet`;
}





const invoke = { enrollAdmin, registerAndEnrollUser };
export default invoke;


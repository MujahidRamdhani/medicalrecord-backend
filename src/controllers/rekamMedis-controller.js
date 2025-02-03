
import status from 'http-status';
import rekamMedisServices from '../services/rekammedis-service.js';
import hakAksesServices from '../services/hakakses-service.js';
import userService from '../services/user-service.js';
//import util from '../utils/util.js';

const createRekamMedis = async (req, res, next)  => {
    try {
        const user = req.user;
        const request = req.body;
        
        const result = await rekamMedisServices.create(user, request)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

// const createAndUpdateRekamMedis = async (req, res, next)  => {
//     try {
//         const user = req.user;
//         const request = req.body;
//         const No_RM = await rekamMedisServices.findOne(user, request.No_RM)
//         console.log('norm', No_RM)
//         let result;

//         if(!No_RM){
//              result = await rekamMedisServices.create(user, request)
//         }
//         else{
//              result = await rekamMedisServices.update(user, request, request.No_RM)
//         }
        
//         res.status(status.OK).json({
//             status: `${status.OK} ${status[status.OK]}`,
//             data: result,
//           });
//     } catch (error) { 
//         next(error);
//     }
// }

// const createAndUpdateRekamMedis = async (req, res, next) => {
//     try {
//       const user = req.user;
//       const request = req.body;
  
//       // Cari No_RM untuk menentukan apakah membuat atau memperbarui rekam medis
//       const No_RM = await rekamMedisServices.findOne(user, request.No_RM);
//       console.log('noRM yang diterima', No_RM);
//       let result;
  
//       if (!No_RM) {
//         // Buat rekam medis baru
//         result = await rekamMedisServices.create(user, request);
//       } else {
//         // Perbarui rekam medis yang ada
//         result = await rekamMedisServices.update(user, request, request.No_RM);
//       }
  
//       // Memanggil fungsi updateStatusJanjiTemu setelah rekam medis berhasil diproses
//       if (request.NIK_Pasien && request.NIP_Dokter) {
//         console.log('nik', request.NIK_Pasien);
//         console.log('nip', request.NIP_Dokter);
//         try {
//           await userService.updateStatusJanjiTemu(request.NIK_Pasien, request.NIP_Dokter);
//           console.log('Status janji temu berhasil diperbarui menjadi "Selesai".');
//         } catch (error) {
//           console.error('Gagal memperbarui status janji temu:', error.message);
//         }
//       } else {
//         console.warn('nikPasien atau nipDokter tidak disediakan dalam permintaan.');
//       }
  
//       res.status(status.OK).json({
//         status: `${status.OK} ${status[status.OK]}`,
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

const createAndUpdateRekamMedis = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    console.log('Memulai proses rekam medis...');
    let result;

    try {
      // Cari No_RM untuk menentukan apakah membuat atau memperbarui rekam medis
      const No_RM = await rekamMedisServices.findOne(user, request.No_RM);
      console.log('No_RM ditemukan:', No_RM);

      if (No_RM) {
        // Perbarui rekam medis yang ada
        result = await rekamMedisServices.update(user, request, request.No_RM);
        console.log('Rekam medis berhasil diperbarui:', result);
      } else {
        // Jika No_RM tidak ditemukan, buat rekam medis baru
        console.warn('No_RM tidak ditemukan. Membuat rekam medis baru...');
        result = await rekamMedisServices.create(user, request);
        console.log('Rekam medis baru berhasil dibuat:', result);
      }
    } catch (fabricError) {
      // Jika error berasal dari Hyperledger Fabric, asumsikan No_RM tidak ditemukan
      if (fabricError.message && fabricError.message.includes('does not exist')) {
        console.warn('Asset tidak ditemukan. Membuat rekam medis baru...');
        result = await rekamMedisServices.create(user, request);
        console.log('Rekam medis baru berhasil dibuat:', result);
      } else {
        // Lempar error lain yang tidak dikenali
        throw fabricError;
      }
    }

    // Memanggil fungsi updateStatusPemeriksaan setelah rekam medis berhasil diproses
    if (request.NIK_Pasien && request.NIP_Dokter) {
      try {
        await userService.updateStatusPemeriksaan(request.NIK_Pasien, request.NIP_Dokter);
        console.log('Status Pemeriksaan berhasil diperbarui menjadi "Selesai".');
      } catch (error) {
        console.error('Gagal memperbarui status Pemeriksaan:', error.message);
      }
    } else {
      console.warn('NIK_Pasien atau NIP_Dokter tidak disediakan dalam permintaan.');
    }

    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    next(error);
  }
};

const updateRekamMedis = async (req, res, next)  => {
    try {
        
        const user = req.user;
        const request = req.body;
        const No_RM = req.params.No_RM;
     
        const result = await rekamMedisServices.update(user, request, No_RM)

        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}


const getAllRekamMedisByDokterId = async (req, res, next)  => {
    try {
        const user = req.user;
        const result = await rekamMedisServices.findAll(user)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

// const getAllRekamMedisByDokterIdFilteredHakAksesTrue = async (req, res, next)  => {
//     try {
//         const user = req.user;
//         const hakAksesRecords = await hakAksesServices.findAllFilterByDokterFilterHakAksesTrue(user)
//         console.log("hakAksesRecords", hakAksesRecords)
//         const allowedNoRM = hakAksesRecords.map((record) => record.No_RM);
//         const allRekamMedis = await rekamMedisServices.findAll(user)
//         console.log('all data rm', allRekamMedis)

//         // Filter data rekam medis berdasarkan No_RM yang diizinkan
//         const filteredRekamMedis = allRekamMedis.filter((rekamMedis) =>
//             allowedNoRM.includes(rekamMedis.No_RM)
//         );
//         console.log('data rm', filteredRekamMedis)

//         res.status(status.OK).json({
//             status: `${status.OK} ${status[status.OK]}`,
//             data: filteredRekamMedis,
//           });
//     } catch (error) {
//         next(error);
//     }
// }

const getAllRekamMedisByDokterIdFilteredHakAksesTrue = async (req, res, next) => {
  try {
      const user = req.user;

      // Ambil data hak akses
      const hakAksesRecords = await hakAksesServices.findAllFilterByDokterFilterHakAksesTrue(user);
      console.log("hakAksesRecords", hakAksesRecords);

      const allowedNoRM = hakAksesRecords.map((record) => record.No_RM);

      // Ambil data lengkap rekam medis
      const allRekamMedis = await rekamMedisServices.findAll(user);
      console.log('all data rm', allRekamMedis);

      // Gabungkan data dengan Nama_Pasien
      const combinedData = hakAksesRecords.map((record) => {
          const rekamMedis = allRekamMedis.find((rm) => rm.No_RM === record.No_RM);
          return {
              ...record,
              Nama_Pasien: rekamMedis ? rekamMedis.Nama_Pasien : null,
          };
      });

      console.log('combined data', combinedData);

      res.status(status.OK).json({
          status: `${status.OK} ${status[status.OK]}`,
          data: combinedData,
      });
  } catch (error) {
      next(error);
  }
};


const historyRekamMedis = async (req, res, next)  => {
    try {
        const user = req.user;
        const No_RM = req.params.No_RM;
        const result = await rekamMedisServices.historyRekamMedis(user, No_RM)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

const historyRekamMedisFilterByPasienNIK = async (req, res, next) => {
    try {
      const user = req.user;
      const NIK_Pasien= req.params.NIK_Pasien;

      // Mengambil data rekam medis berdasarkan NIK pasien
      const response = await rekamMedisServices.getAllRekamMedisByPasienNIK(user, NIK_Pasien);
      console.log('nik', NIK_Pasien)
      console.log('respon', response[0].No_RM)
    let result;

        if (Array.isArray(response) && response.length > 0) {
            const noRM = response[0].No_RM; // Mengakses No_RM dengan aman
            if (noRM) {
                result = await rekamMedisServices.historyRekamMedisFilterByPasienNIK(user, noRM, NIK_Pasien);
            } else {
                result = "Rekam Medis Not Found 1";
            }
        } else {
            result = "Rekam Medis Not Found 2";
        }

      
  
      // Mengembalikan respons dengan status OK dan data hasil
      res.status(status.OK).json({
        status: `${status.OK} ${status[status.OK]}`,
        data: result,
      });
    } catch (error) {
      // Handling error dengan middleware `next`
      next(error);
    }
  };

  const historyRekamMedisFilterByPasienLogin = async (req, res, next) => {
    try {
        const user = req.user;
        const NIK_Pasien= user.idRole;

        // Mengambil data rekam medis berdasarkan NIK pasien
        const response = await rekamMedisServices.getAllRekamMedisByPasienNIK(user, NIK_Pasien);
        console.log('nik', NIK_Pasien)
        console.log('respon', response[0].No_RM)
        let result;

        if (Array.isArray(response) && response.length > 0) {
            const noRM = response[0].No_RM; // Mengakses No_RM dengan aman
            if (noRM) {
                result = await rekamMedisServices.historyRekamMedisFilterByPasienNIK(user, noRM, NIK_Pasien);
            } else {
                result = "Rekam Medis Not Found 1";
            }
        } else {
            result = "Rekam Medis Not Found 2";
        }

      
  
      // Mengembalikan respons dengan status OK dan data hasil
      res.status(status.OK).json({
        status: `${status.OK} ${status[status.OK]}`,
        data: result,
      });
    } catch (error) {
      // Handling error dengan middleware `next`
      next(error);
    }
  };
  

const rekamMedisController =  {createRekamMedis, createAndUpdateRekamMedis, getAllRekamMedisByDokterId, 
    updateRekamMedis, historyRekamMedis, historyRekamMedisFilterByPasienNIK,
    historyRekamMedisFilterByPasienLogin, getAllRekamMedisByDokterIdFilteredHakAksesTrue};

export default rekamMedisController



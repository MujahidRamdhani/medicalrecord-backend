
import status from 'http-status';
import hakAksesServices from '../services/hakakses-service.js';
//import util from '../utils/util.js';

const createHakAkses = async (req, res, next)  => {
    try {
        const user = req.user;
        const request = req.body;
        
        const result = await hakAksesServices.create(user, request)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

const updateHakAkses = async (req, res, next)  => {
    try {
        
        const user = req.user;
        const request = req.body;
        const Id_Hak_Akses = req.params.Id_Hak_Akses;
     
        const result = await hakAksesServices.update(user, request, Id_Hak_Akses)

        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}


const getAllHakAksesByNIPDokter = async (req, res, next)  => {
    try {
        const user = req.user;
        const result = await hakAksesServices.findAllFilterByNIPDokter(user)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

const getAllHakAksesByPasienNIK = async (req, res, next)  => {
    try {
        const user = req.user;
        const result = await hakAksesServices.findAllFilterByPasienNIK(user)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

const historyHakAkses = async (req, res, next)  => {
    try {
        const user = req.user;
        const Id_Hak_Akses = req.params.Id_Hak_Akses;
        const result = await hakAksesServices.historyHakAkses(user, Id_Hak_Akses)
        
        res.status(status.OK).json({
            status: `${status.OK} ${status[status.OK]}`,
            data: result,
          });
    } catch (error) {
        next(error);
    }
}

const hakAksesController =  {createHakAkses, getAllHakAksesByNIPDokter, getAllHakAksesByPasienNIK, updateHakAkses, historyHakAkses};

export default hakAksesController



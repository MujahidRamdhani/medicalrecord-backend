import status from 'http-status';
import invoke from '../applications/invoke.js';
// import authService from '../services/auth-service.js';
// import userService from '../services/user-service.js';


const caRegisterAdmin = async (req, res, next) => {
    try {
    const {email, role}  = req.user;

    const result = await invoke.enrollAdmin(email, role);
      res.status(status.OK).json({
        status: `${status.OK} ${status[status.OK]}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
};


const caRegisterUser = async (req, res, next) => {
  try {
    const {email, role } = req.user;
    const emailAdmin = email
    const { emailUser } = req.body; 
    const { roleUser } = req.body; 

    console.log('emailUser', emailUser);
    
    const result = await invoke.registerAndEnrollUser(emailUser, roleUser);

      res.status(status.OK).json({
        status: `${status.OK} ${status[status.OK]}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
};

const invokeController = { caRegisterAdmin, caRegisterUser };
export default invokeController;

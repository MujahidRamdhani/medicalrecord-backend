import status from 'http-status';
import authService from '../services/auth-service.js';
import prismaClient from '../applications/database.js';

const register = async (req, res, next) => {
  try {
    const { body: request } = req;

    const result = await authService.register(request);
    res.status(status.CREATED).json({
      status: `${status.CREATED} ${status[status.CREATED]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { body: request, session } = req;

    const result = await authService.login(session, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const { email } = req.user;
    console.log('user', req.user)

    const result = await authService.me(email);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { session } = req;
    await authService.logout(session);

    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
    });
  } catch (error) {
    next(error);
  }
};

const checkSession = async (req, res, next) => {
  try {
    const {session} = req; 
    console.log(session.userEmail)
    // await authService.checkSession(session);
    const akun = await prismaClient.akun.findUnique({
      where: { email: session.userEmail },
    });
    console.log('akun',akun)
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
    });
  } catch (error) {
    next(error);
  }
};

const authController = { register, login, me, logout , checkSession};
export default authController;

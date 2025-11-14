import express from 'express';
import userController from '../controller/userController';

export const routerUsers = express.Router()

routerUsers.get('/user', userController.listarUsuarios)
routerUsers.get('/adm', userController.listarAdms)
import express from "express";
import { login } from "../controller/loginController";

export const routerLogin = express.Router();

routerLogin.post("/", login);

export default routerLogin;

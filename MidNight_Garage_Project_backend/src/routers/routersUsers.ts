import express from "express";
import { listarUsuarios, criarUsuario } from "../controller/userController";

export const routerUsers = express.Router();

routerUsers.get("/", listarUsuarios);
routerUsers.post("/", criarUsuario);

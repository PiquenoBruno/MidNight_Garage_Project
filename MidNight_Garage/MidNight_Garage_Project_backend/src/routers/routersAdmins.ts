import { Router } from "express";
import admController from "../controller/admController";

export const routerAdmins = Router();

routerAdmins.get("/", admController.listarAdms);          // Listar todos
routerAdmins.post("/", admController.criarAdm);           // Criar novo admin
routerAdmins.put("/:id", admController.atualizarAdm);     // Atualizar admin
routerAdmins.delete("/:usuario_id", admController.removerAdm); // Remover admin

import express from "express";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
} from "../controller/userController";

export const routerUsers = express.Router();

// Listar todos os usuários
routerUsers.get("/", listarUsuarios);

// Criar novo usuário
routerUsers.post("/", criarUsuario);

// Atualizar usuário existente
routerUsers.put("/:id", atualizarUsuario);

// Remover usuário
routerUsers.delete("/:id", removerUsuario);

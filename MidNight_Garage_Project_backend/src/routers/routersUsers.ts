import express from "express";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
  loginUsuario, // 🔑 importar login
} from "../controller/userController";

export const routerUsers = express.Router();

// Listar todos os usuários
routerUsers.get("/", listarUsuarios);

// Criar novo usuário
routerUsers.post("/", criarUsuario);

// Login de usuário
routerUsers.post("/login", loginUsuario); // 🔑 rota de login

// Atualizar usuário existente
routerUsers.put("/:id", atualizarUsuario);

// Remover usuário
routerUsers.delete("/:id", removerUsuario);

import userModels from "../models/userModels";
import { Request, Response } from "express";

export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await userModels.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar usuários", erro: error });
  }
};

export const criarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const insertId = await userModels.criarUsuario({ nome, email, senha, telefone });
    res.status(201).json({ mensagem: "Usuário criado com sucesso", id: insertId });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar usuário", erro: error });
  }
};

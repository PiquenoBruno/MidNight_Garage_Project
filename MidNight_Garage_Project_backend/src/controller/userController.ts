import { Request, Response } from "express";
import usuariosModel from "../models/userModels";

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuariosModel.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const id = await usuariosModel.criarUsuario(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const linhasAfetadas = await usuariosModel.atualizarUsuario(Number(id), req.body);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const removerUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const linhasAfetadas = await usuariosModel.removerUsuario(Number(id));

    if (linhasAfetadas === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário" });
  }
};

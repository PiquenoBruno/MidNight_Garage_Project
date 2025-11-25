import { Request, Response } from "express";
import usuariosModel from "../models/userModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    // gera hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const id = await usuariosModel.criarUsuario({
      nome,
      email,
      senha: hashedPassword,
      telefone,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: { id, nome, email, telefone },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // busca usuário no banco
    const usuario = await usuariosModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    // compara senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida." });
    }

    // gera token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      user: { id: usuario.id, name: usuario.nome, email: usuario.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
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

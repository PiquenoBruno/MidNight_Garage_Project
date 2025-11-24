import { Request, Response } from "express";
import { connectionModel } from "../models/connectionModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Recomendo mover isso para variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || "segredo123";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário pelo email
    const [rows]: any = await connectionModel.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    // Verificando a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no login" });
  }
};

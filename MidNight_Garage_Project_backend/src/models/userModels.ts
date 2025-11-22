import { connectionModel } from "./connectionModels";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const listarUsuarios = async () => {
  const [rows] = await connectionModel.execute("SELECT * FROM usuarios");
  return rows;
};

const criarUsuario = async (dados: {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}) => {
  const [result] = await connectionModel.execute(
    "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)",
    [dados.nome, dados.email, dados.senha, dados.telefone]
  ) as [ResultSetHeader, unknown];

  return result.insertId;
};

const atualizarUsuario = async (
  id: number,
  dados: { nome?: string; email?: string; senha?: string; telefone?: string }
) => {
  const [result] = await connectionModel.execute(
    "UPDATE usuarios SET nome = ?, email = ?, senha = ?, telefone = ? WHERE id = ?",
    [dados.nome, dados.email, dados.senha, dados.telefone, id]
  ) as [ResultSetHeader, unknown];

  return result.affectedRows; // retorna quantas linhas foram alteradas
};

const removerUsuario = async (id: number) => {
  const [result] = await connectionModel.execute(
    "DELETE FROM usuarios WHERE id = ?",
    [id]
  ) as [ResultSetHeader, unknown];

  return result.affectedRows; // retorna quantas linhas foram removidas
};

// 🔑 novo método para login
const buscarPorEmail = async (email: string) => {
  const [rows] = await connectionModel.execute(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  ) as [RowDataPacket[], unknown];

  return rows[0]; // retorna o primeiro usuário encontrado
};

export default {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario,
  buscarPorEmail, // agora disponível para o controller
};

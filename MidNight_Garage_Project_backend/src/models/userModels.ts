import { connectionModel } from "./connectionModels";
import { ResultSetHeader } from "mysql2";

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

export default {
  listarUsuarios,
  criarUsuario,
};

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "8642B.f.t13062005",
  database: "garage",
});

// Listar todos os administradores
const listarAdms = async () => {
  const [rows] = await pool.query(`
    SELECT u.id, u.nome, u.email, true AS admin
    FROM usuarios u
    INNER JOIN administradores a ON u.id = a.usuario_id
  `);
  return rows;
};

// Criar administrador (promover usuário existente)
const criarAdm = async (usuario_id: number) => {
  await pool.query("INSERT INTO administradores (usuario_id) VALUES (?)", [usuario_id]);
  return { usuario_id, admin: true };
};

// Atualizar administrador (exemplo: trocar usuário_id)
const atualizarAdm = async (id: number, novoUsuarioId: number) => {
  await pool.query("UPDATE administradores SET usuario_id = ? WHERE id = ?", [novoUsuarioId, id]);
  return { id, usuario_id: novoUsuarioId, admin: true };
};

// Remover administrador (rebaixar para usuário comum)
const removerAdm = async (usuario_id: number) => {
  await pool.query("DELETE FROM administradores WHERE usuario_id = ?", [usuario_id]);
  return { usuario_id, admin: false };
};

export default {
  listarAdms,
  criarAdm,
  atualizarAdm,
  removerAdm,
};

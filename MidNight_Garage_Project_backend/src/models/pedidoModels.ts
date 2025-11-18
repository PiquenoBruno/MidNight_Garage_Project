import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "8642B.f.t13062005",
  database: "garage",
});

// Listar todos os pedidos com nome do usuário e veículo
const listarPedidos = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.id,
      u.nome AS usuario_nome,
      v.name AS veiculo_nome,
      p.data_pedido,
      p.status
    FROM pedidos p
    INNER JOIN usuarios u ON p.usuario_id = u.id
    INNER JOIN veiculos v ON p.veiculo_id = v.id
    ORDER BY p.data_pedido DESC
  `);
  return rows;
};

// Criar novo pedido
const criarPedido = async (
  usuario_id: number,
  veiculo_id: number,
  data_pedido: string
) => {
  await pool.query(
    "INSERT INTO pedidos (usuario_id, veiculo_id, data_pedido) VALUES (?, ?, ?)",
    [usuario_id, veiculo_id, data_pedido]
  );
  return { usuario_id, veiculo_id, data_pedido, status: "pendente" };
};

// Atualizar status do pedido
const atualizarStatus = async (id: number, status: string) => {
  await pool.query("UPDATE pedidos SET status = ? WHERE id = ?", [status, id]);
  return { id, status };
};

// Remover pedido
const removerPedido = async (id: number) => {
  await pool.query("DELETE FROM pedidos WHERE id = ?", [id]);
  return { id, removido: true };
};

export default {
  listarPedidos,
  criarPedido,
  atualizarStatus,
  removerPedido,
};

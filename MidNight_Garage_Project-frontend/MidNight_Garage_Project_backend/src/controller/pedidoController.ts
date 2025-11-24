import { connectionModel } from "../models/connectionModels";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ========================================
// LISTAR TODOS OS PEDIDOS
// ========================================
const listarPedidos = async () => {
  const [rows] = await connectionModel.execute<RowDataPacket[]>(`
    SELECT 
      p.id,
      u.nome AS usuario_nome,
      u.telefone AS usuario_telefone,
      v.name AS veiculo_nome,
      p.data_pedido,
      p.status
    FROM pedidos p
    LEFT JOIN usuarios u ON u.id = p.usuario_id
    LEFT JOIN veiculos v ON v.id = p.veiculo_id
    ORDER BY p.id DESC
  `);

  return rows;
};

// ========================================
// LISTAR PEDIDOS POR USUÁRIO
// ========================================
const listarPedidosPorUsuario = async (usuarioId: number) => {
  const [rows] = await connectionModel.execute<RowDataPacket[]>(
    `
    SELECT 
      p.id,
      u.nome AS usuario_nome,
      u.telefone AS usuario_telefone,
      v.name AS veiculo_nome,
      p.data_pedido,
      p.status
    FROM pedidos p
    LEFT JOIN usuarios u ON u.id = p.usuario_id
    LEFT JOIN veiculos v ON v.id = p.veiculo_id
    WHERE p.usuario_id = ?
    ORDER BY p.id DESC
  `,
    [usuarioId]
  );

  return rows;
};

// ========================================
// CRIAR NOVO PEDIDO
// ========================================
const criarPedido = async (usuario_id: number, veiculo_id: number) => {
  const [result] = await connectionModel.execute<ResultSetHeader>(
    "INSERT INTO pedidos (usuario_id, veiculo_id, data_pedido, status) VALUES (?, ?, NOW(), 'pendente')",
    [usuario_id, veiculo_id]
  );

  return {
    id: result.insertId,
    usuario_id,
    veiculo_id,
    status: "pendente",
  };
};

// ========================================
// ATUALIZAR STATUS DO PEDIDO
// ========================================
const atualizarStatus = async (id: number, status: string) => {
  const [result] = await connectionModel.execute<ResultSetHeader>(
    "UPDATE pedidos SET status = ? WHERE id = ?",
    [status, id]
  );

  return { affectedRows: result.affectedRows, id, status };
};

// ========================================
// REMOVER PEDIDO
// ========================================
const removerPedido = async (id: number) => {
  const [result] = await connectionModel.execute<ResultSetHeader>(
    "DELETE FROM pedidos WHERE id = ?",
    [id]
  );

  return { affectedRows: result.affectedRows, id };
};

export default {
  listarPedidos,
  listarPedidosPorUsuario,
  criarPedido,
  atualizarStatus,
  removerPedido,
};

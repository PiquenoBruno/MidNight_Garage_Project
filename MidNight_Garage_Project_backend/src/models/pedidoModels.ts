import { connectionModel } from "./connectionModels";
import { ResultSetHeader } from "mysql2";

// Listar todos os pedidos com JOIN
const listarPedidos = async () => {
  const [rows] = await connectionModel.execute(`
    SELECT 
      p.id,
      u.nome AS usuario_nome,
      u.telefone AS usuario_telefone,

      -- CORRIGIDO AQUI (antes era v.nome)
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

// Criar novo pedido
const criarPedido = async (usuario_id: number, veiculo_id: number) => {
  const [result] = await connectionModel.execute(
    "INSERT INTO pedidos (usuario_id, veiculo_id, data_pedido, status) VALUES (?, ?, NOW(), 'pendente')",
    [usuario_id, veiculo_id]
  ) as [ResultSetHeader, unknown];

  return {
    id: result.insertId,
    usuario_id,
    veiculo_id,
    status: "pendente",
  };
};

// Atualizar status
const atualizarStatus = async (id: number, status: string) => {
  const [result] = await connectionModel.execute(
    "UPDATE pedidos SET status = ? WHERE id = ?",
    [status, id]
  ) as [ResultSetHeader, unknown];

  return { affectedRows: result.affectedRows, id, status };
};

// Remover pedido
const removerPedido = async (id: number) => {
  const [result] = await connectionModel.execute(
    "DELETE FROM pedidos WHERE id = ?",
    [id]
  ) as [ResultSetHeader, unknown];

  return { affectedRows: result.affectedRows, id };
};

export default {
  listarPedidos,
  criarPedido,
  atualizarStatus,
  removerPedido,
};

export type StatusPedido = "pendente" | "aprovado" | "cancelado";

export interface Pedido {
  id: number;
  usuario_id: number;
  usuario_nome: string;
  usuario_telefone: string;
  veiculo_id: number;
  veiculo_nome: string;
  data_pedido: string;
  status: StatusPedido;
}

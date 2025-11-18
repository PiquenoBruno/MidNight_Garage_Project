export interface Pedido {
  id?: number;
  usuario_id: number;
  veiculo_id: number;
  data_pedido: string;
  status?: "pendente" | "aprovado" | "cancelado";
}

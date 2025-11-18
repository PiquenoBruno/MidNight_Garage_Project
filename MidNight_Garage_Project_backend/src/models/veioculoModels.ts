import { connectionModel } from "./connectionModels";
import { Veiculo } from "../interfaces/types";

// =====================
// LISTAR (opcionalmente por type)
// =====================
const listarVeiculos = async (type?: string) => {
  let query = "SELECT * FROM veiculos";
  const params: any[] = [];

  if (type) {
    query += " WHERE type = ?";
    params.push(type);
  }

  const [result] = await connectionModel.execute(query, params);
  return result;
};

// =====================
// NOVO VEÍCULO
// =====================
const novoVeiculo = async (body: Veiculo) => {
  const { type, name, brand, year, price, image, description, vendido } = body;

  const query = `
    INSERT INTO veiculos (type, name, brand, year, price, image, description, vendido)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [novo] = await connectionModel.execute(query, [
    type,
    name,
    brand,
    year,
    price,
    image,
    description,
    vendido ?? false,
  ]);

  return novo;
};

// =====================
// EDITAR VEÍCULO
// =====================
const editarVeiculo = async (id: number, body: Veiculo) => {
  const { type, name, brand, year, price, image, description, vendido } = body;

  const query = `
    UPDATE veiculos 
    SET type=?, name=?, brand=?, year=?, price=?, image=?, description=?, vendido=? 
    WHERE id=?
  `;

  const [editado] = await connectionModel.execute(query, [
    type,
    name,
    brand,
    year,
    price,
    image,
    description,
    vendido ?? false,
    id,
  ]);

  return editado;
};

// =====================
// REMOVER VEÍCULO
// =====================
const removerVeiculo = async (id: number) => {
  const [removido] = await connectionModel.execute(
    "DELETE FROM veiculos WHERE id=?",
    [id]
  );
  return removido;
};

export default {
  listarVeiculos,
  novoVeiculo,
  editarVeiculo,
  removerVeiculo,
};

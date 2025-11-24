// src/interfaces/types.ts

export interface Veiculo {
  id?: number;
  type: "carro" | "moto";
  name: string;
  brand: string;
  year: number;
  price: number;
  image?: string | null;
  description?: string | null;
  vendido?: boolean;
}

// Mantemos estes aliases para compatibilidade com código antigo
export type Carros = Omit<Veiculo, "type"> & { type?: "carro" | "moto" };
export type Motos  = Omit<Veiculo, "type"> & { type?: "carro" | "moto" };

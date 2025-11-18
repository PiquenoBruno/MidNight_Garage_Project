import React, { useEffect, useState } from "react";

interface Veiculo {
  id: number;
  type: string;
  name: string;
  image: string;
  brand: string;
  year: number;
  price: number;
  description: string;
  vendido: boolean;
}

const API_URL = "http://localhost:3001/api/veiculos";

export const Dashboard: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar veículos");
        const data = await res.json();
        setVeiculos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = veiculos.length;
  const disponiveis = veiculos.filter((v) => !v.vendido).length;
  const vendidos = veiculos.filter((v) => v.vendido).length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <button className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-400 transition">
          + Adicionar Veículo
        </button>
      </header>

      {loading && <p className="text-slate-500">Carregando veículos...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
          {/* Cards resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Total de Veículos</h3>
              <p className="text-2xl font-bold text-slate-800">{total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Disponíveis</h3>
              <p className="text-2xl font-bold text-emerald-500">{disponiveis}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Vendidos</h3>
              <p className="text-2xl font-bold text-rose-500">{vendidos}</p>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {veiculos.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum veículo encontrado.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-slate-600">Modelo</th>
                    <th className="p-3 text-slate-600">Marca</th>
                    <th className="p-3 text-slate-600">Ano</th>
                    <th className="p-3 text-slate-600">Preço</th>
                    <th className="p-3 text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {veiculos.map((v) => (
                    <React.Fragment key={v.id}>
                      <tr
                        className="border-b hover:bg-slate-50 cursor-pointer"
                        onClick={() =>
                          setVeiculoSelecionado(veiculoSelecionado === v.id ? null : v.id)
                        }
                      >
                        <td className="p-3 text-slate-800">{v.name}</td>
                        <td className="p-3 text-slate-800">{v.brand}</td>
                        <td className="p-3 text-slate-800">{v.year}</td>
                        <td className="p-3 text-slate-800">
                          R$ {v.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            v.vendido ? "text-rose-500" : "text-emerald-500"
                          }`}
                        >
                          {v.vendido ? "vendido" : "disponível"}
                        </td>
                      </tr>
                      {veiculoSelecionado === v.id && (
                        <tr className="bg-slate-100">
                          <td colSpan={5} className="p-4 text-slate-700">
                            <p className="mb-2">
                              <strong>Descrição:</strong> {v.description}
                            </p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                              Editar
                            </button>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

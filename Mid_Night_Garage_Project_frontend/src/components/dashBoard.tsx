import React, { useEffect, useState } from "react";
import { EditarVeiculoModal } from "./formsVeiculos";
import Swal from "sweetalert2";

interface Veiculo {
  id: number;
  type: "carro" | "moto";
  name: string;
  brand: string;
  year: number;
  price: number;
  image?: string;
  description?: string;
  vendido: boolean;
}

const API_URL = "http://localhost:3001/api/veiculos";

export const Dashboard: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const loadVeiculos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar veículos");
      const data: Veiculo[] = await res.json();
      setVeiculos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVeiculos();
  }, []);

  const handleSave = async (formData: FormData, id?: number) => {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Erro ao salvar veículo");

      await loadVeiculos();

      Swal.fire(
        id ? "Atualizado!" : "Adicionado!",
        `O veículo foi ${id ? "editado" : "criado"} com sucesso.`,
        "success"
      );
    } catch (err: any) {
      Swal.fire("Erro", err.message, "error");
    }
  };

const RemoverVeiculo = async (id: number) => {
  const resultado = await Swal.fire({
    title: "Tem certeza?",
    text: "Essa ação excluirá o veículo permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      confirmButton:
        "bg-red-600 text-white ml-2 px-4 py-2 rounded hover:bg-red-700 focus:outline-none",
      cancelButton:
        "bg-slate-500 text-white ml-2 px-4 py-2 rounded hover:bg-slate-600 focus:outline-none",
    },
  });

  if (!resultado.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir veículo");

    await loadVeiculos();

    Swal.fire({
      title: "Excluído!",
      text: "O veículo foi removido com sucesso.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err: any) {
    Swal.fire("Erro", err.message, "error");
  }
};


  const total = veiculos.length;
  const disponiveis = veiculos.filter((v) => !v.vendido).length;
  const vendidos = veiculos.filter((v) => v.vendido).length;

  const veiculosFiltrados = veiculos.filter((v) =>
    `${v.name} ${v.brand} ${v.type}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <button
          onClick={() => {
            setVeiculoSelecionado({
              id: 0,
              type: "carro",
              name: "",
              brand: "",
              year: new Date().getFullYear(),
              price: 0,
              description: "",
              image: "",
              vendido: false,
            });
            setIsOpen(true);
          }}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
        >
          + Adicionar Veículo
        </button>
      </header>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome, marca ou tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-black w-full md:w-1/3 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      {loading && <p className="text-slate-500">Carregando veículos...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
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

          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {veiculosFiltrados.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum veículo encontrado.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-slate-600">Imagem</th>
                    <th className="p-3 text-slate-600">Tipo</th>
                    <th className="p-3 text-slate-600">Nome</th>
                    <th className="p-3 text-slate-600">Marca</th>
                    <th className="p-3 text-slate-600">Ano</th>
                    <th className="p-3 text-slate-600">Preço</th>
                    <th className="p-3 text-slate-600">Status</th>
                    <th className="p-3 text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {veiculosFiltrados.map((v) => (
                    <tr key={v.id} className="border-b hover:bg-slate-200">
                      <td className="p-3">
                        {v.image && (
                          <img
                            src={`http://localhost:3001${v.image}`}
                            alt={v.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-3 text-slate-800">{v.type}</td>
                      <td className="p-3 text-slate-800">{v.name}</td>
                      <td className="p-3 text-slate-800">{v.brand}</td>
                      <td className="p-3 text-slate-800">{v.year}</td>
                      <td className="p-3 text-slate-800">
                        R$ {Number(v.price).toFixed(2)}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          v.vendido ? "text-rose-500" : "text-emerald-500"
                        }`}
                      >
                        {v.vendido ? "vendido" : "disponível"}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => {
                            setVeiculoSelecionado(v);
                            setIsOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => RemoverVeiculo(v.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      {veiculoSelecionado && (
        <EditarVeiculoModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          veiculo={veiculoSelecionado}
          onSave={(formData: FormData) =>
            handleSave(
              formData,
              veiculoSelecionado.id !== 0 ? veiculoSelecionado.id : undefined
            )
          }
          titulo={veiculoSelecionado.id ? "Editar Veículo" : "Novo Veículo"}
        />
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Pedido {
  id: number;
  usuario_nome: string;
  veiculo_nome: string;
  data_pedido: string;
  status: "pendente" | "aprovado" | "cancelado";
}

const API_URL = "http://localhost:3001/api/pedidos";

export const PedidoList: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar pedido");
      await fetchPedidos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removerPedido = async (id: number) => {
    const resultado = await Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação excluirá o pedido permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none",
        cancelButton:
          "bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 focus:outline-none",
      },
    });

    if (!resultado.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir pedido");

      await fetchPedidos();

      Swal.fire({
        title: "Excluído!",
        text: "O pedido foi removido com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire("Erro", err.message, "error");
    }
  };

  const total = pedidos.length;
  const pendentes = pedidos.filter((p) => p.status === "pendente").length;
  const aprovados = pedidos.filter((p) => p.status === "aprovado").length;
  const cancelados = pedidos.filter((p) => p.status === "cancelado").length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Pedidos</h1>
      </header>

      {loading && <p className="text-slate-500">Carregando pedidos...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-3">
              <h3 className="text-slate-500">Total</h3>
              <p className="text-2xl font-bold text-emerald-500">{total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-3">
              <h3 className="text-slate-500">Pendentes</h3>
              <p className="text-2xl font-bold text-yellow-500">{pendentes}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-3">
              <h3 className="text-slate-500">Aprovados</h3>
              <p className="text-2xl font-bold text-blue-500">{aprovados}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-3">
              <h3 className="text-slate-500">Cancelados</h3>
              <p className="text-2xl font-bold text-rose-500">{cancelados}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {pedidos.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum pedido encontrado.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-slate-600">Usuário</th>
                    <th className="p-3 text-slate-600">Veículo</th>
                    <th className="p-3 text-slate-600">Data</th>
                    <th className="p-3 text-slate-600">Status</th>
                    <th className="p-3 text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-slate-800">{p.usuario_nome}</td>
                      <td className="p-3 text-slate-800">{p.veiculo_nome}</td>
                      <td className="p-3 text-slate-800">
                        {new Date(p.data_pedido).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm font-semibold ${
                            p.status === "aprovado"
                              ? "bg-blue-600"
                              : p.status === "pendente"
                              ? "bg-yellow-500"
                              : "bg-rose-600"
                          }`}
                        >
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        {p.status === "pendente" && (
                          <>
                            <button
                              onClick={() => atualizarStatus(p.id, "aprovado")}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => atualizarStatus(p.id, "cancelado")}
                              className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600 transition"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {p.status !== "pendente" && (
                          <button
                            onClick={() => atualizarStatus(p.id, "pendente")}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                          >
                            Reverter para Pendente
                          </button>
                        )}
                        <button
                          onClick={() => removerPedido(p.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          🗑️ Excluir
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
    </div>
  );
};

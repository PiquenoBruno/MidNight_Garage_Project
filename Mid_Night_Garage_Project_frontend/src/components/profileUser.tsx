import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

interface Pedido {
  id: number;
  usuario_nome: string;
  usuario_telefone?: string;
  veiculo_nome?: string;
  data_pedido: string;
  status: "pendente" | "aprovado" | "cancelado" | "concluído" | string;
}

export default function Profile() {
  const auth = useContext(AuthContext);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      if (!auth?.user?.name) return;

      const response = await fetch("http://localhost:3001/api/pedidos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar pedidos");

      const data: Pedido[] = await response.json();

      const pedidosUsuario = data.filter(
        (p) => p.usuario_nome === auth.user?.name
      );

      setPedidos(pedidosUsuario);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) fetchPedidos();
  }, [auth?.user]);

  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar pedido");

      await fetchPedidos();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const excluirPedido = async (id: number) => {
    const confirma = window.confirm(
      "Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
    );
    if (!confirma) return;

    try {
      const res = await fetch(`http://localhost:3001/api/pedidos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir pedido");

      await fetchPedidos();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (!auth?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-text-background shadow-xl rounded-xl p-8 w-96 text-center">
          <h2 className="text-2xl font-bold text-destaque mb-4">
            Você não está logado
          </h2>
          <a
            href="/login"
            className="text-primaria hover:underline font-semibold transition"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-background font-sans">
      <div className="bg-text-background shadow-2xl rounded-xl p-10 w-[600px] animate-fadeIn">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-destaque flex items-center justify-center text-background text-3xl font-bold mb-6 shadow-lg ring-4 ring-primaria">
            {auth.user?.name.charAt(0).toUpperCase()}
          </div>

          {/* Nome e Email */}
          <h1 className="text-2xl font-extrabold text-destaque uppercase mb-1">
            {auth.user?.name}
          </h1>
          <p className="text-text-color/70 mb-6">{auth.user?.email}</p>

          {/* Título */}
          <h2 className="text-lg font-semibold text-destaque mb-3 uppercase">
            Meus Pedidos
          </h2>

          {loading && (
            <p className="text-text-color/50 text-sm text-center">
              Carregando pedidos...
            </p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">Erro: {error}</p>
          )}

          {!loading && !error && (
            <ul className="w-full space-y-3">
              {pedidos.length === 0 ? (
                <p className="text-text-color/50 text-sm text-center">
                  Nenhum pedido encontrado.
                </p>
              ) : (
                pedidos.map((pedido) => (
                  <li
                    key={pedido.id}
                    className="border border-primaria/30 rounded-xl p-4 shadow-sm flex justify-between items-center hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-text-color">
                        {pedido.veiculo_nome ?? "Sem descrição"}
                      </p>

                      <p
                        className={`text-sm font-bold ${
                          pedido.status === "aprovado"
                            ? "text-green-400"
                            : pedido.status === "pendente"
                            ? "text-yellow-400"
                            : "text-rose-400"
                        }`}
                      >
                        Status: {pedido.status}
                      </p>

                      <p className="text-sm text-text-color/70">
                        {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="space-x-2">
                      {pedido.status === "pendente" && (
                        <button
                          onClick={() => atualizarStatus(pedido.id, "cancelado")}
                          className="bg-rose-600 text-white px-4 py-1 rounded hover:bg-rose-700"
                          type="button"
                        >
                          Cancelar
                        </button>
                      )}

                      {pedido.status === "cancelado" && (
                        <>
                          <button
                            onClick={() => atualizarStatus(pedido.id, "pendente")}
                            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                            type="button"
                          >
                            Reverter
                          </button>

                          <button
                            onClick={() => excluirPedido(pedido.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                            type="button"
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}

          {/* Botão de Logout */}
          <button
            onClick={auth.logout}
            className="mt-6 bg-primaria text-background px-6 py-2 rounded-full font-semibold hover:bg-[#ffe3ae] transition shadow-md"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

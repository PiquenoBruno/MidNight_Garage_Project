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
  // Estados e contexto
  const auth = useContext(AuthContext);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar pedidos do usuário
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
      // Filtra pedidos pelo nome do usuário logado
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

  // Busca pedidos quando o usuário é carregado
  useEffect(() => {
    if (auth?.user) fetchPedidos();
  }, [auth?.user]);

  // Função para atualizar status do pedido
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

      await fetchPedidos(); // Recarrega a lista de pedidos
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Função para excluir pedido
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

      await fetchPedidos(); // Recarrega a lista após exclusão
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // ============ RENDERIZAÇÃO ============

  // Verifica se usuário não está logado
  if (!auth?.user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-black bg-opacity-80 border border-white rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Não Está Logado
          </h2>
          <p className="text-gray-300 mb-6">Faça login para acessar seu perfil</p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  // Funções auxiliares para estilização do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-900 bg-opacity-50 text-green-300 border-green-600";
      case "pendente":
        return "bg-yellow-900 bg-opacity-50 text-yellow-300 border-yellow-600";
      case "concluído":
        return "bg-blue-900 bg-opacity-50 text-blue-300 border-blue-600";
      default:
        return "bg-red-900 bg-opacity-50 text-red-300 border-red-600";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 font-sans"
    >
      <div className="max-w-4xl mx-auto">
        {/* ============ HEADER DO PERFIL ============ */}
        <div className="bg-black bg-opacity-80 border border-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar do usuário */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-gray-700">
              {auth.user?.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Informações do usuário */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {auth.user?.name}
              </h1>
              <p className="text-gray-300 text-lg mb-4">{auth.user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-blue-600 bg-opacity-50 text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-500">
                  {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
                </span>
                <span className="bg-green-900 bg-opacity-50 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-600">
                  Conta ativa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ SEÇÃO DE PEDIDOS ============ */}
        <div className="bg-black bg-opacity-80 border border-white rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Histórico de Pedidos</h2>
            <button
              onClick={fetchPedidos}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg border border-blue-500"
            >
              Atualizar Lista
            </button>
          </div>

          {/* Estado de carregamento */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-300">Carregando pedidos...</span>
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-center font-medium">Erro: {error}</p>
            </div>
          )}

          {/* Lista de pedidos */}
          {!loading && !error && (
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-300 mb-3">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-400">
                    Você ainda não realizou nenhum pedido.
                  </p>
                </div>
              ) : (
                pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gray-800 bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Informações do pedido */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${
                            pedido.status === 'aprovado' ? 'bg-green-500' :
                            pedido.status === 'pendente' ? 'bg-yellow-500' :
                            pedido.status === 'concluído' ? 'bg-blue-500' : 'bg-red-500'
                          }`}></div>
                          <h3 className="text-lg font-bold text-white">
                            {pedido.veiculo_nome || "Veículo não especificado"}
                          </h3>
                        </div>
                        
                        {/* Detalhes do pedido */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                          <div className="flex items-center">
                            <span className="font-medium mr-2 text-gray-400">Data:</span>
                            {new Date(pedido.data_pedido).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </div>
                          {pedido.usuario_telefone && (
                            <div className="flex items-center">
                              <span className="font-medium mr-2 text-gray-400">Telefone:</span>
                              {pedido.usuario_telefone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status e ações */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(pedido.status)}`}>
                          {getStatusText(pedido.status)}
                        </div>
                        
                        {/* Botões de ação baseados no status */}
                        <div className="flex gap-3">
                          {pedido.status === "pendente" && (
                            <button
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja cancelar este pedido?")) {
                                  atualizarStatus(pedido.id, "cancelado");
                                }
                              }}
                              className="bg-rose-700 text-white px-4 py-2 rounded-lg hover:bg-rose-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm border border-rose-600"
                            >
                              Cancelar
                            </button>
                          )}

                          {pedido.status === "cancelado" && (
                            <>
                              <button
                                onClick={() => atualizarStatus(pedido.id, "pendente")}
                                className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm border border-yellow-600"
                              >
                                Reverter
                              </button>
                              <button
                                onClick={() => excluirPedido(pedido.id)}
                                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm border border-red-700"
                              >
                                Excluir
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ============ BOTÃO DE LOGOUT ============ */}
        <div className="text-center mt-8">
          <button
            onClick={auth.logout}
            className="bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-red-600"
          >
            Encerrar Sessão
          </button>
        </div>
      </div>
    </div>
  );
}
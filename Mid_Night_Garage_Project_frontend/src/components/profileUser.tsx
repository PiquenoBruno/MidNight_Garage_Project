import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

interface Pedido {
  id: number;
  descricao: string;
  valor: number;
  status: string;
}

export default function Profile() {
  const auth = useContext(AuthContext);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!auth?.user) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${auth.user.id}/pedidos`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    };

    fetchPedidos();
  }, [auth?.user]);

  if (!auth?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded p-6 w-96 text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Você não está logado
          </h2>
          <a
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[500px]">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-md">
            {auth.user.name.charAt(0).toUpperCase()}
          </div>

          {/* Nome e Email */}
          <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
            {auth.user.name}
          </h1>
          <p className="text-gray-500 mb-6">{auth.user.email}</p>

          {/* Pedidos */}
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Meus Pedidos
          </h2>
          <ul className="w-full space-y-3">
            {pedidos.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum pedido encontrado.</p>
            ) : (
              pedidos.map((pedido) => (
                <li
                  key={pedido.id}
                  className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {pedido.descricao}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {pedido.status}
                    </p>
                  </div>
                  <span className="text-blue-600 font-bold">
                    R$ {pedido.valor.toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>

          {/* Botão de logout */}
          <button
            onClick={auth.logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

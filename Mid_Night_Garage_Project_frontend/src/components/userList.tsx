import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  admin: boolean;
}

const API_URL = "http://localhost:3001/api/users";

export const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const data = await res.json();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const removerUsuario = async (id: number) => {
    const resultado = await Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação excluirá o usuário permanentemente.",
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
      if (!res.ok) throw new Error("Erro ao excluir usuário");

      await fetchUsuarios();

      Swal.fire({
        title: "Excluído!",
        text: "O usuário foi removido com sucesso.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire("Erro", err.message, "error");
    }
  };

  const usuariosComuns = usuarios.filter((u) => !u.admin);
  const total = usuariosComuns.length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Usuários Comuns</h1>
        <button className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-400 transition">
          + Adicionar Usuário
        </button>
      </header>

      {loading && <p className="text-slate-500">Carregando usuários...</p>}
      {error && <p className="text-rose-600">Erro: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-slate-50 border border-slate-200 shadow rounded p-4">
              <h3 className="text-slate-500">Total de Usuários Comuns</h3>
              <p className="text-2xl font-bold text-blue-500">{total}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 shadow rounded overflow-hidden">
            {usuariosComuns.length === 0 ? (
              <p className="p-4 text-slate-500">Nenhum usuário comum encontrado.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-slate-600">Nome</th>
                    <th className="p-3 text-slate-600">Email</th>
                    <th className="p-3 text-slate-600">Telefone</th>
                    <th className="p-3 text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosComuns.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 text-slate-800">{u.nome}</td>
                      <td className="p-3 text-slate-800">{u.email}</td>
                      <td className="p-3 text-slate-800">{u.telefone}</td>
                      <td className="p-3">
                        <button
                          onClick={() => removerUsuario(u.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                         Excluir
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

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;   // agora incluímos senha
  admin: boolean;
}

interface EditarUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario;
  onSave: (usuarioAtualizado: Usuario) => void;
  titulo: string; // título dinâmico
}

// Função para formatar telefone brasileiro em tempo real
function formatPhoneBR(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11); // só números, máximo 11 dígitos
  const ddd = digits.slice(0, 2);

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${ddd}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${ddd}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function EditarUsuarioModal({
  isOpen,
  onClose,
  usuario,
  onSave,
  titulo,
}: EditarUsuarioModalProps) {
  const [form, setForm] = useState<Usuario>({ ...usuario });
  const [erro, setErro] = useState("");

  useEffect(() => {
    setForm({ ...usuario });
    setErro("");
  }, [usuario, isOpen]);

  const validar = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const telefoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

    if (!form.nome || !form.email || !form.telefone || !form.senha)
      return "Todos os campos são obrigatórios.";
    if (!emailRegex.test(form.email)) return "Email inválido.";
    if (!telefoneRegex.test(form.telefone))
      return "Telefone inválido. Use o formato (99) 99999-9999.";
    return "";
  };

  const handleSubmit = () => {
    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {titulo}
              </Dialog.Title>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />

                <input
                  type="email"
                  inputMode="email"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Senha"
                  value={form.senha || ""}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />

                {/* Telefone com formatação automática */}
                <input
                  type="tel"
                  inputMode="tel"
                  className="w-full border rounded px-3 py-2"
                  placeholder="(11) 91234-5678"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefone: formatPhoneBR(e.target.value),
                    })
                  }
                />

                {erro && <p className="text-red-500 text-sm">{erro}</p>}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

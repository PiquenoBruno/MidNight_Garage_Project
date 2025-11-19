import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

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

interface EditarVeiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  veiculo: Veiculo;
  onSave: (formData: FormData) => void;
  titulo: string;
}

export function EditarVeiculoModal({
  isOpen,
  onClose,
  veiculo,
  onSave,
  titulo,
}: EditarVeiculoModalProps) {
  const [form, setForm] = useState<Veiculo>({ ...veiculo });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...veiculo });
    setFile(null);
    setError(null);
  }, [veiculo, isOpen]);

  const handleSubmit = () => {
    // validações simples
    if (!form.type) {
      setError("Selecione o tipo do veículo.");
      return;
    }
    if (!form.name.trim()) {
      setError("Informe o nome do veículo.");
      return;
    }
    if (!form.brand.trim()) {
      setError("Informe a marca do veículo.");
      return;
    }
    if (!form.year || form.year < 1900 || form.year > new Date().getFullYear() + 1) {
      setError("Informe um ano válido.");
      return;
    }
    if (!form.price || isNaN(form.price) || form.price <= 0) {
      setError("Informe um preço válido.");
      return;
    }

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("year", String(form.year));
    formData.append("price", String(form.price));
    if (form.description) formData.append("description", form.description);
    formData.append("vendido", String(form.vendido));
    if (file) formData.append("imagem", file);

    onSave(formData);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* fundo escuro */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        {/* container do modal */}
        <div className="fixed inset-0 overflow-y-auto">
          {/* margem-top para não ficar atrás do header */}
          <div className="flex min-h-full items-center justify-center p-4 mt-24">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {titulo}
              </Dialog.Title>

              <div className="mt-4 space-y-3">
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                  </p>
                )}

                <label className="block text-sm text-gray-700">Tipo *</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as "carro" | "moto" })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                >
                  <option value="">Selecione...</option>
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>

                <label className="block text-sm text-gray-700">Nome *</label>
                <input
                  type="text"
                  placeholder="Ex: Civic Sport"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                />

                <label className="block text-sm text-gray-700">Marca *</label>
                <input
                  type="text"
                  placeholder="Ex: Honda"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                />

                <label className="block text-sm text-gray-700">Ano *</label>
                <input
                  type="number"
                  placeholder="Ex: 2020"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                />

                <label className="block text-sm text-gray-700">Preço *</label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 95000.00"
                  value={form.price || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                      setForm({ ...form, price: value === "" ? 0 : parseFloat(value) });
                    }
                  }}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                />

                <label className="block text-sm text-gray-700">Descrição</label>
                <textarea
                  placeholder="Detalhes do veículo"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                />

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.vendido}
                    onChange={(e) => setForm({ ...form, vendido: e.target.checked })}
                  />
                  <span>Vendido</span>
                </label>

                <label className="block text-sm text-gray-700">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
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

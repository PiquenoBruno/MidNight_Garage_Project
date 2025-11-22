import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

interface Car {
  id: number;
  type: string;
  name: string;
  image: string;
  brand: string;
  year: number;
  price: number;
  description: string;
}

interface Props {
  cars: Car[];
}

export default function CatalogoCards({ cars }: Props) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);

  const handleOpenModal = (car: Car) => setSelectedCar(car);
  const handleCloseModal = () => setSelectedCar(null);

  const handleFazerPedido = async () => {
    if (!auth?.user) {
      Swal.fire({
        title: "Ops!",
        text: "Você precisa estar logado para fazer um pedido.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir para Login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          usuario_id: auth.user.id,
          veiculo_id: selectedCar!.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer pedido");
      }

      Swal.fire("Sucesso!", "Pedido realizado com sucesso!", "success");
      handleCloseModal();
    } catch (err: any) {
      console.error("Erro ao fazer pedido:", err);
      Swal.fire("Erro", "Não foi possível realizar o pedido.", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };

    if (selectedCar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCar]);

  return (
    <>
      {/* Grade de cartões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-6 bg-background font-sans">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-text-background rounded-xl shadow-xl cursor-pointer"
            onClick={() => handleOpenModal(car)}
          >
            <img
              src={`http://localhost:3001${car.image}`}
              alt={car.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4 text-text-color">
              <span className="px-3 py-1 bg-destaque text-background rounded-full text-xs font-bold">
                {car.type === "carro" ? "Carro" : "Moto"}
              </span>
              <h2 className="text-2xl font-bold text-destaque mt-2 uppercase">
                {car.name}
              </h2>
              <p className="text-sm text-text-color/60">
                {car.brand} • {car.year}
              </p>
              <p className="text-primaria font-semibold mt-2 text-lg">
                R$ {car.price.toLocaleString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(car);
                }}
                className="mt-4 px-4 py-2 rounded-full font-semibold bg-white text-black hover:bg-[#ffe3ae]"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-text-background rounded-xl w-[95vw] h-[90vh] flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-[90vh]">
              <img
                src={`http://localhost:3001${selectedCar.image}`}
                alt={selectedCar.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-between w-full md:w-1/2 text-text-color overflow-y-auto">
              <div>
                <h2 className="text-4xl font-bold text-destaque mb-4 uppercase">
                  {selectedCar.name}
                </h2>
                <span className="px-4 py-1 bg-destaque text-background rounded-full text-xs font-bold">
                  {selectedCar.type === "carro" ? "Carro" : "Moto"}
                </span>
                <p className="text-base text-text-color/60 mb-2">
                  {selectedCar.brand} • {selectedCar.year}
                </p>
                <p className="text-primaria font-semibold text-2xl mb-6">
                  R$ {selectedCar.price.toLocaleString()}
                </p>
                <p className="text-text-color mb-6 leading-relaxed text-lg">
                  {selectedCar.description}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleFazerPedido}
                  className="bg-primaria text-background px-6 py-3 rounded-full font-semibold hover:bg-[#ffe3ae]"
                >
                  Fazer pedido
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-sm text-destaque hover:underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

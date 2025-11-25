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
  vendido?: boolean;
}

interface Props {
  cars: Car[];
}

export default function CatalogoCards({ cars }: Props) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [showFilters, setShowFilters] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const auth = useContext(AuthContext);

  // Extrair marcas únicas para os filtros
  const brands = [...new Set(cars.map(car => car.brand))];
  const maxPrice = Math.max(...cars.map(car => car.price));

  // Aplicar filtros
  useEffect(() => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" || car.type === selectedType;
      const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      
      return matchesSearch && matchesType && matchesBrand && matchesPrice;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "year":
          return b.year - a.year;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCars(filtered);
  }, [cars, searchTerm, selectedType, selectedBrand, priceRange, sortBy]);

  const handleOpenModal = (car: Car) => setSelectedCar(car);
  const handleCloseModal = () => setSelectedCar(null);

  const handleFazerPedido = async () => {
    if (!auth?.user) {
      Swal.fire({
        title: "Ops!",
        text: "Você precisa estar logado para fazer um pedido.",
        icon: "warning",
        background: "#000",
        color: "#fff",
        showCancelButton: true,
        confirmButtonText: "Ir para Login",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-white",
          cancelButton: "bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all duration-200 border border-white",
        },
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
          veiculo_id: selectedCar?.id,
          data_pedido: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer pedido");
      }

      Swal.fire({
        title: "Sucesso!",
        text: "Pedido realizado com sucesso!",
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonText: "Continuar",
        customClass: {
          confirmButton: "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-white",
        },
      });
      handleCloseModal();
    } catch (err: any) {
      console.error("Erro ao fazer pedido:", err);
      Swal.fire({
        title: "Erro",
        text: "Não foi possível realizar o pedido.",
        icon: "error",
        background: "#000",
        color: "#fff",
        confirmButtonText: "Entendi",
        customClass: {
          confirmButton: "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-white",
        },
      });
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [selectedCar]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedBrand("all");
    setPriceRange([0, maxPrice]);
    setSortBy("name");
  };

  return (
    <>
      {/* Header do Catálogo */}
      <div className="bg-black border-b border-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Barra de Pesquisa */}
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Pesquisar veículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-white rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              />
            </div>

            {/* Botões de Controle */}
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-black hover:bg-gray-900 border border-white text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                Filtros
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-white text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 text-sm"
              >
                <option value="name">Nome A-Z</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="year">Mais Recentes</option>
              </select>
            </div>
          </div>

          {/* Filtros Expandíveis */}
          {showFilters && (
            <div className="mt-4 p-4 bg-black rounded-lg border border-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por Tipo */}
                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Tipo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-black border border-white text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 text-sm"
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="carro">Carros</option>
                    <option value="moto">Motos</option>
                  </select>
                </div>

                {/* Filtro por Marca */}
                <div>
                  <label className="block text-white font-medium mb-1 text-sm">Marca</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-black border border-white text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 text-sm"
                  >
                    <option value="all">Todas as Marcas</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Preço */}
                <div>
                  <label className="block text-white font-medium mb-1 text-sm">
                    Preço: R$ {priceRange[0].toLocaleString()} - R$ {priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-white"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-white"
                    />
                  </div>
                </div>
              </div>
              
              {/* Botão Resetar Filtros */}
              <div className="mt-3 text-center">
                <button
                  onClick={resetFilters}
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium text-sm"
                >
                  Resetar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade de Veículos */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-black min-h-screen">
        {filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-black rounded-lg border border-white">
            <div className="text-white text-6xl mb-4">🌙</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum veículo encontrado
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
            <button
              onClick={resetFilters}
              className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 border border-white text-sm"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-black rounded-lg border border-white hover:border-gray-400 transition-all duration-300 cursor-pointer group"
                onClick={() => handleOpenModal(car)}
              >
                {/* Badge de Vendido - CORRIGIDO */}
                {car.vendido ? (
                  <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-xs font-medium z-10 border border-white">
                    VENDIDO
                  </div>
                ) : null}

                {/* Imagem do Veículo - Responsiva */}
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:3001${car.image}`}
                    alt={car.name}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge do Tipo */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      car.type === "carro" 
                        ? "bg-black text-white border border-white" 
                        : "bg-black text-white border border-white"
                    }`}>
                      {car.type === "carro" ? "CARRO" : "MOTO"}
                    </span>
                  </div>
                </div>

                {/* Informações do Veículo */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors duration-200 line-clamp-1">
                      {car.name}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Adicionar aos favoritos
                      }}
                      className="text-white hover:text-gray-400 transition-colors duration-200 text-sm"
                    >
                      ♡
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {car.brand} • {car.year}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-bold text-white">
                      R$ {car.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      ⭐ 5.0
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {car.description}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(car);
                    }}
                    className="w-full bg-white text-black py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 border border-white text-sm"
                    disabled={car.vendido}
                  >
                    {car.vendido ? "VENDIDO" : "VER DETALHES"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes - CORRIGIDO */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            ref={modalRef}
            className="bg-black rounded-lg w-full max-w-6xl max-h-[95vh] border border-white overflow-hidden"
          >
            {/* Header do Modal */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white">
              <h2 className="text-xl font-semibold text-white">
                Detalhes do Veículo
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-400 transition-colors duration-200 p-1 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)]">
              {/* Imagem - Responsiva */}
              <div className="lg:w-1/2">
                <img
                  src={`http://localhost:3001${selectedCar.image}`}
                  alt={selectedCar.name}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover"
                />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Header do Veículo - CORRIGIDO */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedCar.type === "carro" 
                          ? "bg-black text-white border border-white" 
                          : "bg-black text-white border border-white"
                      }`}>
                        {selectedCar.type === "carro" ? "CARRO" : "MOTO"}
                      </span>
                      {/* CORREÇÃO: Removida a expressão que causava o "0" */}
                      {selectedCar.vendido ? (
                        <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium border border-white">
                          VENDIDO
                        </span>
                      ) : null}
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {selectedCar.name}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span>{selectedCar.brand}</span>
                      <span>•</span>
                      <span>{selectedCar.year}</span>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    R$ {selectedCar.price.toLocaleString()}
                  </div>

                  {/* Descrição */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">DESCRIÇÃO</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                      {selectedCar.description}
                    </p>
                  </div>

                  {/* Especificações */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-700">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Performance</div>
                      <div className="font-medium text-white">Alta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Condição</div>
                      <div className="font-medium text-white">Excelente</div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleFazerPedido}
                      disabled={selectedCar.vendido}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedCar.vendido
                          ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600"
                          : "bg-white text-black hover:bg-gray-200 border border-white"
                      }`}
                    >
                      {selectedCar.vendido ? "VEÍCULO VENDIDO" : "FAZER PEDIDO"}
                    </button>
                    
                    <button className="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 border border-white text-sm">
                       Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
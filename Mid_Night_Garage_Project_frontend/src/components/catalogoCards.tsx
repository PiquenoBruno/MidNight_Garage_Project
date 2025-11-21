import { useState, useEffect, useRef } from 'react'

interface Car {
  id: number
  type: string
  name: string
  image: string
  brand: string
  year: number
  price: number
  description: string
}

interface Props {
  cars: Car[]
}

export default function CatalogoCards({ cars }: Props) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleOpenModal = (car: Car) => setSelectedCar(car)
  const handleCloseModal = () => setSelectedCar(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal()
      }
    }

    if (selectedCar) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedCar])

  return (
    <>
      {/* Grade de cartões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-6 bg-background font-sans">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-text-background rounded-xl shadow-xl transition-all duration-300 border border-transparent hover:border-[#F8FFFF] hover:shadow-[0_0_12px_3px_#F8FFFF] hover:scale-[1.03] cursor-pointer"
            onClick={() => handleOpenModal(car)}
          >
            <img
              src={`http://localhost:3001${car.image}`}
              alt={car.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />

            <div className="p-4 text-text-color">
              <span className="px-3 py-1 bg-destaque text-background rounded-full text-xs font-bold tracking-wide">
                {car.type === 'carro' ? 'Carro' : 'Moto'}
              </span>

              <h2 className="text-2xl font-bold text-destaque mt-2 uppercase tracking-wide">
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
                  e.stopPropagation()
                  handleOpenModal(car)
                }}
                className="mt-4 px-4 py-2 rounded-full font-semibold tracking-wide bg-white text-black transition-all duration-300 hover:bg-[#ffe3ae] hover:text-background"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-100 transition-opacity duration-300">
          <div
            ref={modalRef}
            className="bg-text-background rounded-xl w-[95vw] h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row font-sans animate-fadeIn border border-destaque"
          >
            <div className="w-full md:w-1/2 h-[90vh]">
              <img
                src={`http://localhost:3001${selectedCar.image}`}
                alt={selectedCar.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col justify-between w-full md:w-1/2 text-text-color overflow-y-auto">
              <div>
                <h2 className="text-4xl font-bold text-destaque mb-4 uppercase tracking-wide">
                  {selectedCar.name}
                </h2>

                <span className="px-4 py-1 bg-destaque text-background rounded-full text-xs font-bold tracking-wide">
                  {selectedCar.type === 'carro' ? 'Carro' : 'Moto'}
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
                {/* Botão atualizado sem neon */}
                <button className="bg-primaria text-background px-6 py-3 rounded-full font-semibold transition-transform duration-300 hover:scale-105 hover:bg-[#ffe3ae] tracking-wide text-lg">
                  Adicionar ao carrinho
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-sm text-destaque hover:underline tracking-wide"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface Car {
  name: string
  image: string
  brand: string
  year: number
  price: number
}

interface Props {
  cars: Car[]
}

export default function CatalogoCards({ cars }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-background">
      {cars.map((car) => (
        <div
          key={car.name}
          className="bg-text-background rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-transparent hover:border-destaque"
        >
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-4 text-text-color">
            <h2 className="text-2xl font-bold text-destaque">{car.name}</h2>
            <p className="text-sm text-text-color/60">
              {car.brand} • {car.year}
            </p>
            <p className="text-primaria font-semibold mt-2">
              R$ {car.price.toLocaleString()}
            </p>
            <button className="mt-4 bg-primaria text-background px-4 py-2 rounded-full transition-colors hover:brightness-110">
              Ver detalhes
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

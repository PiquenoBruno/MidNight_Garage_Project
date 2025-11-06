import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import CatalogoCards from '../components/catalogoCards'

interface Car {
  name: string
  image: string
  brand: string
  year: number
  price: number
}

const carros: Car[] = [
  { name: 'Nissan GT-R', image: '/shadow_car.webp', brand: 'Nissan', year: 2022, price: 520000 },
  { name: 'BMW M4', image: '/shadow_car.webp', brand: 'BMW', year: 2023, price: 610000 },
  { name: 'Toyota Supra', image: '/shadow_car.webp', brand: 'Toyota', year: 2021, price: 430000 },
  { name: 'Audi RS7', image: '/shadow_car.webp', brand: 'Audi', year: 2023, price: 670000 },
  { name: 'Mercedes AMG GT', image: '/shadow_car.webp', brand: 'Mercedes-Benz', year: 2022, price: 750000 },
  { name: 'Chevrolet Camaro ZL1', image: '/shadow_car.webp', brand: 'Chevrolet', year: 2021, price: 480000 },
  { name: 'Ford Mustang GT', image: '/shadow_car.webp', brand: 'Ford', year: 2022, price: 450000 },
  { name: 'Porsche 911 Carrera', image: '/shadow_car.webp', brand: 'Porsche', year: 2023, price: 890000 },
  { name: 'Lamborghini Huracán', image: '/shadow_car.webp', brand: 'Lamborghini', year: 2023, price: 1250000 }
]
    //criando as variaveis para marca e ano e casi não tenha vazio('')
export default function Catalogo() {
  const [filtroMarca, setFiltroMarca] = useState('')
  const [filtroAno, setFiltroAno] = useState<number | ''>('')
    //basicamente mapeando os anos e marcas que tem na interface car
  const marcasUnicas = Array.from(new Set(carros.map((carro) => carro.brand)))
  const anosUnicos = Array.from(new Set(carros.map((carro) => carro.year))).sort()

  const carrosFiltrados = carros.filter((carro) => {
    const marcaMatch = filtroMarca === '' || carro.brand === filtroMarca
    const anoMatch = filtroAno === '' || carro.year === filtroAno
    return marcaMatch && anoMatch
  })

  return (
    <div className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col">
      <Header />

      {/* Filtros */}
      <div className="p-6 bg-text-background text-text-color flex flex-col md:flex-row gap-6 justify-center items-center shadow-lg rounded-xl">
        <select
          value={filtroMarca}
          onChange={(e) => setFiltroMarca(e.target.value)}
          className="bg-background text-text-color border border-destaque p-3 rounded-xl font-sans w-64 focus:outline-none focus:ring-2 focus:ring-destaque"
        >
          <option value="">Todas as marcas</option>
          {marcasUnicas.map((marca) => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value === '' ? '' : parseInt(e.target.value))}
          className="bg-background text-text-color border border-destaque p-3 rounded-xl font-sans w-64 focus:outline-none focus:ring-2 focus:ring-destaque"
        >
          <option value="">Todos os anos</option>
          {anosUnicos.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {/* Cards filtrados */}
      <CatalogoCards cars={carrosFiltrados} />

      <Footer />
    </div>
  )
}

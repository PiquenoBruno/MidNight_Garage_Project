import { useEffect, useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import CatalogoCards from '../components/catalogoCards'

interface Veiculo {
  id: number
  type: string
  name: string
  image: string
  brand: string
  year: number
  price: number
  description: string
}

export default function Catalogo() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [filtroMarca, setFiltroMarca] = useState('')
  const [filtroAno, setFiltroAno] = useState<number | ''>('')

  // Busca todos os veículos (carros e motos de uma vez)
  useEffect(() => {
    fetch('http://localhost:3001/api/veiculos')
      .then((res) => res.json())
      .then((data) => setVeiculos(data))
      .catch((err) => console.error('Erro ao buscar veículos:', err))
  }, [])

  // Gera listas únicas para os filtros
  const marcasUnicas = Array.from(new Set(veiculos.map((v) => v.brand)))
  const anosUnicos = Array.from(new Set(veiculos.map((v) => v.year))).sort()

  // Aplica os filtros
  const veiculosFiltrados = veiculos.filter((v) => {
    const marcaMatch = filtroMarca === '' || v.brand === filtroMarca
    const anoMatch = filtroAno === '' || v.year === filtroAno
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

      {/* Cards */}
      <CatalogoCards cars={veiculosFiltrados} />

      <Footer />
    </div>
  )
}

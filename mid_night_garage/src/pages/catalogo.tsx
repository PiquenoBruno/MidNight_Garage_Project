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
  {
    name: 'Nissan GT-R',
    image: '/shadow_car.webp',
    brand: 'Nissan',
    year: 2022,
    price: 520000
  },
  {
    name: 'BMW M4',
    image: '/shadow_car.webp',
    brand: 'BMW',
    year: 2023,
    price: 610000
  },
  {
    name: 'Toyota Supra',
    image: '/shadow_car.webp',
    brand: 'Toyota',
    year: 2021,
    price: 430000
  },
  {
    name: 'Audi RS7',
    image: '/shadow_car.webp',
    brand: 'Audi',
    year: 2023,
    price: 670000
  },
  {
    name: 'Mercedes AMG GT',
    image: '/shadow_car.webp',
    brand: 'Mercedes-Benz',
    year: 2022,
    price: 750000
  },
  {
    name: 'Chevrolet Camaro ZL1',
    image: '/shadow_car.webp',
    brand: 'Chevrolet',
    year: 2021,
    price: 480000
  },
  {
    name: 'Ford Mustang GT',
    image: '/shadow_car.webp',
    brand: 'Ford',
    year: 2022,
    price: 450000
  },
  {
    name: 'Porsche 911 Carrera',
    image: '/shadow_car.webp',
    brand: 'Porsche',
    year: 2023,
    price: 890000
  },
  {
    name: 'Lamborghini Huracán',
    image: '/shadow_car.webp',
    brand: 'Lamborghini',
    year: 2023,
    price: 1250000
  }
]

export default function Catalogo() {
  return (
    <div className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col">
      <Header />
      <CatalogoCards cars={carros} />
      <Footer />
    </div>
  )
}

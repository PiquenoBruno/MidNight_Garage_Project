import Header from '../components/header';
import MenuCards from '../components/menuCards';
import Footer from '../components/footer';
import Slogan from '../components/slogan';
import About from '../components/aboutUs';

export default function Home() {
  return (
    <div
      className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col"
      style={{
        backgroundPosition: 'center 139px',
      }}
    >
      <Header />
      <Slogan />
      <MenuCards />
      <About />
      <Footer /> 
    </div>
  );
}

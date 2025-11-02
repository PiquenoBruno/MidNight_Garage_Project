import Header from '../components/Header';
import Menu from '../components/Menu';
import MenuCards from '../components/menuCards';
import Footer from '../components/footer';
import Slogan from '../components/Slogan';
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
      <Menu />
      <Slogan />
      <MenuCards />
      <About />
      <Footer />
    </div>
  );
}

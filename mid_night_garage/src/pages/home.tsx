import Header from '../components/Header';
import Menu from '../components/Menu';
import MenuCards from '../components/menuCards';
import Footer from '../components/footer';
import Slogan from '../components/Slogan';

export default function Home() {
  return (
    <div
      className="bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('../src/assets/midnight_fundo01.gif')",
        backgroundPosition: 'center 139px',
      }}
    >
      <Header />
      <Menu />
      <Slogan />
      <MenuCards />
      <Footer />
    </div>
  );
}

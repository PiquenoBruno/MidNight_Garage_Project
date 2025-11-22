import Header from '../components/header';
import Footer from '../components/footer';
import Profile from '../components/profileUser';

export default function Home() {
  return (
    <div
      className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col"
      style={{
        backgroundPosition: 'center 139px',
      }}
    >
      <Header />
      <Profile />
      <Footer /> 
    </div>
  );
}

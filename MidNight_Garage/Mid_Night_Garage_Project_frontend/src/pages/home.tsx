import { useState } from "react";
import Header from '../components/header';
import MenuCards from '../components/menuCards';
import Footer from '../components/footer';
import Slogan from '../components/slogan';
import About from '../components/aboutUs';
import Chatbot from '../components/chatBot';

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div
      className="bg-black bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col"
      style={{ backgroundPosition: 'center 139px' }}
    >
      <Header />
      <Slogan />
      <MenuCards onChatButtonClick={() => setChatOpen(true)} />
      <About />
      <Footer />

      {/* Chat flutuante */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[350px] md:w-[400px]">
          <Chatbot />
          <button
            className="mt-2 w-full bg-destaque text-black px-4 py-2 rounded-full hover:bg-red-600  transition-colors hover:text-white"
            onClick={() => setChatOpen(false)}
          >
            Fechar Chat
          </button>
        </div>
      )}
    </div>
  );
}

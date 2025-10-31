import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import CardSection from './components/CardSection';
import About from './components/About';
import Footer from './components/footer';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <Hero />
      <CardSection />
      <About />
      <Footer />
    </div>
  );
};

export default App;

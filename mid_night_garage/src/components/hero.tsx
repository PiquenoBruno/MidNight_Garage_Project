import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center py-8 bg-white">
      <div className="flex justify-center mb-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
      </div>
      <h1 className="text-2xl font-semibold">MidNight Garage</h1>
      <p className="mt-2 text-gray-600">“Não é sobre o que você perdeu. É sobre como você chega.
Veja nossa garagem e encontre seu estilo.”</p>
    </div>
  );
};

export default Hero;

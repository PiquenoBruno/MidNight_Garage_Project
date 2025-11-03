import Header from '../components/header';

import Footer from '../components/footer';
import TypeGarage from '../components/type';


export default function Type() {
  return (
    <div
      className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex flex-col"

    >
      <Header />
      <TypeGarage />
      <Footer /> 
    </div>
  );
}

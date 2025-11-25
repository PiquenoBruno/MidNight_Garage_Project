import Logo from "../components/logo";
import CadastroForm from "../components/cadastroForm";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center bg-garage-bg bg-cover bg-center">
      <div className="p-8 bg-black rounded-xl shadow-lg z-100 border-2 border-gray-500">
        <Logo />
        <CadastroForm />
      </div>
    </div>
  );
}

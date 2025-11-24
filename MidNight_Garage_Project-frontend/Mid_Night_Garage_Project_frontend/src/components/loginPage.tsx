
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded p-6 w-96 text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Você não está logado
          </h2>
          <a
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <div className="flex flex-col items-center">
          {/* Avatar fake */}
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {auth.user.name.charAt(0)}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {auth.user.name}
          </h1>
          <p className="text-gray-600 mb-6">{auth.user.email}</p>

          <button
            onClick={auth.logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";

interface Veiculo {
  id: number;
  nome: string;
  marca: string;
  ano: number | string;
  preco: number;
  imagem?: string;
  descricao?: string;
}

interface Message {
  from: "user" | "bot";
  text?: string;
  veiculos?: Veiculo[];
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const enviarMensagem = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.text }),
      });

      const data = await res.json();

      if (data.veiculos) {
        const botMessage: Message = {
          from: "bot",
          text: data.mensagem,
          veiculos: data.veiculos,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          from: "bot",
          text: data.resposta || JSON.stringify(data),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Erro ao conectar com o servidor." },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-lg shadow-xl bg-[#0f0f10] flex flex-col h-[650px] border border-[#1f1f20]/80">
      <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center tracking-wide">
        MidNightBot
      </h2>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.text && (
              <div
                className={`
                  max-w-[80%] p-3 rounded-md break-words shadow-sm
                  ${msg.from === "user"
                    ? "bg-[#2a2a2d] text-gray-100 ml-auto"
                    : "bg-[#1c1c1e] text-gray-200 mr-auto"}
                `}
              >
                {msg.text}
              </div>
            )}

            {msg.veiculos && (
              <div className="space-y-4">
                {msg.veiculos.map((v, i) => (
                  <div
                    key={i}
                    className="bg-[#1c1c1e] text-gray-200 p-3 rounded-md shadow-sm mr-auto"
                  >
                    <h3 className="font-bold text-lg">{v.nome} ({v.marca})</h3>
                    <p className="text-sm">Ano: {v.ano}</p>
                    <p className="text-sm">Preço: R${v.preco.toLocaleString()}</p>
                    {v.descricao && <p className="text-sm mt-1">{v.descricao}</p>}
                    {v.imagem && (
                      <img
                        src={`http://localhost:3001${v.imagem}`}
                        alt={v.nome}
                        className="mt-2 w-full max-w-xs rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-[#1c1c1e] text-gray-300 p-3 rounded-md mr-auto shadow-sm animate-pulse">
            Digitando...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <form className="flex mt-4 gap-2" onSubmit={enviarMensagem}>
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-md border border-[#2f2f31] bg-[#141415] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3f3f40]"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#3a3a3d] text-gray-100 px-6 py-2 rounded-md hover:bg-[#4a4a4d]"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

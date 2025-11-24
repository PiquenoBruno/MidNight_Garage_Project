import { conexao } from "./connectModel";
import { Argumento } from "../interfaces/types";

const simbolosExtras = [
  '~', '`', '^', '_', '|', '@', '#', '$', '%', '&', '*',
  '+', '=', '<', '>', '\\', '¬', '§'
];
const regexExtras = new RegExp(
  `[${simbolosExtras.map(s => '\\' + s).join('')}]`,
  'g'
);

const verificar = async (argument: Argumento) => {
  const { clienteArgumento } = argument;

  if (!clienteArgumento) {
    return { mensagem: "Nenhum argumento informado.", veiculos: [] };
  }

  const argumento = clienteArgumento.toLowerCase();
  const argumentoFragmentado = argumento.split(" ");

  // pega todos os nomes de veículos
  const [rows] = await conexao.execute("SELECT name FROM veiculos");
  const lista = rows as any[];

  const nomes = lista.flatMap(nome =>
    nome.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}+/gu, "")
      .replace(/\p{P}+/gu, "")
      .replace(regexExtras, "")
      .trim()
      .split(" ")
  );

  // verifica quais palavras do argumento batem com nomes
  const inclusosEmNome = nomes.filter((item: any) =>
    argumentoFragmentado.some(arg => arg.length >= 3 && item.includes(arg))
  );

  if (inclusosEmNome.length > 0) {
    // monta query dinâmica com OR
    const placeholders = inclusosEmNome.map(() => "name LIKE ?").join(" OR ");
    const valores = inclusosEmNome.map(palavra => `%${palavra}%`);

    const [resultRows] = await conexao.execute(
      `SELECT * FROM veiculos WHERE ${placeholders}`,
      valores
    );

    // mapeia os resultados para incluir imagem
    const veiculos = (resultRows as any[]).map(v => ({
      nome: v.name || "Modelo não informado",
      marca: v.brand || "Marca não informada",
      ano: v.year || "Ano não informado",
      preco: v.price || 0,
      imagem: v.image || null, // <- pega a URL da imagem do banco
      descricao: v.description || ""
    }));

    return { mensagem: "Veículos encontrados:", veiculos };
  }

  return { mensagem: "Não temos esse modelo...", veiculos: [] };
};

export default {
  verificar
};

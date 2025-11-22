import { conexao } from "./connectModel";
import { Argumento } from "../interfaces/types";

const simbolosExtras = [
  '~', '`', '^', '_', '|', '@', '#', '$', '%', '&', '*',
  '+', '=', '<', '>', '\\', '¬', '§'
];
const regexExtras = new RegExp(`[${simbolosExtras.map(s => '\\' + s).join('')}]`, 'g');

const verificar = async (argument: Argumento) => {


    const { clienteArgumento } = argument
    const argumento = clienteArgumento.toLowerCase()
    const argumentoFragmentado = argumento.split(" ")

    const [rows] = await conexao.execute('SELECT name FROM veiculos')
    const lista = rows as any[]

    const nomes = lista.flatMap(nome => nome.name.toLowerCase().normalize('NFD').replace(/\p{M}+/gu, '').replace(/\p{P}+/gu, '').replace(regexExtras, '').trim().split(' '))
    

    let inclusosEmNome = nomes.filter((item: any) => {
        return argumentoFragmentado.some(arg => arg.length >= 3 && item.includes(arg));
    })
    console.log(inclusosEmNome)
    if (inclusosEmNome.length > 0) {
        if (inclusosEmNome.length > 1) {
            const results: any[] = [];
            for (const palavra of inclusosEmNome) {
                const [rows] = await conexao.execute(`SELECT * FROM veiculos WHERE name LIKE ?`, [`%${palavra}%`])
                results.push(rows)
            }
            console.log(results)
            return results
        } 
        const [result] = await conexao.execute(`SELECT * FROM veiculos WHERE name LIKE '%${inclusosEmNome}%'`)
        console.log(result)
        return result
        
    }

    return 'Não temos esse modelo...'


};

    


export default {
    verificar
}
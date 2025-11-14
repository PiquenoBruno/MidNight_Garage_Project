import { connectionModel } from "./connectionModels";
import { Carros, Motos } from "../interfaces/types";


// MANIPULACAO DA TABELA CARROS...
const listarCarros = async () => {
    const [listarCarros] = await connectionModel.execute(`SELECT * FROM carros`)
    return listarCarros
}
const novoCarro = async (body: Carros) => {
    const {modelo, marca, imagem, preco, logotipo} = body
    const query = `INSERT INTO carros (modelo, marca, imagem, preco, logotipo) VALUES (?,?,?,?,?)`
    const novoCarro = await connectionModel.execute(query, [modelo, marca, imagem, preco, logotipo])
    return novoCarro
}
const editarCarro = async (id: number, body: Carros) => {
    const {modelo, marca, imagem, preco, logotipo} = body
    const query = `UPDATE carros SET modelo=?, marca=?, imagem=?, preco=?, logotipo=? WHERE id=? `
    const [carroEditado] = await connectionModel.execute(query, [modelo, marca, imagem, preco, logotipo, id])
    return carroEditado
}
const removerCarro = async (id: number) => {
    const [carroRemovido] = await connectionModel.execute(`DELETE FROM carros WHERE id=?`,[id])
    return carroRemovido
}

// MANIPULACAO DA TABELA MOTOS...
const listarMotos = async () => {
    const [listaDeMotos] = await connectionModel.execute(`SELECT * FROM motos`)
    return listaDeMotos
}
const novaMoto = async (body: Motos) => {
    const {modelo, marca, imagem, preco, logotipo} = body
    const query = `INSERT INTO motos (modelo, marca, imagem, preco, logotipo) VALUES (?,?,?,?,?)`
    const novaMoto = await connectionModel.execute(query, [modelo, marca, imagem, preco, logotipo])
    return novaMoto
}
const editarMoto = async (id: number, body: Motos) => {
    const {modelo, marca, imagem, preco, logotipo} = body
    const query = `UPDATE motos SET modelo=?, marca=?, imagem=?, preco=?, logotipo=? WHERE id=? `
    const [motoEditada] = await connectionModel.execute(query, [modelo, marca, imagem, preco, logotipo, id])
    return motoEditada
}
const removerMoto = async (id: number) => {
    const [motoRemovida] = await connectionModel.execute(`DELETE FROM motos WHERE id=?`,[id])
    return motoRemovida
}

export default {
    listarCarros,
    novoCarro,
    editarCarro,
    removerCarro,
    listarMotos,
    novaMoto,
    editarMoto,
    removerMoto
}
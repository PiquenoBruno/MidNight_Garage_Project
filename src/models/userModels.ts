import { connectionModel } from "./connectionModels";

const listarUsuarios = async () => {
    const [listaDeUsuarios] = await connectionModel.execute(`SELECT * FROM usuarios`)
    return listaDeUsuarios
}
const listarAdms = async () => {
    const [listaDeAdms] = await connectionModel.execute(`SELECT * FROM administradores`)
    return listaDeAdms
}

export default {
    listarUsuarios,
    listarAdms
}
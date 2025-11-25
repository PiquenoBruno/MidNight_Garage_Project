// ISSO É PARA DEFINIR AS ROTAS DA SUA API
import express from 'express'
import path from 'path'

export const router =  express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'))
})

const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

// Carrega os relacionamentos das models
require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const ciclistaController = require('./controller/ciclista.controller')
const bicicletaController = require('./controller/bicicleta.controller')
const agendamentoController = require('./controller/agendamento.controller')

// ----- middlewares -----
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Rotas públicas
app.post('/ciclista', ciclistaController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Aplicação de Ciclistas Rodando!' })
})

// Middleware de Autenticação para proteger as rotas abaixo
app.use(authMiddleware)

// Rotas privadas do Ciclista (CRUD Completo)
app.get('/ciclistas', ciclistaController.listar)
app.get('/ciclista/buscarNome/:nome', ciclistaController.consultarNome)
app.get('/ciclista/:id', ciclistaController.consultar)
app.put('/ciclista/:id', ciclistaController.atualizar)
app.delete('/ciclista/:id', ciclistaController.apagar)

// Rotas privadas de Bicicleta e Agendamento
app.post('/bicicleta', bicicletaController.cadastrar)
app.post('/agendamento', agendamentoController.cadastrar)
app.put('/agendamento/:id', agendamentoController.atualizar)
app.get('/agendamentos', agendamentoController.listarAgenda)

// Sincroniza banco e inicia o servidor
conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao conectar com o banco de dados!', err)
    })
const Ciclista = require('../models/Ciclista')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.endereco || !valores.celular) {
        return res.status(400).json({ message: 'Todos os campos (nome, email, senha, cpf, endereço, celular) são obrigatórios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }

    try {
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Ciclista.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            endereco: valores.endereco,
            celular: valores.celular
        })

        return res.status(201).json({ message: 'Ciclista cadastrado com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar ciclista!' })
    }
}

const listar = async (req, res) => {
    try {
        const ciclistas = await Ciclista.findAll()
        let resultado = []

        ciclistas.forEach((el) => {
            let cpfDescriptografado = ''
            try {
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            } catch (err) {
                cpfDescriptografado = 'Erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCiclista: el.codCiclista,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                endereco: el.endereco,
                celular: el.celular
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar ciclistas:', err)
        return res.status(500).json({ message: 'Erro ao listar ciclistas!' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const ciclista = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(ciclista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular
        })
    } catch (err) {
        console.error('Erro ao consultar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao consultar ciclista!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const ciclista = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.senha) {
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Ciclista.update(dadosAtualizados, { where: { codCiclista: id } })
        return res.status(200).json({ message: 'Ciclista atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao atualizar ciclista!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const ciclista = await Ciclista.findByPk(id)
        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        await Ciclista.destroy({ where: { codCiclista: id } })
        return res.status(200).json({ message: 'Ciclista excluído com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar ciclista:', err)
        return res.status(500).json({ message: 'Erro ao apagar ciclista!' })
    }
}

const consultarNome = async (req, res) => {
    const nome = req.params.nome

    try {
        const ciclista = await Ciclista.findOne({ where: { nome: nome } })

        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(ciclista.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            email: ciclista.email,
            cpf: cpfDescriptografado,
            endereco: ciclista.endereco,
            celular: ciclista.celular
        })
    } catch (err) {
        console.error('Erro ao consultar ciclista por nome:', err)
        return res.status(500).json({ message: 'Erro ao consultar ciclista por nome!' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar, consultarNome }
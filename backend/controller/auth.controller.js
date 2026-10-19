const Ciclista = require('../models/Ciclista')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const login = async (req, res) => {
    const valores = req.body

    if (!valores.email || !valores.senha) {
        return res.status(400).json({ message: 'Informe e-mail e senha para realizar o login!' })
    }

    try {
        const ciclista = await Ciclista.findOne({ where: { email: valores.email } })

        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(ciclista.senha, CHAVE_SECRETA)
        const senhaBD = bytes.toString(CryptoJS.enc.Utf8)

        if (valores.senha !== senhaBD) {
            return res.status(401).json({ message: 'Senha incorreta!' })
        }

        const tresHorasEmMs = 3 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + tresHorasEmMs

        const payload = {
            idCiclista: ciclista.codCiclista,
            nome: ciclista.nome,
            expiraEm: tempoExpiracao
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token,
            nome: ciclista.nome
        })
    } catch (err) {
        console.error('Erro ao tentar fazer o login:', err)
        return res.status(500).json({ message: 'Erro ao tentar fazer o login!' })
    }
}

module.exports = { login }
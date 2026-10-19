const Bicicleta = require('../models/Bicicleta')
const Ciclista = require('../models/Ciclista')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.tipo || !valores.aro || !valores.idCiclista) {
        return res.status(400).json({ message: 'Todos os campos (modelo, tipo, aro, idCiclista) são obrigatórios!' })
    }

    try {
        const ciclista = await Ciclista.findByPk(valores.idCiclista)
        if (!ciclista) {
            return res.status(404).json({ message: 'Ciclista informado não existe!' })
        }

        const novaBicicleta = await Bicicleta.create(valores)
        return res.status(201).json({ message: 'Bicicleta cadastrada com sucesso!', bicicleta: novaBicicleta })
    } catch (err) {
        console.error('Erro ao cadastrar bicicleta:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar bicicleta!' })
    }
}

module.exports = { cadastrar }
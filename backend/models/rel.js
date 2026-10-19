const Ciclista = require('./Ciclista')
const Bicicleta = require('./Bicicleta')
const Agendamento = require('./Agendamento')

Ciclista.hasMany(Bicicleta, {
    foreignKey: 'idCiclista',
    as: 'bicicletasCiclista',
    onDelete: 'CASCADE'
})

Bicicleta.belongsTo(Ciclista, {
    foreignKey: 'idCiclista',
    as: 'ciclistaBicicleta',
    allowNull: false
})

Bicicleta.hasMany(Agendamento, {
    foreignKey: 'idBicicleta',
    as: 'agendamentosBicicleta',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Bicicleta, {
    foreignKey: 'idBicicleta',
    as: 'bicicletaAgendamento',
    allowNull: false
})

Ciclista.hasMany(Agendamento, {
    foreignKey: 'idCiclista',
    as: 'agendamentosCiclista',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Ciclista, {
    foreignKey: 'idCiclista',
    as: 'ciclistaAgendamento',
    allowNull: false
})

module.exports = { Ciclista, Bicicleta, Agendamento }
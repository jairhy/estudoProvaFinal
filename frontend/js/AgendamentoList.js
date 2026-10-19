const token = localStorage.getItem('token')

// Proteção da rota privada: sem token, avisa e manda para o login
if (!token) {
    alert('Faça login para acessar esta página.')
    location.href = './login.html'
}

// Só 401 significa sessão inválida/expirada; 400/404/500 trazem { message }
function tratarResposta(res) {
    if (res.status === 401) {
        localStorage.clear()
        alert('Sessão expirada, faça login novamente!')
        location.href = './login.html'
        throw new Error('Sessão expirada')
    }
    return res.json()
}

const resposta = document.getElementById('resposta')
const btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/agendamentos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
        .then(tratarResposta)
        .then(dados => {
            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
                return
            }
            resposta.innerHTML = `
            <table>
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
            `
        })
        .catch(err => {
            if (err.message === 'Sessão expirada') return
            console.error('Erro ao listar os dados', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        const nomeCiclista = el.ciclistaAgendamento ? el.ciclistaAgendamento.nome : 'N/A'
        const modeloBicicleta = el.bicicletaAgendamento ? `${el.bicicletaAgendamento.modelo} (Aro ${el.bicicletaAgendamento.aro})` : 'N/A'

        corpo += `<tr>`
        corpo += `<td>${el.codAgendamento || el.id}</td>`
        corpo += `<td>${el.data}</td>`
        corpo += `<td>${el.hora}</td>`
        corpo += `<td>${nomeCiclista}</td>`
        corpo += `<td>${modeloBicicleta}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Ciclista</th>
                <th>Bicicleta</th>
            </tr>
        </thead>
    `
}
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

const btn_consultar = document.getElementById('btn_consultar')
const resposta = document.getElementById('resposta')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    if (!nome) {
        resposta.innerHTML = '<p>Informe o nome do ciclista!</p>'
        return
    }

    fetch(`http://localhost:3000/ciclista/buscarNome/${encodeURIComponent(nome)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
        .then(tratarResposta)
        .then(dados => {
            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
            } else {
                const lista = Array.isArray(dados) ? dados : [dados]
                resposta.innerHTML = `
                <table>
                    ${criarThead()}
                    ${criarTbody(lista)}
                </table>
                `
            }
        })
        .catch(err => {
            if (err.message === 'Sessão expirada') return
            console.error('Erro ao consultar ciclista:', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codCiclista || el.id}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.cpf}</td>`
        corpo += `<td>${el.endereco}</td>`
        corpo += `<td>${el.celular}</td>`
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
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Celular</th>
            </tr>
        </thead>
    `
}
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

const btn_cadastrar = document.getElementById('btn_cadastrar')
const resposta = document.getElementById('resposta')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const valores = {
        modelo: document.getElementById('modelo').value,
        tipo: document.getElementById('tipo').value,
        aro: Number(document.getElementById('aro').value),
        idCiclista: Number(document.getElementById('idCiclista').value)
    }

    fetch('http://localhost:3000/bicicleta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(valores)
    })
        .then(tratarResposta)
        .then(dados => {
            resposta.innerHTML = `<p>${dados.message}</p>`
            document.querySelector('form').reset()
        })
        .catch(err => {
            if (err.message === 'Sessão expirada') return
            console.error('Erro ao cadastrar bicicleta:', err)
            resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
        })
})
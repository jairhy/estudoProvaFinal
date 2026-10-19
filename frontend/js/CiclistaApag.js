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

const btn_apagar = document.getElementById('btn_apagar')
const resposta = document.getElementById('resposta')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    if (!id) {
        resposta.innerHTML = '<p>Informe o Código do Ciclista!</p>'
        return
    }

    if (!confirm('Tem certeza que deseja excluir este ciclista?')) {
        return
    }

    fetch(`http://localhost:3000/ciclista/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
        .then(tratarResposta)
        .then(dados => {
            resposta.innerHTML = `<p>${dados.message}</p>`
            document.querySelector('form').reset()
        })
        .catch(err => {
            if (err.message === 'Sessão expirada') return
            console.error('Erro ao apagar ciclista:', err)
            resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
        })
})
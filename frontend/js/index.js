const verificar_log = document.getElementById('verificar_log')
const token = localStorage.getItem('token')
const nome = localStorage.getItem('nomeCiclista')

if (token) {
    verificar_log.innerHTML = `<a href="#" id="btn_logout">Logout</a> &emsp;`
    verificar_log.innerHTML += `<span class="titulo_menu">${nome}</span>`

    const btn_logout = document.getElementById('btn_logout')

    btn_logout.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.clear()
        location.reload()
    })
} else {
    verificar_log.innerHTML = `<a href="./html/login.html">Login</a>`

    // Sem login: links privados avisam e levam ao login (em vez de "voltar pra Home")
    const publicos = ['./index.html', './html/ciclista_cadastrar.html', './html/login.html']
    document.querySelectorAll('nav a').forEach(a => {
        const href = a.getAttribute('href')
        if (publicos.includes(href)) return
        a.addEventListener('click', (e) => {
            e.preventDefault()
            alert('Faça login para acessar esta página.')
            location.href = './html/login.html'
        })
    })
}
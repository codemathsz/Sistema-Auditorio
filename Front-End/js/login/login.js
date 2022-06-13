/* pegando os inputs pelo id */
const erro = getById('erro')
const nif = getById('nif')
const senha = getById('senha')
const btn = getById('btn')
btn.disabled = true
/* pegando o token do usuario */
const token = localStorage.getItem('token')

if (token == null) {
    nif.addEventListener('blur', () => {
        login()
    })

    senha.addEventListener('blur', () => {
        login()
    })

    form.addEventListener('submit', function () {
        /* evento para nao submeter o formulario */
        event.preventDefault();
        /* url que faz a conexão com a api do back-end */
        const url = `http://10.92.198.22:8080/api/usuario/login`;

        /* construindo o objeto agendamento */
        let login = {
            nif: nif.value,
            senha: senha.value
        }

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json')

        /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(login),
            headers: myHeaders
        }

        /* fazendo a conexão com a api */
        fetch(url, fetchData)
            .then((resp) => {
                resp.json()
                    .then((token) => {
                        console.log(token)
                        erro.style.animation = 'fadeOut 0.5s ease-in-out forwards';
                        localStorage.setItem('token', token.token)
                        window.location.href = '../../index.html'
                    })
                    .catch((error) => {
                        console.log(error)
                        erro.style.animation = 'fadeIn 0.5s ease-in-out forwards';
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    })
} else {
    window.location.href = '../../index.html'
}

function login() {
    if (nif.value != '' && senha.value != '') {
        btn.classList.add("btn_active")
        btn.disabled = false
    } else {
        btn.classList.remove("btn_active")
        btn.disabled = true
    }
}

function getById(id) {
    return document.getElementById(id)
}
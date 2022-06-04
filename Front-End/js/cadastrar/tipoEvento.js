const nome = getById('nome')
const submit = getById('submit')
submit.disabled = true

const mensagens = getById('mensagens')
let type = ''
let id = 0

nome.addEventListener('blur', () => {
    validaCadastro()
})

/* METODO POST ------------------------------------ */
const form = getById('form')
form.addEventListener('submit', function () {
    event.preventDefault();
    const url = `http://10.92.198.22:8080/api/tipo`;

    let tipo = {
        nome: nome.value
    }


    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    let fetchData = {
        method: 'POST',
        body: JSON.stringify(tipo),
        headers: myHeaders
    }

    fetch(url, fetchData)
        .then((resp) => {
            resp.json()
                .then((resposta) => {
                    console.log(resposta)
                        if (resposta.statusCode == 'INTERNAL_SERVER_ERROR') {
                            console.log('erro')
                            type = 'error'
                            createMessage(resposta.mensagem, type)
                        } else {
                            console.log('sucesso')
                            type = 'success'
                            createMessage(`Sucesso ao cadastrar o tipo ${nome.value}!`, type)
                            clearForm()
                            setTimeout(() => {
                                window.location.reload()
                            }, 9000);
                        }
                        console.log(id)
                        deleteMessage()
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
})

function getById(id) {
    return document.getElementById(id)
}

/* função que limpa qualquer elemento */
function clearElement(element) {
    element.innerText = ''
}

/* método que cria um elemento */
function createNode(element) {
    return document.createElement(element)
}

/* método que indica quem é filho de quem */
function append(parent, el) {
    return parent.appendChild(el);
}


function clearForm() {
    nome.value = ''
    submit.disabled = true
    validaCadastro()
}

function validaCadastro() {
    if (nome.value != '') {
        submit.classList.add("btn_active")
        submit.disabled = false
    } else {
        submit.classList.remove("btn_active")
        submit.disabled = true
    }
}


function createMessage(msg, type) {
    id++
    let message = createNode('div')
    message.classList.add('message')
    message.id = 'message' + id

    let messageContent = createNode('div')
    messageContent.classList.add('msg-content')

    let i = createNode('i')
    i.classList.add('bx')
    i.classList.add('bx-tada')
    if (type == 'success') {
        i.classList.add('bx-check')
        i.style.color = 'green'
    } else {
        i.classList.add('bx-x')
        i.style.color = 'rgb(255, 11, 27)'
    }

    let p = createNode('p')
    p.innerHTML = msg

    append(message, messageContent)
    append(messageContent, i)
    append(messageContent, p)

    let time = createNode('div')
    time.classList.add('msgTempo')

    let timeBar = createNode('div')
    timeBar.classList.add('barraTempo')

    append(message, time)
    append(time, timeBar)
    append(mensagens, message)
}

function deleteMessage() {
    for (let i = 0; i <= id; i++) {
        let element = getById('message' + i)
        if (element != null) {
            setTimeout(() => {
                mensagens.removeChild(element)
            }, 9000);
        } else {
            continue
        }
    }
}
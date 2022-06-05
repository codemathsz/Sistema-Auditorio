
/* pegando os inputs pelo id */
const form = getById('form')
const titulo = getById('titulo')
const descricao = getById('descricao')
const dataInicio = getById('dataInicio')
const dataFinalizada = getById('dataFinalizada')
const escolhaHoras = getById('choice-hora')
const escolhaPeriodo = getById('choice-periodo')
const horaInicio = getById('horaInicio')
const horaFinalizada = getById('horaFinalizada')
const periodo = getById('periodo')
const tipo = getById('tipo')
const submit = getById('submit')
submit.disabled = true

const mensagens = getById('mensagens')
let type = ''
let id = 0

/* criando variaveis do tipo string para armazenar hora e minuto */
let hora = '00'
let minutos = '00'
/* array que tem duas posições, 00 e 30, que sáo os minutos do array */
let min = ["00", "30"]
/* criando variaveis para formatar a hora e o minuto */
let horaFormat = ''
let minutoFormat = ''
/* variavel que controla a posicao do for */
let controlador = 1
/* variaveis que vao indicar a diferencas entre a gora final e a hora inicial no select da hora final */
let minutosDiferenca = 0
let horaDiferenca = ''

/* pegando o token do usuario */
const token = localStorage.getItem('token')
const payload = parseJwt(token)

if (token == null) {
    window.location.href = '../login.html'
} else {
    if (payload.nivel == 1) {
        titulo.addEventListener('blur', () => {
            validaCadastro()
        })

        descricao.addEventListener("blur", () => {
            validaCadastro()
        })

        dataInicio.addEventListener("blur", () => {
            validaCadastro()
        })

        dataFinalizada.addEventListener("blur", () => {
            validaCadastro()
        })

        /* evento no select da hora inicio para quando o valor for trocado ele atualiza o select com os valores novos */
        horaInicio.addEventListener("change", () => {
            createHoraFinalizada(horaFormat, minutoFormat)
        })

        const checks = document.getElementsByName('check')
        let validaChecks = ''
        for (let i = 0; i < checks.length; i++) {
            checks[i].addEventListener('click', () => {
                validaCadastro()
                if (i == 0) {
                    horaInicio.innerText = ''
                    createHoraInicio()
                    /* criando o select da horaFinalizada com hora e minutos formatados */
                    createHoraFinalizada(horaFormat, minutoFormat)
                    showHoras()

                    validaChecks = 0
                } else if (i == 1) {
                    showPeriodo()
                    validaChecks = 1

                } else {
                    hiddenChoice()
                    validaChecks = 2
                }
            })
        }

        /* METOD GET ------------------ */
        /* Preenchendo o select do tipo */
        /* Url da lista do tipo */
        const urlTipo = 'http://10.92.198.22:8080/api/tipo'
        /* variavel que pega o select do html */
        const select = tipo
        /* fazendo conexão com a api */
        fetch(urlTipo)
            .then((resp) => {
                resp.json()
                    .then(data => {
                        /* dando um nome para o objeto */
                        let tipos = data
                        /* fazendo tipo um forEach por cada tipo */
                        return tipos.map((tipo) => {
                            /* criando um elemento option */
                            let option = createNode('option')
                            /* colocando no valor desse option o id do tipo */
                            option.value = tipo.id
                            /* colocando no texto desse option o nome do tipo */
                            option.innerHTML = tipo.nome

                            /* falando que o option é filho do select */
                            append(select, option)
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
            })

        /* METODO POST ------------------------------------ */
        form.addEventListener('submit', function () {
            /* evento para nao submeter o formulario */
            event.preventDefault();
            /* url que faz a conexão com a api do back-end */
            const urlAgendamento = `http://10.92.198.22:8080/api/agendamento`;

            /* variavel para formatar a horaFinalizada para apenas pegar a hora e nao a hora de diferença */
            let horaFinalizadaFormatada = horaFinalizada.value.substring(0, 5)
            let horaInicioFormatada = horaInicio.value

            console.log(horaInicio.value)
            if (validaChecks == 0) {
                periodo.value = ''
            } else if (validaChecks == 1) {
                horaInicioFormatada = '00:00'
                horaFinalizadaFormatada = '00:00'
            } else {
                periodo.value = ''
                horaInicioFormatada = '00:00'
                horaFinalizadaFormatada = '00:00'
            }

            /* construindo a váriavel da dataInicio e dataFinalizada completa, precisa-se ter a data e a hora juntas */
            const dataInicioCompleta = dataInicio.value + "T" + horaInicioFormatada + ":00"
            const dataFinalizadaCompleta = dataFinalizada.value + "T" + horaFinalizadaFormatada + ":00"

            /* construindo o objeto agendamento */
            let agendamento = {
                title: titulo.value,
                descricao: descricao.value,
                start: dataInicioCompleta,
                end: dataFinalizadaCompleta,
                periodo: periodo.value == '' ? null : periodo.value,
                tipo: {
                    id: tipo.value
                },
                usuario: {
                    id: payload.id
                }
            }

            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            myHeaders.append('Authorization', token)

            /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
            let fetchData = {
                method: 'POST',
                body: JSON.stringify(agendamento),
                headers: myHeaders
            }

            /* fazendo a conexão com a api */
            fetch(urlAgendamento, fetchData)
                .then((resp) => {
                    console.log(resp)
                    resp.json()
                        .then((resposta) => {
                            console.log(resposta)
                            if (resposta.statusCode == 'UNAUTHORIZED') {
                                console.log('erro')
                                type = 'error'
                                createMessage(resposta.mensagem, type)
                            } else {
                                console.log('sucesso')
                                type = 'success'
                                createMessage('Sucesso ao cadastrar o agendamento!', type)
                                clearForm()
                                setTimeout(() => {
                                    window.location.reload()
                                }, 8000);
                            }
                            console.log(id)
                            deleteMessage()
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
    } else {
        window.location.href = '../../index.html'
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

function createHoraInicio() {
    /* for para percorrer as horas, e começa valendo 08 */
    for (let h = 8; h < 23; h++) {
        /* for para percorrer duas vezes a hora e setar as duas posicoes do array de minutos na hora */
        for (let m = 0; m < minutos.length; m++) {
            /* criando um option */
            const option = createNode('option')
            /* if para colocar um 0 antes da hora se for menor que 10 */
            if (h < 10) {
                hora = '0' + h
            } else {
                hora = h
            }
            /* colocando os minutos na hora, posicao 1 do vetor e dps posicao 2 do vetor */
            minutos = min[m]
            /* setando a data no option */
            option.innerHTML = hora + ":" + minutos
            /* quando chegar o option que marca 22:30 ele da um break para nao imprimir o 22:30 pois nao tem como começar um agendamento nesse horario */
            if (option.value == '22:30') {
                break
            }
            /* falando que o option é filho do select */
            append(horaInicio, option)
        }
    }
}

/* função que cria o select da horaFinalizada */
function createHoraFinalizada(horaFormat, minutoFormat) {
    /* instanciando a variavel da diferenca da hora, ela começa valendo vazia */
    horaDiferenca = ''
    /* método que limpa o select antes de criar */
    clearElement(horaFinalizada)
    /* vendo se os minutos são diferentes de 00 */
    if (!(horaInicio.value.substring(3, 5) == '00')) {
        /* vendo se a hora é 08 ou 09, pois assim tiramos o primeiro numero, caso contrario deixamos */
        if (parseInt(getHora(horaInicio)) < 10) {
            /* tirando o primeiro caracter e adicionando uma hora */
            horaFormat = parseInt(horaInicio.value.substring(1, 2)) + 1
        } else {
            /* apenas adicionando uma hora */
            horaFormat = parseInt(getHora(horaInicio)) + 1
        }
        /* quando o minuto da horaInicio for 30 falamos que aqui tambem vai ser 30 */
        minutoFormat = '30'
        /* se os minutos da hora de cima forem == 0 */
    } else {
        /* mesmo if para retirar caracter de cima, mas aqui nao adicionamos uma hora */
        if (parseInt(horaInicio.value.substring(0, 2)) < 10) {
            horaFormat = parseInt(horaInicio.value.substring(1, 2))
        } else {
            horaFormat = parseInt(getHora(horaInicio))
        }
        /* se cair aqui é porque os minutos da hora de cima sao 00:00 e aqui tambem sao */
        minutoFormat = '00'
    }
    /* resetando a variavel minutoDifenca */
    minutosDiferenca = 0
    /* zerando a variavel controlador para que sempre ocorra a mudança no horaInicio o controlador comece valendo 1 */
    controlador = 1
    /* for para percorrer as horas, e começa valendo a variavel horaFormat */
    for (let h = horaFormat; h < 23; h++) {
        /* for para percorrer duas vezes a hora e setar as duas posicoes do array na hora */
        for (let m = 0; m < minutos.length; m++) {
            /* toda vez que passar por esse for a diferenca entre a hora inicial e a hora final vai incrementando de 30 em 30 */
            minutosDiferenca += 30
            /* dando o o retorno do metodo converterMinutosParaHora(minutosDiferenca) para a variavel horaDiferenca */
            horaDiferenca = converterMinutosParaHora(minutosDiferenca)
            /* criando um option */
            const option = createNode('option')
            /* if para colocar um 0 antes da hora se for menor que 10 */
            if (h < 10) {
                hora = '0' + h
            } else {
                hora = h
            }
            /* vendo se os minutos do select anterior é 00 e vendo se é a primeira vez que estamos passando no for */
            if (minutoFormat == '00' && controlador == 1) {
                /* setando a segunda posição do vetor nos minutos, que no caso são '30' */
                minutos = min[m + 1]

                /* falando que a variavel controlador é igual a 2 pra ele nunca mais passar por esse if */
                controlador++
                /* setando a hora no option */
                setHoraFinalInOption(horaFinalizada, option, hora, minutos, horaDiferenca)

                /* dando um continue para ele ir pra segunda repetição e nao continuar nessa... */
                break
            } else {
                minutos = min[m]
                /* vendo se o valor do select é 22:30 para ele nao repetir duas vezes no for e acabar imprimido duas vezes tbm */
                if (horaFinalizada.value == '22:30') {
                    break
                }
                /* setando a hora no option */
                setHoraFinalInOption(horaFinalizada, option, hora, minutos, horaDiferenca)
            }
        }
    }
}

/* função que converte uma quantidade de minutos para hora */
function converterMinutosParaHora(minutos) {
    let hora = 0
    /* um while para repetir se a quantidade de minutos passada no parametro é maior ou igual a 60 */
    while (minutos >= 60) {
        /* se a quantidade de minutos for maior que 60, eu tiro 60 minutos e adiciono 1 a variavel da hora */
        minutos = minutos - 60
        hora++
    }
    /* if para formatação do texto */
    /* se a hora for menor que 10 e os minutos forem iguais a 0 */
    if (hora < 10 && minutos == 0) {
        /* retorna Ex: 01h 00min */
        return `0${hora}h ${minutos}0min`
        /* se a hora for maior ou igual a 10 e os minutos iguais a 0 */
    } else if (hora >= 10 && minutos == 0) {
        /* retorna Ex: 10h 00min */
        return `${hora}h ${minutos}0min`
        /* se a hora for menor que 1p e os minutos forem igual a 30*/
    } else if (hora < 10 && minutos == 30) {
        /* retorna Ex: 01h 30min */
        return `0${hora}h ${minutos}min`
        /* se a hora for maior ou igual a 10 e os minutos forem iguais a 30*/
    } else if (hora >= 10 && minutos == 30) {
        /* retorna Ex: 10h 30min */
        return `${hora}h ${minutos}min`
    }
}

/* função que coloca as horas no option do select da horaFinalizada */
function setHoraFinalInOption(select, option, hora, minutos, horaDiferenca) {
    /* se a horaDiferenca chegar assim 00h 30min */
    if (horaDiferenca == '00h 30min') {
        /* o option fica com o valor: (30min) */
        option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca.substring(4, 9) + ")"
        /* se os minutos chegarem igual a 00*/
    } else if (horaDiferenca.substring(4, 6) == '00') {
        /* vendo se a a hora é menor que 10, mas a validação eu pego o primeiro caracter, se for 0, Ex: 01h eu tiro esse 0 da frente */
        if (horaDiferenca.substring(0, 1) == '0') {
            /* o option fica com o valor Ex: (1h) */
            option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca.substring(1, 3) + ")"
        } else {
            /* o option fica com o valor Ex: (10h) */
            option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca.substring(0, 3) + ")"
        }
        /* se os minutos forem iguais a 30 */
    } else {
        /* vendo se a a hora é menor que 10, mas a validação eu pego o primeiro caracter, se for 0, Ex: 01h eu tiro esse 0 da frente */
        if (horaDiferenca.substring(0, 1) == '0') {
            /* o option fica com o valor Ex: (1h 30min) */
            option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca.substring(1, 10) + ")"
        } else {
            /* o option fica com o valor Ex: (10h 30min) */
            option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca + ")"
        }
    }

    /* falando que o option é filho do select */
    append(select, option)
}

/* função que pega apenas a hora em si da hora completa */
function getHora(element) {
    const elementFormat = element.value.substring(0, 2)
    return elementFormat
}

/* função que limpa qualquer elemento */
function clearElement(element) {
    element.innerText = ''
}


function clearForm() {
    titulo.value = ''
    descricao.value = ''
    tipo.value = ''
    dataInicio.value = ''
    dataFinalizada.value = ''
    horaInicio.value = ''
    checks[0].checked = false
    checks[1].checked = false
    checks[2].checked = false
    hiddenChoice()
    submit.disabled = true
    validaCadastro()
}

function validaCadastro() {
    if (titulo.value != '' && descricao.value != '' && tipo.value != '' && dataInicio.value != '' && dataFinalizada.value != '' && validaChecks.value != '') {
        submit.classList.add("btn_active")
        submit.disabled = false
    } else {
        submit.classList.remove("btn_active")
        submit.disabled = true
    }
}


function showHoras() {
    escolhaPeriodo.classList.remove('show')
    escolhaPeriodo.classList.add('hidden')
    escolhaHoras.classList.remove('hidden')
    submit.style.transform = 'translateY(-20px)'
    escolhaHoras.classList.add('show')
}

function showPeriodo() {
    escolhaHoras.classList.remove('show')
    escolhaHoras.classList.add('hidden')
    escolhaPeriodo.classList.remove('hidden')
    submit.style.transform = 'translateY(-20px)'
    escolhaPeriodo.classList.add('show')
}

function hiddenChoice() {
    escolhaPeriodo.classList.remove('show')
    escolhaPeriodo.classList.add('hidden')
    escolhaHoras.classList.remove('show')
    escolhaHoras.classList.add('hidden')
    submit.style.transform = 'translateY(-50px)'
}

/* método que pega os elementos pelo id */
function getById(id) {
    return document.getElementById(id)
}

/* método que cria um elemento */
function createNode(element) {
    return document.createElement(element)
}

/* método que indica quem é filho de quem */
function append(parent, el) {
    return parent.appendChild(el);
}

/* função que decodifica o token */
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
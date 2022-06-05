/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* input da busca */
const id = getById('id')
/* pegando o valor do input da busca */
let valor = id.value;
/* pegando a tabela */
const table = getById('tabela')
/* pegando o tbody */
const tbody = getById('tbody')
/* pegando a modal de alteração */
const modalAlterar = getById('modalAlterar')

/* pegando o token do usuario */
const token = localStorage.getItem('token')
const payload = parseJwt(token)

if (token == null) {
    window.location.href = '../../../login.html'
} else {
    if (payload.nivel == 1) {
        /* pegando o botao que faz a procura */
        const botaoProcurar = getById('search')
        /* adiciona um escutador de evento ao meu botão, que no caso é o evento de click */
        botaoProcurar.addEventListener('click', () => {
            /* reinicializando a variavel do valor */
            valor = id.value
            /* vendo se o valor é diferente de vazio */
            if (valor != '') {
                /* método que limpa o tbody */
                clearTbody()
                /* url de consumo da api que busca um agendamento por id */
                const url = `http://localhost:8080/api/agendamento/${valor}`
                /* método que faz a conexão com a api de pegar pelo id */
                getId(url);
            } else {
                /* se o input for vazio ele faz a busca de todos os agendamentos */
                /* método que limpa o tbody */
                clearTbody();
                /* url que busca todos os agendamentos */
                const url = `http://localhost:8080/api/agendamento`
                /* método que faz a conexão da api que traz todos os agendamentos */
                getAll(url);
            }
        })
        /* if pra ver se o valor do input da busca é vazio */
        /* que no caso sempre que carregarmos ou recarregarmos a pagina ele vai estar vazio, logo entrando no if */
        if (valor == '') {
            /* método que limpa o tbody */
            clearTbody();
            /* url que busca todos os agendamentos */
            const url = `http://localhost:8080/api/agendamento`
            /* método que faz a conexão com a api que traz todos os agendamentos */
            getAll(url);
        }
    } else {
        window.location.href = '../../../index.html'
    }
}

/* método que faz a conexão com a api que traz um agendamento por id */
function getId(url) {
    /* fazendo a conexão com a url fornecida */
    fetch(url)
        .then((resp) => {
            resp.json()
                .then(data => {
                    /* método que cria as tr */
                    console.log(data)
                    createTbody(data)
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
}

/* método que faz a conexão com a api que traz todos os agendamentos */
function getAll(url) {
    /* fazendo conexão com a url fornecida */
    fetch(url)
        .then((resp) => {
            resp.json()
                .then(data => {
                    console.log(data)
                    /* fazendo um forEach no array de agendamentos */
                    /* para cada agendamento ele cria um objeto agendamento */
                    return data.map((agendamento) => {
                        /* método que cria o tbody */
                        createTbody(agendamento)
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
}

/* método que cria tudo dentro do tbody */
/* cria as tr, e as tds e coloca os valores do objeto agendamento dentro de seu respectivo campo*/
function createTbody(agendamento) {
    /* criando a tr dentro do tbody */
    const tr = createNode('tr')

    /* criando as tds e colocando seus respectivos valores */
    let tdId = createNode('td')
    tdId.innerHTML = `${agendamento.id}`

    let tdTitulo = createNode('td')
    tdTitulo.innerHTML = `${agendamento.title}`

    let tdDescricao = createNode('td')
    tdDescricao.innerHTML = `${agendamento.descricao.substring(0, 15)}...`

    let tdDataInicio = createNode('td')
    /* formatando a data para padrão brasileiro */
    const dataInicioFormat = agendamento.dataInicioFormat.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1')
    tdDataInicio.innerHTML = dataInicioFormat

    let tdDataFinalizada = createNode('td')
    /* formatando a data para padrão brasileiro */
    const dataFinalizadaFormat = agendamento.dataFinalizadaFormat.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1')
    tdDataFinalizada.innerHTML = dataFinalizadaFormat

    let tdHoraInicio = createNode('td')
    tdHoraInicio.innerHTML = `${agendamento.horaInicio}`

    let tdHoraFinalizada = createNode('td')
    tdHoraFinalizada.innerHTML = `${agendamento.horaFinalizada}`

    let tdStatus = createNode('td')
    tdStatus.innerHTML = `${agendamento.status}`

    let tdPeriodo = createNode('td')
    tdPeriodo.innerHTML = `${agendamento.periodo}`

    let tdTipo = createNode('td')
    tdTipo.innerHTML = `${agendamento.tipo.nome}`

    let tdUsuario = createNode('td')
    tdUsuario.innerHTML = `${agendamento.usuario.nome}`

    let tdAlterar = createNode('td')
    /* cria o botao de alteração */
    const btnAlterar = createNode('button');
    btnAlterar.innerHTML = 'Alterar'

    let show = false
    btnAlterar.addEventListener('click', () => {
        if (show === false) {
            modalAlterar.classList.add('show')
            show = true

            /* pegando os inputs pelo id */
            const form = getById('form')
            const id = getById('id')
            const titulo = getById('titulo')
            const descricao = getById('descricao')
            const dataInicio = getById('dataInicio')
            const dataFinalizada = getById('dataFinalizada')
            const horaInicio = getById('horaInicio')
            const horaFinalizada = getById('horaFinalizada')
            const status = getById('status')
            const periodo = getById('periodo')
            const tipo = getById('tipo')

            /* Preenchendo o formulario com id fornecido */
            /* colocando o valor do respectivo agendamento pelo input do id */
            id.value = agendamento.id

            /* pegando o valor que acabamos de colocar */
            const valor = id.value

            /* url do agendamento com o valor do input do id */
            const urlAgendamento = `http://localhost:8080/api/agendamento/${valor}`

            /* fazendo conexão com a api */
            fetch(urlAgendamento)
                /* transformando a resposta em json */
                .then((resp) => {
                    resp.json()
                        .then(data => {
                            /* pegando os valores do json e colocando nos inputs */
                            titulo.value = data.title
                            descricao.value = data.descricao
                            dataInicio.value = data.dataInicioFormat
                            dataFinalizada.value = data.dataFinalizadaFormat
                            horaInicio.value = data.horaInicio
                            horaFinalizada.value = data.horaFinalizada
                            status.value = data.status
                            periodo.value = data.periodo
                            tipo.value = data.tipo.id
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error);
                })

            /* METOD GET ------------------ */
            /* Preenchendo o select do tipo */
            /* Url da lista do tipo */
            const urlTipo = 'http://localhost:8080/api/tipo'
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
                    console.log(error)
                })

            /* METODO PUT ------------------------------------ */
            /* pegando as informações alteradas do formulario e fazendo a alteração pelo método put */

            /* adicionando um evento submit no form */
            form.addEventListener('submit', function () {
                /* evitando que ele submeta */
                event.preventDefault();

                /* url do agendamento com o valor do input do id */
                const urlAgendamento = `http://localhost:8080/api/agendamento/${valor}`

                /* construindo a váriavel da dataInicio e dataFinalizada completa, precisa-se ter a data e a hora juntas */
                const dataInicioCompleta = dataInicio.value + "T" + horaInicio.value + ":00"
                const dataFinalizadaCompleta = dataFinalizada.value + "T" + horaFinalizada.value + ":00"

                /* construindo o objeto agendamento */
                let agendamento = {
                    id: valor,
                    title: titulo.value,
                    descricao: descricao.value,
                    start: dataInicioCompleta,
                    end: dataFinalizadaCompleta,
                    status: status.value,
                    periodo: periodo.value,
                    tipo: {
                        id: tipo.value
                    },
                    usuario: {
                        id: payload.id
                    }
                }

                const myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')

                /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
                let fetchData = {
                    method: 'PUT',
                    body: JSON.stringify(agendamento),
                    headers: myHeaders
                }

                /* fazendo a conexão com a api */
                fetch(urlAgendamento, fetchData)
                    .then((resp) => {
                        resp.json()
                            .then((resposta) => {
                                console.log(resposta)
                                window.location.reload()
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });

        }
        const btnFecharModal = getById('close')
        btnFecharModal.addEventListener('click', () => {
            if (show === true) {
                modalAlterar.classList.remove('show')
                show = false
            }
        })
    })

    let tdDeletar = createNode('td')
    /* cria o botao de alteração */
    const btnDeletar = createNode('button')
    btnDeletar.innerHTML = 'Deletar'

    btnDeletar.addEventListener('click', () => {
        const valor = tdId.innerHTML

        const urlAgendamento = `http://localhost:8080/api/agendamento/${valor}`
        const resultado = confirm(`Deseja deletar o agendamento do id: ${valor}?`)
        if (resultado == true) {
            /* construindo o objeto agendamento */
            let agendamento = {
                id: valor
            }

            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')

            /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
            let fetchData = {
                method: 'DELETE',
                body: JSON.stringify(agendamento),
                headers: myHeaders
            }
            fetch(urlAgendamento, fetchData)
                .then((resp) => {
                    resp.json()
                        .then(data => {
                            alert("O agendamento foi excluido.")
                            window.location.reload()
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })

    /* apontando quem é filho de quem para que a construção do tbody seja feita com sucesso */
    append(table, tbody)
    append(tbody, tr)
    append(tr, tdId)
    append(tr, tdTitulo)
    append(tr, tdDescricao)
    append(tr, tdDataInicio)
    append(tr, tdDataFinalizada)
    append(tr, tdHoraInicio)
    append(tr, tdHoraFinalizada)
    append(tr, tdStatus)
    append(tr, tdPeriodo)
    append(tr, tdTipo)
    append(tr, tdUsuario)
    append(tdAlterar, btnAlterar)
    append(tr, tdAlterar)
    append(tdDeletar, btnDeletar)
    append(tr, tdDeletar)
}

/* função que limpa o tbody */
function clearTbody() {
    tbody.innerText = '';
}

/* função que cria o elemento */
function createNode(element) {
    return document.createElement(element)
}

/* função que aponta quem é filho de quem */
function append(parent, el) {
    return parent.appendChild(el);
}

/* função para pegar um elemento pelo id */
function getById(id) {
    return document.getElementById(id)
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
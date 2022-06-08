/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* input da busca */
const id = getById("id");
/* pegando o valor do input da busca */
let valor = id.value;
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");
const modalInfo = getById("modalInfo");

/* pegando o token do usuario */
const token = localStorage.getItem("token");
const payload = parseJwt(token);

if (token == null) {
  window.location.href = "../../../login/login.html";
} else {
  if (payload.nivel == 1) {
    /* pegando o botao que faz a procura */
    const botaoProcurar = getById("search");
    /* adiciona um escutador de evento ao meu botão, que no caso é o evento de click */
    botaoProcurar.addEventListener("click", () => {
      /* reinicializando a variavel do valor */
      valor = id.value;
      /* vendo se o valor é diferente de vazio */
      if (valor != "") {
        /* método que limpa o tbody */
        clearTbody();
        /* url de consumo da api que busca um agendamento por id */
        const url = `http://10.92.198.22:8080/api/agendamento/${valor}`;
        /* método que faz a conexão com a api de pegar pelo id */
        getId(url);
      } else {
        /* se o input for vazio ele faz a busca de todos os agendamentos */
        /* método que limpa o tbody */
        clearTbody();
        /* url que busca todos os agendamentos */
        const url = `http://10.92.198.22:8080/api/agendamento`;
        /* método que faz a conexão da api que traz todos os agendamentos */
        getAll(url);
      }
    });
    /* if pra ver se o valor do input da busca é vazio */
    /* que no caso sempre que carregarmos ou recarregarmos a pagina ele vai estar vazio, logo entrando no if */
    if (valor == "") {
      /* método que limpa o tbody */
      clearTbody();
      /* url que busca todos os agendamentos */
      const url = `http://10.92.198.22:8080/api/agendamento`;
      /* método que faz a conexão com a api que traz todos os agendamentos */
      getAll(url);
    }
  } else {
    window.location.href = "../../../index.html";
  }
}

/* método que faz a conexão com a api que traz um agendamento por id */
function getId(url) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
  let fetchData = {
    method: "GET",
    headers: myHeaders,
  };
  /* fazendo a conexão com a url fornecida */
  fetch(url, fetchData)
    .then((resp) => {
      resp
        .json()
        .then((data) => {
          /* método que cria as tr */
          console.log(data);
          createTbody(data);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

/* método que faz a conexão com a api que traz todos os agendamentos */
function getAll(url) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
  let fetchData = {
    method: "GET",
    headers: myHeaders,
  };
  /* fazendo conexão com a url fornecida */
  fetch(url, fetchData)
    .then((resp) => {
      resp
        .json()
        .then((data) => {
          console.log(data);
          /* fazendo um forEach no array de agendamentos */
          /* para cada agendamento ele cria um objeto agendamento */
          let i = 0;
          return data.map((agendamento) => {
            /* método que cria o tbody */
            createTbody(agendamento, i);
            i++;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

/* método que cria tudo dentro do tbody */
/* cria as tr, e as tds e coloca os valores do objeto agendamento dentro de seu respectivo campo*/
function createTbody(agendamento, index) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");
  if (index % 2 == 1) {
    tr.style.backgroundColor = "#f0f0f0";
  }
  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${agendamento.id}`;

  let tdTitulo = createNode("td");
  tdTitulo.innerHTML = `${agendamento.title}`;

  /* let tdDescricao = createNode('td')
    tdDescricao.innerHTML = `${agendamento.descricao.substring(0, 15)}...` */

  let tdData = createNode("td");
  /* formatando a data para padrão brasileiro */
  const dataInicioFormat = agendamento.dataInicioFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  const dataFinalizadaFormat = agendamento.dataFinalizadaFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  if (dataInicioFormat == dataFinalizadaFormat) {
    tdData.innerHTML = `${dataInicioFormat}`;
  } else {
    tdData.innerHTML = `${dataInicioFormat} - ${dataFinalizadaFormat}`;
  }

  /* formatando a data para padrão brasileiro */

  let tdHora = createNode("td");
  tdHora.innerHTML = `${agendamento.horaInicio} - ${agendamento.horaFinalizada}`;

  let tdStatus = createNode("td");
  let divStatus = createNode("div");
  divStatus.classList.add("status");
  let divSpanStatus = createNode("div");
  divSpanStatus.classList.add("spanStatus");
  let spanStatus = createNode("span");
  if (agendamento.status == "PENDENTE") {
    /* AMARELO */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#fff9c4", "#fbc02d");
  } else if (agendamento.status == "RECUSADO") {
    /* VERMELHO */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#ef9a9a", "#d32f2f");
  } else if (agendamento.status == "ACEITO") {
    /* VERDE */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#c8e6c9", "#388e3c");
  } else {
    /* AZUL */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#b3e5fc", "#0288d1");
  }
  spanStatus.innerHTML = `${agendamento.status.substring(
    0,
    1
  )}${agendamento.status.substring(1, 10).toLowerCase()}`;

  /* let tdPeriodo = createNode('td')
    let periodo = ''
    if (agendamento.periodo == 'MANHA') {
        periodo = 'Manhã'
    } else if (agendamento.periodo == 'TARDE') {
        periodo = 'Tarde'
    } else if (agendamento.periodo == 'NOITE') {
        periodo = 'Noite'
    } else if (agendamento.periodo == 'MANHA_TARDE') {
        periodo = 'Manhã e Tarde'
    } else if (agendamento.periodo == 'TARDE_NOITE') {
        periodo = 'Tarde e Noite'
    } else {
        periodo = 'Manhã, Tarde e Noite'
    }
    tdPeriodo.innerHTML = periodo */

  /* let tdTipo = createNode('td')
    tdTipo.innerHTML = `${agendamento.tipo.nome}` */

  let tdUsuario = createNode("td");
  tdUsuario.innerHTML = `${agendamento.usuario.nome}`;

  let tdAlterar = createNode("td");
  /* cria o botao de alteração */
  const btnAlterar = createNode("button");
  btnAlterar.className = "btnAlterar";
  let iAlterar = createNode("i");
  iAlterar.classList.add("bx");
  iAlterar.classList.add("bxs-edit-alt");
  iAlterar.classList.add("alterar");

  let show = false;
  btnAlterar.addEventListener("click", () => {
    if (show === false) {
      modalAlterar.classList.add("show");
      show = true;
    }

    /* Preencher os inputs do formulario de cadastro, mas vamos alterar! */

    const btnFecharModalAlterar = getById("close");
    btnFecharModalAlterar.addEventListener("click", () => {
      if (show === true) {
        modalAlterar.classList.remove("show");
        show = false;
      }
    });
  });

  let tdDeletar = createNode("td");
  /* cria o botao de alteração */
  const btnDeletar = createNode("button");
  btnDeletar.classList.add("btnDeletar");
  let iDeletar = createNode("i");
  iDeletar.classList.add("bx");
  iDeletar.classList.add("bxs-trash-alt");
  iDeletar.classList.add("deletar");

  btnDeletar.addEventListener("click", () => {
    const valor = tdId.innerHTML;

    const urlAgendamento = `http://10.92.198.22:8080/api/agendamento/${valor}`;
    const resultado = confirm(`Deseja deletar o agendamento do id: ${valor}?`);
    if (resultado == true) {
      /* construindo o objeto agendamento */
      let agendamento = {
        id: valor,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);

      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "DELETE",
        body: JSON.stringify(agendamento),
        headers: myHeaders,
      };
      fetch(urlAgendamento, fetchData)
        .then((resp) => {
          resp
            .json()
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  let verMais = createNode("td");
  verMais.classList.add("verMais");
  let iVerMais = createNode("i");
  iVerMais.classList.add("bx");
  iVerMais.classList.add("bx-dots-vertical-rounded");

  iVerMais.addEventListener("click", () => {
    if (show == false) {
      modalInfo.classList.add("show");
      show = true;
    }
    const btnFecharModalInfo = getById("closeInfo");
    btnFecharModalInfo.addEventListener("click", () => {
      if (show === true) {
        modalInfo.classList.remove("show");
        show = false;
      }
    });
  });

  /* apontando quem é filho de quem para que a construção do tbody seja feita com sucesso */
  append(table, tbody);
  append(tbody, tr);
  append(tr, tdId);
  append(tr, tdTitulo);
  /* append(tr, tdDescricao) */
  append(tr, tdData);
  append(tr, tdHora);
  append(tr, tdStatus);
  append(tdStatus, divStatus);
  append(divStatus, divSpanStatus);
  append(divStatus, spanStatus);
  /* append(tr, tdPeriodo) */
  /* append(tr, tdTipo) */
  append(tr, tdUsuario);
  append(tr, tdAlterar);
  append(tdAlterar, btnAlterar);
  append(btnAlterar, iAlterar);
  append(tr, tdDeletar);
  append(tdDeletar, btnDeletar);
  append(btnDeletar, iDeletar);
  append(tr, verMais);
  append(verMais, iVerMais);
}

/* função que limpa o tbody */
function clearTbody() {
  tbody.innerText = "";
}

/* função que cria o elemento */
function createNode(element) {
  return document.createElement(element);
}

/* função que aponta quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
}

/* função para pegar um elemento pelo id */
function getById(id) {
  return document.getElementById(id);
}

/* função que decodifica o token */
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function pintaStatus(background, elipse, span, backgroundColor, textColor) {
  background.style.backgroundColor = backgroundColor;
  elipse.style.backgroundColor = textColor;
  span.style.color = textColor;
}

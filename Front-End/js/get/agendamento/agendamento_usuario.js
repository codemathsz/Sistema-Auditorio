/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");

/* pegando o token do usuario */
const token = localStorage.getItem("token");
const payload = parseJwt(token);

if (token == null) {
  window.location.href = "../../index.html";
} else {
  const url = `http://localhost:8080/api/agendamento/usuario/${payload.id}`;
  getAll(url);
}

/* método que faz a conexão com a api que traz todos os agendamentos */
function getAll(url) {
  /* fazendo conexão com a url fornecida */
  fetch(url)
    .then((resp) => {
      resp
        .json()
        .then((data) => {
          console.log(data);
          /* fazendo um forEach no array de agendamentos */
          /* para cada agendamento ele cria um objeto agendamento */
          return data.map((agendamento) => {
            /* método que cria o tbody */
            createTbody(agendamento);
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
function createTbody(agendamento) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");

  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${agendamento.id}`;

  let tdTitulo = createNode("td");
  tdTitulo.innerHTML = `${agendamento.title}`;

  let tdDescricao = createNode("td");
  tdDescricao.innerHTML = `${agendamento.descricao.substring(0, 15)}...`;

  let tdDataInicio = createNode("td");
  /* formatando a data para padrão brasileiro */
  const dataInicioFormat = agendamento.dataInicioFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  tdDataInicio.innerHTML = dataInicioFormat;

  let tdDataFinalizada = createNode("td");
  /* formatando a data para padrão brasileiro */
  const dataFinalizadaFormat = agendamento.dataFinalizadaFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  tdDataFinalizada.innerHTML = dataFinalizadaFormat;

  let tdHoraInicio = createNode("td");
  tdHoraInicio.innerHTML = `${agendamento.horaInicio}`;

  let tdHoraFinalizada = createNode("td");
  tdHoraFinalizada.innerHTML = `${agendamento.horaFinalizada}`;

  let tdStatus = createNode("td");
  tdStatus.innerHTML = `${agendamento.status}`;

  let tdPeriodo = createNode("td");
  tdPeriodo.innerHTML = `${agendamento.periodo}`;

  let tdTipo = createNode("td");
  tdTipo.innerHTML = `${agendamento.tipo.nome}`;

  let tdUsuario = createNode("td");
  tdUsuario.innerHTML = `${agendamento.usuario.nome}`;

  let tdDeletar = createNode("td");
  const btnDeletar = createNode("button");
  btnDeletar.innerHTML = "Deletar";

  btnDeletar.addEventListener("click", () => {
    const valor = tdId.innerHTML;

    const urlAgendamento = `http://localhost:8080/api/agendamento/${valor}`;
    const resultado = confirm(`Deseja deletar o agendamento do id: ${valor}?`);
    if (resultado == true) {
      /* construindo o objeto agendamento */
      let agendamento = {
        id: valor,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

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
              alert("O agendamento foi excluido.");
              window.location.reload();
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

  /* apontando quem é filho de quem para que a construção do tbody seja feita com sucesso */
  append(table, tbody);
  append(tbody, tr);
  append(tr, tdId);
  append(tr, tdTitulo);
  append(tr, tdDescricao);
  append(tr, tdDataInicio);
  append(tr, tdDataFinalizada);
  append(tr, tdHoraInicio);
  append(tr, tdHoraFinalizada);
  append(tr, tdStatus);
  append(tr, tdPeriodo);
  append(tr, tdTipo);
  append(tr, tdUsuario);
  append(tdDeletar, btnDeletar);
  append(tr, tdDeletar);
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

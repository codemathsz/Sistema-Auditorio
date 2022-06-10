/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");

const mensagens = getById("mensagens");
let type = "";
let idMessage = 0;

/* pegando o token do usuario */
const token = localStorage.getItem("token");
const payload = parseJwt(token);

let url = "";

if (token == null) {
  window.location.href = "../../login/login.html";
} else {
  if (payload.nivel == 1) {
    /* pegando o botao que faz a procura */
    url = "http://10.92.198.22:8080/api/tipo";
    get(url);
  } else {
    window.location.href = "../../../index.html";
  }
}

/* método que faz a conexão com a api que traz todos os tipos */
function get(url) {
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
          /* fazendo um forEach no array de tipos */
          /* para cada tipo ele cria um objeto tipo */
          let i = 0;
          return data.map((tipo) => {
            /* método que cria o tbody */
            createTbody(tipo, i);
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
/* cria as tr, e as tds e coloca os valores do objeto tipo dentro de seu respectivo campo*/
function createTbody(tipo, index) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");
  if (index % 2 == 1) {
    tr.style.backgroundColor = "#f0f0f0";
  }

  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${tipo.id}`;

  let tdNome = createNode("td");
  tdNome.innerHTML = `${tipo.nome}`;

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
      modalAlterar.classList.add("showModal");
      show = true;

      /* pegando os inputs pelo id */
      const form = getById("form");
      const nome = getById("nome");
      const id = tipo.id;

      nome.addEventListener("blur", () => {
        
      });

      /* Preenchendo o formulario com id fornecido */
      id.value = tipo.id;
      nome.value = tipo.nome;
      submit.disable = false
      submit.classList.add("btn_active");

      /* METODO PUT ------------------------------------ */
      /* pegando as informações alteradas do formulario e fazendo a alteração pelo método put */

      /* adicionando um evento submit no form */
      form.addEventListener("submit", function () {
        /* evitando que ele submeta */
        event.preventDefault();

        /* url do tipo com o valor do input do id */
        const urlTipo = `http://10.92.198.22:8080/api/tipo/${id}`;

        /* construindo o objeto tipo */
        let tipo = {
          id: id,
          nome: nome.value,
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
        let fetchData = {
          method: "PUT",
          body: JSON.stringify(tipo),
          headers: myHeaders,
        };

        /* fazendo a conexão com a api */
        fetch(urlTipo, fetchData)
          .then((resp) => {
            console.log(resp);
            resp
              .json()
              .then((resposta) => {
                console.log(resposta);
                if (resposta.error == "OK") {
                  console.log("sucesso");
                  type = "success";
                  createMessage(`Sucesso ao alterar o tipo de evento!`, type);
                  clearForm();
                  modalAlterar.classList.remove("showModal")
                  setTimeout(() => {
                    window.location.reload();
                  }, 3750);
                } else {
                  console.log("erro");
                  type = "error";
                  createMessage(resposta.message, type);
                }
                deleteMessage();
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    const btnFecharModal = getById("close");
    btnFecharModal.addEventListener("click", () => {
      if (show === true) {
        modalAlterar.classList.remove("showModal");
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

    const urlTipo = `http://10.92.198.22:8080/api/tipo/${tipo.id}`;
    const resultado = confirm(`Deseja deletar o tipo do id: ${tipo.id}?`);
    if (resultado == true) {
      /* construindo o objeto tipo */
      let tipo = {
        id: valor,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", token);

      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "DELETE",
        body: JSON.stringify(tipo),
        headers: myHeaders,
      };
      /* fazendo a conexão com a api */
      fetch(urlTipo, fetchData)
        .then((resp) => {
          console.log(resp);
          resp
            .json()
            .then((resposta) => {
              console.log(resposta);
              if (resposta.error == "OK") {
                console.log("sucesso");
                type = "success";
                createMessage(`Sucesso ao deletar o tipo de evento!`, type);
                clearForm();
                setTimeout(() => {
                  window.location.reload();
                }, 8000);
              } else {
                console.log("erro");
                type = "error";
                createMessage(resposta.message, type);
              }
              deleteMessage();
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
  append(tr, tdNome);
  append(tr, tdAlterar);
  append(tdAlterar, btnAlterar);
  append(btnAlterar, iAlterar);
  append(tr, tdDeletar);
  append(tdDeletar, btnDeletar);
  append(btnDeletar, iDeletar);
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

function createMessage(msg, type) {
  idMessage++;
  let message = createNode("div");
  message.classList.add("message");
  message.id = "message" + idMessage;

  let messageContent = createNode("div");
  messageContent.classList.add("msg-content");

  let i = createNode("i");
  i.classList.add("bx");
  i.classList.add("bx-tada");
  if (type == "success") {
    i.classList.add("bx-check");
    i.style.color = "green";
  } else {
    i.classList.add("bx-x");
    i.style.color = "rgb(255, 11, 27)";
  }

  let p = createNode("p");
  p.innerHTML = msg;

  append(message, messageContent);
  append(messageContent, i);
  append(messageContent, p);

  let time = createNode("div");
  time.classList.add("msgTempo");

  let timeBar = createNode("div");
  timeBar.classList.add("barraTempo");

  append(message, time);
  append(time, timeBar);
  append(mensagens, message);
}

function deleteMessage() {
  console.log(idMessage);
  for (let i = 0; i <= idMessage; i++) {
    let element = getById("message" + i);
    if (element != null) {
      setTimeout(() => {
        mensagens.removeChild(element);
      }, 4000);
    } else {
      continue;
    }
  }
}

function clearForm() {
  nome.value = "";
}

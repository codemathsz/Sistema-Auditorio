/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* input da busca */
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");

/* div mda menssagem */

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
    /* adiciona um escutador de evento ao meu botão, que no caso é o evento de click */
    url = "http://10.92.198.22:8080/api/usuario";
    get(url);
  } else {
    window.location.href = "../../../index.html";
  }
}
/* método que faz a conexão com a api que traz todos os usuarios */
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
          /* fazendo um forEach no array de usuarios */
          /* para cada usuario ele cria um objeto usuario */
          let i = 0;
          return data.map((usuario) => {
            /* método que cria o tbody */
            createTbody(usuario, i);
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
/* cria as tr, e as tds e coloca os valores do objeto usuario dentro de seu respectivo campo*/
function createTbody(usuario, index) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");

  if (index % 2 == 1) {
    tr.style.backgroundColor = "#f0f0f0";
  }

  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${usuario.id}`;

  let tdNome = createNode("td");
  tdNome.innerHTML = `${usuario.nome}`;

  let tdEmail = createNode("td");
  tdEmail.innerHTML = `${usuario.email}`;

  let tdNif = createNode("td");
  tdNif.innerHTML = `${usuario.nif}`;

  let tdNivel = createNode("td");
  let nivelUsuario = "";
  if (usuario.nivel == "ADMINISTRADOR") {
    nivelUsuario = "Administrador";
  } else {
    nivelUsuario = "Professor";
  }
  tdNivel.innerHTML = nivelUsuario;

  let tdAlterar = createNode("td");
  /* cria o botao de alteração */
  const btnAlterar = createNode("button");
  btnAlterar.className = "btnAlterar";
  let iAlterar = createNode("i");
  iAlterar.classList.add("bx");
  iAlterar.classList.add("bxs-edit-alt");
  iAlterar.classList.add("alterar");

  let show = false;
  let id = usuario.id;
  btnAlterar.addEventListener("click", () => {
    if (show === false) {
      modalAlterar.classList.add("showModal");
      show = true;

      /* pegando os inputs pelo id */
      const form = getById("form");
      const nome = getById("nome");
      const email = getById("email");
      const nif = getById("nif");
      const nivel = getById("nivel");
      const senha = getById("senha");
      const confirmaSenha = getById("confirmaSenha");
      let id = usuario.id;
      console.log(id)

      /* url do usuario com o valor do input do id */
      const urlUsuario = `http://10.92.198.22:8080/api/usuario/${id}`;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "GET",
        headers: myHeaders,
      };

      /* fazendo conexão com a api */
      fetch(urlUsuario, fetchData)
        /* transformando a resposta em json */
        .then((resp) => {
          resp
            .json()
            .then((resposta) => {
              console.log(resposta)
              /* pegando os valores do json e colocando nos inputs */
              nome.value = resposta.nome;
              email.value = resposta.email;
              nif.value = resposta.nif;
              nivel.value = resposta.nivel;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });

      /* METODO PUT ------------------------------------ */
      /* pegando as informações alteradas do formulario e fazendo a alteração pelo método put */
      form.addEventListener("submit", function () {
        /* evitando que ele submeta */
        event.preventDefault();
        let senhaUsuario;
        if (senha.value != "" && confirmaSenha.value != "") {
          if (senha.value == confirmaSenha.value) {
            senhaUsuario = senha.value;
          } else {
            createMessage("Senhas incompativeis...", "error");
          }
        } else {
          senhaUsuario = "";
        }

        /* url do usuario com o valor do input do id */
        const urlUsuario = `http://10.92.198.22:8080/api/usuario/${id}`;

        /* construindo o objeto usuario */
        let usuario = {
          id: id,
          nome: nome.value,
          email: email.value,
          nif: nif.value,
          nivel: nivel.value,
          senha: senhaUsuario,
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
        let fetchData = {
          method: "PUT",
          body: JSON.stringify(usuario),
          headers: myHeaders,
        };

        /* fazendo a conexão com a api */
        fetch(urlUsuario, fetchData)
          .then((resp) => {
            resp
              .json()
              .then((resposta) => {
                if (resposta.error == "OK") {
                  console.log("sucesso");
                  createMessage(
                    `Sucesso ao alterar o usuario ${tdId.innerHTML}!`,
                    "success"
                  );
                  modalAlterar.classList.remove("showModal");
                  setTimeout(() => {
                    window.location.reload();
                  }, 3000);
                } else {
                  console.log("erro");
                  createMessage(
                    `Falha ao alterar o usuario ${tdId.innerHTML}. ` +
                      resposta.message.substring(0, 100) +
                      "...",
                    "error"
                  );
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
      /* adicionando um evento submit no form */
    }

    const btnFecharModal = getById("close");
    btnFecharModal.addEventListener("click", () => {
      if (show === true) {
        modalAlterar.classList.remove("showModal");
        show = false;
        deleteMessage();
        idMessage = 0;
        clearForm();
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

    const urlUsuario = `http://10.92.198.22:8080/api/usuario/desativar/${valor}`;
    const resultado = confirm(`Deseja deletar o usuario do id: ${valor}? Essa ação é definitiva!`);
    if (resultado == true) {
      /* construindo o objeto usuario */
      let usuario = {
        id: id
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);

      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "PUT",
        body: JSON.stringify(usuario),
        headers: myHeaders,
      };
      fetch(urlUsuario, fetchData)
        .then((resp) => {
          resp
            .json()
            .then((resposta) => {
              console.log(resposta);
              if (resposta.error == "OK") {
                console.log("sucesso");
                createMessage(
                  `Sucesso ao deletar o usuario ${valor}!`,
                  "success"
                );
                modalAlterar.classList.remove("showModal");
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                console.log("erro");
                createMessage(
                  `Falha ao deletar o usuario ${valor}. ` + resposta.message,
                  "error"
                );
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
  append(tr, tdEmail);
  append(tr, tdNif);
  append(tr, tdNivel);
  append(tr, tdAlterar);
  append(tdAlterar, btnAlterar);
  append(btnAlterar, iAlterar);
  append(tr, tdDeletar);
  append(tdDeletar, btnDeletar);
  append(btnDeletar, iDeletar);
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
      }, 3000);
    } else {
      continue;
    }
  }
}

function clearForm() {
  nome.value = "";
  nif.value = "";
  email.value = "";
  nivel.value = "";
}

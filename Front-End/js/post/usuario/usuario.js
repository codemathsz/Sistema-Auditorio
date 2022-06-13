const nome = getById("nome");
const nif = getById("nif");
const email = getById("email");
const senha = getById("senha");
const confirmaSenha = getById("confirmaSenha");
const nivel = getById("nivel");
const submit = getById("submit");
submit.disabled = true;

const mensagens = getById("mensagens");
let type = "";
let id = 0;

const token = localStorage.getItem("token");

if (token == null) {
  window.location.href = "../../login/login.html";
} else {
  const payload = parseJwt(token);
  if (payload.nivel == 1) {
    nome.addEventListener("blur", () => {
      validaCadastro();
    });

    nif.addEventListener("blur", () => {
      validaCadastro();
    });

    email.addEventListener("blur", () => {
      validaCadastro();
    });

    senha.addEventListener("blur", () => {
      validaCadastro();
    });

    confirmaSenha.addEventListener("blur", () => {
      validaCadastro();
    });

    nivel.addEventListener("blur", () => {
      validaCadastro();
    });

    /* METODO POST ------------------------------------ */
    const form = getById("form");
    form.addEventListener("submit", function () {
      event.preventDefault();
      if (senha.value === confirmaSenha.value) {
        const url = `http://10.92.198.22:8080/api/usuario`;

        let usuario = {
          nome: nome.value,
          email: email.value,
          senha: senha.value,
          nif: nif.value,
          nivel: nivel.value,
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);

        let fetchData = {
          method: "POST",
          body: JSON.stringify(usuario),
          headers: myHeaders,
        };

        fetch(url, fetchData)
          .then((resp) => {
            resp
              .json()
              .then((resposta) => {
                console.log(resposta);
                if (resposta.error == "OK") {
                  console.log("sucesso");
                  type = "success";
                  createMessage(
                    `Sucesso ao cadastrar o usuario: ${nome.value}!`,
                    type
                  );
                  clearForm();
                  setTimeout(() => {
                    window.location.reload();
                  }, 3000);
                } else {
                  console.log("erro");
                  type = "error";
                  createMessage("Falha ao cadastrar: "+resposta.message, type);
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
      } else {
        type = "error";
        createMessage("Senhas não compativeis", type);
        deleteMessage()
      }
    });
  } else {
    window.location.href = "../../../index.html";
  }
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

function getById(id) {
  return document.getElementById(id);
}

/* função que limpa qualquer elemento */
function clearElement(element) {
  element.innerText = "";
}

/* método que cria um elemento */
function createNode(element) {
  return document.createElement(element);
}

/* método que indica quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
}

function clearForm() {
  nome.value = "";
  nif.value = "";
  email.value = "";
  senha.value = "";
  confirmaSenha.value = "";
  nivel.value = "";
  submit.disabled = true;
  validaCadastro();
}

function validaCadastro() {
  if (
    nome.value != "" &&
    nif.value != "" &&
    email.value != "" &&
    senha.value != "" &&
    confirmaSenha.value != "" &&
    nivel.value != ""
  ) {
    submit.classList.add("btn_active");
    submit.disabled = false;
  } else {
    submit.classList.remove("btn_active");
    submit.disabled = true;
  }
}

function createMessage(msg, type) {
  id++;
  let message = createNode("div");
  message.classList.add("message");
  message.id = "message" + id;

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
  for (let i = 0; i <= id; i++) {
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

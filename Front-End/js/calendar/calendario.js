/* pegando o token do usuario */
const token = localStorage.getItem("token");
const floatingButton = getById("floating-button");
let payload = "";
if (token != null) {
  payload = parseJwt(token);
} else {
  floatingButton.style.display = "none";
}

console.log(payload);

// pegando o ano conforme o atual
var dateGetYear = new Date();
var ano = dateGetYear.getFullYear();

const tituloAno = getById("tituloAno");

/* ano = ano + 1 */
tituloAno.innerHTML = ano;

let controladorAnimacao = 0;
const setas = document.getElementsByClassName("setas");
verificaSeta();
for (let i = 0; i < setas.length; i++) {
  setas[i].addEventListener("click", () => {
    if (i == 0) {
      controladorAnimacao = 1;
      diminueAno();
      verificaMes(i);
    } else {
      controladorAnimacao = 1;
      verificaMes(i);
      aumentaAno();
    }
  });
}

let resto = 0;
let controlador = 0;
const meses = document.getElementsByClassName("mes");
const bolinhas = document.getElementsByName("bolinhas");

for (let i = 0; i < bolinhas.length; i++) {
  resto++;
  if (resto % 2 == 0) {
    controlador = 30;
  } else {
    controlador = 31;
  }
  for (let j = 0; j < controlador; j++) {
    const bolinha = createNode("div");
    bolinha.classList.add("bolinha");
    append(bolinhas[i], bolinha);
  }
  meses[i].addEventListener("click", () => {
    if (tituloAno.innerHTML == 2022) {
      if (i > 4) {
        pegaData(i + 1);
      }
    } else if (tituloAno.innerHTML > 2022) {
      pegaData(i + 1);
    }
  });
  aplicaDisabled();
  removeDisable();
}

function aplicaDisabled() {
  for (let i = 0; i < 12; i++) {
    if (tituloAno.innerHTML < 2022) {
      meses[i].classList.add("mes-disable");
      if (controladorAnimacao != 0) {
        meses[i].classList.add("mes-disable-sem-animacao");
      }
    } else if (tituloAno.innerHTML == 2022) {
      if (i < 5) {
        meses[i].classList.add("mes-disable");
        if (controladorAnimacao != 0) {
          meses[i].classList.remove("mes-sem-animacao");
          meses[i].classList.add("mes-disable-sem-animacao");
        }
      }
    }
  }
}

function removeDisable() {
  for (let i = 0; i < 12; i++) {
    if (tituloAno.innerHTML > 2022) {
      if (controladorAnimacao != 0) {
        meses[i].classList.remove("mes-disable");
        meses[i].classList.remove("mes-disable-sem-animacao");
        meses[i].classList.add("mes-sem-animacao");
      }
    }
  }
}

/* Variaveis para o cadastro de agendamento */
/* pegando os inputs pelo id */
const form = getById("form");
const titulo = getById("titulo");
const descricao = getById("descricao");
const dataInicio = getById("dataInicio");
const dataFinalizada = getById("dataFinalizada");
/* pega a data de hj */
// pegando a data atual para desativar o click da data
var dataAtual = new Date(Date.now());
var hoje = dataAtual
  .toLocaleDateString()
  .replace(/(\d*)\/(\d*)\/(\d*).*/, "$3-$2-$1");
dataAtual.setDate(dataAtual.getDate() + 3);
var dataAposAtual = dataAtual
  .toLocaleDateString()
  .replace(/(\d*)\/(\d*)\/(\d*).*/, "$3-$2-$1");
var dataAposAtualFormat = dataAposAtual.replace(
  /(\d*)-(\d*)-(\d*).*/,
  "$3/$2/$1"
);

const escolhaHoras = getById("choice-hora");
const escolhaPeriodo = getById("choice-periodo");
const horaInicio = getById("horaInicio");
const horaFinalizada = getById("horaFinalizada");
const periodo = getById("periodo");
const tipo = getById("tipo");
const submit = getById("submit");

floatingButton.addEventListener("click", () => {
  $("#modalEventRegister").modal("show");
  dataInicio.value = "";
  dataInicio.min = dataAposAtual;
  dataInicio.disabled = false;
  dataFinalizada.value = "";
  dataFinalizada.min = dataAposAtual;

  dataInicio.addEventListener("change", () => {
    console.log(dataInicio.value + "#########################");
    dataFinalizada.min = dataInicio.value;
    dataFinalizada.value = dataInicio.value;
  });
  postAgendamento();
});

const checks = document.getElementsByName("check");
let validaChecks = "";
submit.disabled = true;

const mensagens = getById("mensagens");
let type = "";
let id = 0;

/* criando variaveis do tipo string para armazenar hora e minuto */
let hora = "00";
let minutos = "00";
/* array que tem duas posições, 00 e 30, que sáo os minutos do array */
let min = ["00", "30"];
/* criando variaveis para formatar a hora e o minuto */
let horaFormat = "";
let minutoFormat = "";
/* variavel que controla a posicao do for */
controlador = 1;
/* variaveis que vao indicar a diferencas entre a gora final e a hora inicial no select da hora final */
let minutosDiferenca = 0;
let horaDiferenca = "";

let control = 1;

// para renderizar o calendário e colocar opções do fullCalendar
function calendar(meses, ano) {
  /* Limitando o fullCalendar para que ele possa voltar até o dia que a aplicação foi iniciada */

  /*   inst.setEvents(events); */
  const date = `${ano}-${meses}-01`;
  // tabela candar
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    /*  viewRender: function (view) {
      var startDate = '2022-06-01';
      
      var currentDate = $('#calendar').fullCalendar('getDate');
      console.log(currentDate);
      if (view.start == startDate) {
        header.disableButton("prev");
      }
    }, */

    validRange: {
      start: "2022-06-01",
    },
    // button custom
    close: "fa-times",
    prev: "fa-chevron-left",
    next: "fa-chevron-right",
    prevYear: "fa-angle-double-left",
    nextYear: "fa-angle-double-right",
    // definir theme pronto
    themeSystem: "bootstrap5",
    // tipo de visualização inicial
    initialView: "dayGridMonth",
    // data inicial
    defaultDate: "yyyy-MM-dd",
    // falando ao calendário a data que será inicializado
    timeZone: 'UTC',
    initialDate: date,
    headerToolbar: {
      // lado esquerdo do month
      left: "prev,next today",
      // lado centro do month
      center: "title",
      // lado direito do month
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },

    //deixando calendário em português
    locale: "pt-br",
    // definindo como a hora vai aparecer
    // style
    hour: "numeric",
    minute: "2-digit",
    meridiem: false,
    // definindo que um evento pode ser cadastrado o dia inteiro
    allDay: true,

    // Função para cadastrar o evento ao clicar no dia
    dateClick: function (info) {
      if (token != null) {
        // validação que o usuário não pode interagir com data passadas
        if (info.dateStr < hoje) {
          alert("Datas passadas não podem ser agendadas.");
        } else if (info.dateStr < dataAposAtual) {
          alert(
            "Faça o agendamento com antecedência, do dia " +
              dataAposAtualFormat +
              " em diante!"
          );
        } else {
          // exibindo a modal de cadastro de evento
          $("#modalEventRegister").modal("show");
          // passando a data conforme o dia selecionado
          $("#modalEventRegister #dataInicio").val(info.dateStr);
          // não deixando o usuário setar uma data anterior da atual

          const dataMaxima = new Date(info.dateStr);
          const dateAno = dataMaxima.getFullYear() + "";
          const dateMes = dataMaxima.getMonth() + 1 + "";
          const dateDay = dataMaxima.getDate();
          const dateFormat = dateAno
          let dateMax = "";

          // consertando bug se for dia um de January

          console.log(dataMaxima);
          console.log(dateAno);
          console.log(dateMes);
          console.log(dateDay);
          // porque a primeira posição do Array é 0, e na condição fazemos conforme o número do mês

          if (dateMes <= 6) {
            dateMax = dateAno + "-06-30";
          } else {
            dateMax = dateAno + "-12-31";
          }
          dataInicio.min = info.dateStr;
          dataInicio.disabled = true;
          dataInicio.addEventListener("change", () => {
            console.log(dataInicio.value + "#########################");
            dataFinalizada.min = dataInicio.value;
            dataFinalizada.value = dataInicio.value;
          });
          // colocando propriedades no input da dataFinalizada
          dataFinalizada.value = dataInicio.value;
          dataFinalizada.min = dataInicio.value;
          dataFinalizada.max = dateMax;

          postAgendamento();
        }
      }
    },
    // criando a modal com informações completas ao clicar em um evento
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      $("#modalEventFull #id").text(info.event.id);
      $("#modalEventFull #title").text(info.event.title);
      $("#modalEventFull #dateStart").text(
        info.event.extendedProps.dataInicioFormat.replace(
          /(\d*)-(\d*)-(\d*).*/,
          "$3/$2/$1"
        )
      );
      $("#modalEventFull #timeStart").text(info.event.extendedProps.horaInicio);
      $("#modalEventFull #dateFinish").text(
        info.event.extendedProps.dataFinalizadaFormat.replace(
          /(\d*)-(\d*)-(\d*).*/,
          "$3/$2/$1"
        )
      );
      $("#modalEventFull #timeFinish").text(
        info.event.extendedProps.horaFinalizada
      );
      $("#modalEventFull #user").text(info.event.extendedProps.usuario.nome);
      $("#modalEventFull #desc").text(info.event.extendedProps.descricao);
      $("#modalEventFull #status").text(
        info.event.extendedProps.status.substring(0, 1) +
          info.event.extendedProps.status.substring(1, 10).toLowerCase()
      );
      $("#modalEventFull").modal("show");

      console.log(info.event.extendedProps);
      let usuario = $("#usuario");
    },

    // colocar a API para consumir
    nextDayThreshold: "00:00:00",
    events: "http://10.92.198.22:8080/api/agendamento/semRecusado",

    // limitando a quantidade de ventos
    eventLimit: true,
    dayMaxEvents: true,
    dayGridMonth: {
      // name of view
      titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" },
      // other view-specific options here
    },
    dayMaxEventsRows: true,
    views: {
      timeGrid: {
        // adjust to 6 only for timeGridWeek/timeGridDay
        dayMaxEventsRows: 3,
      },
    },
  });
  // renderiza o calendário
  calendar.render();
}

/* método que pega os elementos pelo id */
function getById(id) {
  return document.getElementById(id);
}

function getByClass(className) {
  return document.getElementsByClassName(className);
}

/* método que cria um elemento */
function createNode(element) {
  return document.createElement(element);
}

/* método que indica quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
}
function aumentaAno() {
  ano = ano + 1;
  tituloAno.innerHTML = ano;
  verificaSeta();
  removeDisable();
}

function diminueAno() {
  if (tituloAno.innerHTML > 2022) {
    ano = ano - 1;
    tituloAno.innerHTML = ano;
  }
  verificaSeta();
  aplicaDisabled();
}

// fazendo variável para levar a data
function pegaData(meses) {
  console.log("Pegou a data no normal");
  if (meses <= 9) {
    meses = `0${meses}`;
  }
  abreModal();
  console.log("Abriu a modal - home");
  console.log("Pegou os meses e o ano para abrir calendário - home");
  calendar(meses, ano);
}
// função que abre a modal
function abreModal() {
  const modal = document.getElementById("calendar");
  modal.style.display = "block";
  document.getElementById("modal-fecha").style.display = "block";
}

// função que fecha a modal
function fechaModal() {
  const container = document.getElementById("calendar");
  container.style.display = "none";
  document.getElementById("modal-fecha").style.display = "none";
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

function createHoraInicio() {
  /* for para percorrer as horas, e começa valendo 08 */
  for (let h = 8; h < 23; h++) {
    /* for para percorrer duas vezes a hora e setar as duas posicoes do array de minutos na hora */
    for (let m = 0; m < minutos.length; m++) {
      /* criando um option */
      const option = createNode("option");
      /* if para colocar um 0 antes da hora se for menor que 10 */
      if (h < 10) {
        hora = "0" + h;
      } else {
        hora = h;
      }
      /* colocando os minutos na hora, posicao 1 do vetor e dps posicao 2 do vetor */
      minutos = min[m];
      /* setando a data no option */
      option.innerHTML = hora + ":" + minutos;
      /* quando chegar o option que marca 22:30 ele da um break para nao imprimir o 22:30 pois nao tem como começar um agendamento nesse horario */
      if (option.value == "22:30") {
        break;
      }
      /* falando que o option é filho do select */
      append(horaInicio, option);
    }
  }
}

/* função que cria o select da horaFinalizada */
function createHoraFinalizada(horaFormat, minutoFormat) {
  /* instanciando a variavel da diferenca da hora, ela começa valendo vazia */
  horaDiferenca = "";
  /* método que limpa o select antes de criar */
  clearElement(horaFinalizada);
  /* vendo se os minutos são diferentes de 00 */
  if (!(horaInicio.value.substring(3, 5) == "00")) {
    /* vendo se a hora é 08 ou 09, pois assim tiramos o primeiro numero, caso contrario deixamos */
    if (parseInt(getHora(horaInicio)) < 10) {
      /* tirando o primeiro caracter e adicionando uma hora */
      horaFormat = parseInt(horaInicio.value.substring(1, 2)) + 1;
    } else {
      /* apenas adicionando uma hora */
      horaFormat = parseInt(getHora(horaInicio)) + 1;
    }
    /* quando o minuto da horaInicio for 30 falamos que aqui tambem vai ser 30 */
    minutoFormat = "30";
    /* se os minutos da hora de cima forem == 0 */
  } else {
    /* mesmo if para retirar caracter de cima, mas aqui nao adicionamos uma hora */
    if (parseInt(horaInicio.value.substring(0, 2)) < 10) {
      horaFormat = parseInt(horaInicio.value.substring(1, 2));
    } else {
      horaFormat = parseInt(getHora(horaInicio));
    }
    /* se cair aqui é porque os minutos da hora de cima sao 00:00 e aqui tambem sao */
    minutoFormat = "00";
  }
  /* resetando a variavel minutoDifenca */
  minutosDiferenca = 0;
  /* zerando a variavel controlador para que sempre ocorra a mudança no horaInicio o controlador comece valendo 1 */
  controlador = 1;
  /* for para percorrer as horas, e começa valendo a variavel horaFormat */
  for (let h = horaFormat; h < 23; h++) {
    /* for para percorrer duas vezes a hora e setar as duas posicoes do array na hora */
    for (let m = 0; m < minutos.length; m++) {
      /* toda vez que passar por esse for a diferenca entre a hora inicial e a hora final vai incrementando de 30 em 30 */
      minutosDiferenca += 30;
      /* dando o o retorno do metodo converterMinutosParaHora(minutosDiferenca) para a variavel horaDiferenca */
      horaDiferenca = converterMinutosParaHora(minutosDiferenca);
      /* criando um option */
      const option = createNode("option");
      /* if para colocar um 0 antes da hora se for menor que 10 */
      if (h < 10) {
        hora = "0" + h;
      } else {
        hora = h;
      }
      /* vendo se os minutos do select anterior é 00 e vendo se é a primeira vez que estamos passando no for */
      if (minutoFormat == "00" && controlador == 1) {
        /* setando a segunda posição do vetor nos minutos, que no caso são '30' */
        minutos = min[m + 1];

        /* falando que a variavel controlador é igual a 2 pra ele nunca mais passar por esse if */
        controlador++;
        /* setando a hora no option */
        setHoraFinalInOption(
          horaFinalizada,
          option,
          hora,
          minutos,
          horaDiferenca
        );

        /* dando um continue para ele ir pra segunda repetição e nao continuar nessa... */
        break;
      } else {
        minutos = min[m];
        /* vendo se o valor do select é 22:30 para ele nao repetir duas vezes no for e acabar imprimido duas vezes tbm */
        if (horaFinalizada.value == "22:30") {
          break;
        }
        /* setando a hora no option */
        setHoraFinalInOption(
          horaFinalizada,
          option,
          hora,
          minutos,
          horaDiferenca
        );
      }
    }
  }
}

/* função que converte uma quantidade de minutos para hora */
function converterMinutosParaHora(minutos) {
  let hora = 0;
  /* um while para repetir se a quantidade de minutos passada no parametro é maior ou igual a 60 */
  while (minutos >= 60) {
    /* se a quantidade de minutos for maior que 60, eu tiro 60 minutos e adiciono 1 a variavel da hora */
    minutos = minutos - 60;
    hora++;
  }
  /* if para formatação do texto */
  /* se a hora for menor que 10 e os minutos forem iguais a 0 */
  if (hora < 10 && minutos == 0) {
    /* retorna Ex: 01h 00min */
    return `0${hora}h ${minutos}0min`;
    /* se a hora for maior ou igual a 10 e os minutos iguais a 0 */
  } else if (hora >= 10 && minutos == 0) {
    /* retorna Ex: 10h 00min */
    return `${hora}h ${minutos}0min`;
    /* se a hora for menor que 1p e os minutos forem igual a 30*/
  } else if (hora < 10 && minutos == 30) {
    /* retorna Ex: 01h 30min */
    return `0${hora}h ${minutos}min`;
    /* se a hora for maior ou igual a 10 e os minutos forem iguais a 30*/
  } else if (hora >= 10 && minutos == 30) {
    /* retorna Ex: 10h 30min */
    return `${hora}h ${minutos}min`;
  }
}

/* função que coloca as horas no option do select da horaFinalizada */
function setHoraFinalInOption(select, option, hora, minutos, horaDiferenca) {
  /* se a horaDiferenca chegar assim 00h 30min */
  if (horaDiferenca == "00h 30min") {
    /* o option fica com o valor: (30min) */
    option.innerHTML =
      hora + ":" + minutos + " (" + horaDiferenca.substring(4, 9) + ")";
    /* se os minutos chegarem igual a 00*/
  } else if (horaDiferenca.substring(4, 6) == "00") {
    /* vendo se a a hora é menor que 10, mas a validação eu pego o primeiro caracter, se for 0, Ex: 01h eu tiro esse 0 da frente */
    if (horaDiferenca.substring(0, 1) == "0") {
      /* o option fica com o valor Ex: (1h) */
      option.innerHTML =
        hora + ":" + minutos + " (" + horaDiferenca.substring(1, 3) + ")";
    } else {
      /* o option fica com o valor Ex: (10h) */
      option.innerHTML =
        hora + ":" + minutos + " (" + horaDiferenca.substring(0, 3) + ")";
    }
    /* se os minutos forem iguais a 30 */
  } else {
    /* vendo se a a hora é menor que 10, mas a validação eu pego o primeiro caracter, se for 0, Ex: 01h eu tiro esse 0 da frente */
    if (horaDiferenca.substring(0, 1) == "0") {
      /* o option fica com o valor Ex: (1h 30min) */
      option.innerHTML =
        hora + ":" + minutos + " (" + horaDiferenca.substring(1, 10) + ")";
    } else {
      /* o option fica com o valor Ex: (10h 30min) */
      option.innerHTML = hora + ":" + minutos + " (" + horaDiferenca + ")";
    }
  }

  /* falando que o option é filho do select */
  append(select, option);
}

/* função que pega apenas a hora em si da hora completa */
function getHora(element) {
  const elementFormat = element.value.substring(0, 2);
  return elementFormat;
}

/* função que limpa qualquer elemento */
function clearElement(element) {
  element.innerText = "";
}

function clearForm() {
  titulo.value = "";
  descricao.value = "";
  tipo.value = "";
  dataInicio.value = "";
  dataFinalizada.value = "";
  horaInicio.value = "";
  checks[0].checked = false;
  checks[1].checked = false;
  checks[2].checked = false;
  hiddenChoice();
  submit.disabled = true;
  validaCadastro();
}

function validaCadastro() {
  if (
    titulo.value != "" &&
    descricao.value != "" &&
    tipo.value != "" &&
    dataInicio.value != "" &&
    dataFinalizada.value != "" &&
    validaChecks.value != ""
  ) {
    submit.classList.add("btn_active");
    submit.disabled = false;
  } else {
    submit.classList.remove("btn_active");
    submit.disabled = true;
  }
}

function showHoras() {
  escolhaPeriodo.classList.remove("showChoice");
  escolhaPeriodo.classList.add("hiddenChoice");
  escolhaHoras.classList.remove("hiddenChoice");
  submit.style.transform = "translateY(-20px)";
  escolhaHoras.classList.add("showChoice");
}

function showPeriodo() {
  escolhaHoras.classList.remove("showChoice");
  escolhaHoras.classList.add("hiddenChoice");
  escolhaPeriodo.classList.remove("hiddenChoice");
  submit.style.transform = "translateY(-20px)";
  escolhaPeriodo.classList.add("showChoice");
}

function hiddenChoice() {
  escolhaPeriodo.classList.remove("showChoice");
  escolhaPeriodo.classList.add("hiddenChoice");
  escolhaHoras.classList.remove("showChoice");
  escolhaHoras.classList.add("hiddenChoice");
  submit.style.transform = "translateY(-50px)";
}

/* método que pega os elementos pelo id */
function getById(id) {
  return document.getElementById(id);
}

/* método que cria um elemento */
function createNode(element) {
  return document.createElement(element);
}

/* método que indica quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
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

function verificaSeta() {
  if (tituloAno.innerHTML <= 2022) {
    setas[0].style.cursor = "inherit";
    setas[0].style.opacity = "0";
  } else {
    setas[0].style.cursor = "pointer";
    setas[0].style.opacity = "1";
  }
}

function verificaMes(i) {
  if (tituloAno.innerHTML <= 2022) {
    if (i < 5) {
      /* meses[i].classList.remove('mes') */
      meses[i].classList.add("mes-disable");
    } else {
      meses[i].classList.remove("mes-disabled");
    }
  } else {
    meses[i].classList.remove("mes-disabled");
  }
}

function postAgendamento() {
  /* Começando a logica do cadastro */
  titulo.addEventListener("blur", () => {
    validaCadastro();
  });

  descricao.addEventListener("blur", () => {
    validaCadastro();
  });

  dataInicio.addEventListener("blur", () => {
    validaCadastro();
  });

  dataFinalizada.addEventListener("blur", () => {
    validaCadastro();
  });

  /* evento no select da hora inicio para quando o valor for trocado ele atualiza o select com os valores novos */
  horaInicio.addEventListener("change", () => {
    createHoraFinalizada(horaFormat, minutoFormat);
  });

  for (let i = 0; i < checks.length; i++) {
    checks[i].addEventListener("click", () => {
      validaCadastro();
      if (i == 0) {
        horaInicio.innerText = "";
        createHoraInicio();
        /* criando o select da horaFinalizada com hora e minutos formatados */
        createHoraFinalizada(horaFormat, minutoFormat);
        showHoras();

        validaChecks = 0;
      } else if (i == 1) {
        showPeriodo();
        validaChecks = 1;
      } else {
        hiddenChoice();
        validaChecks = 2;
      }
    });
  }

  /* Preenchendo o select do tipo */
  /* Url da lista do tipo */
  const urlTipo = "http://10.92.198.22:8080/api/tipo";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
  let fetchData = {
    method: "GET",
    headers: myHeaders,
  };
  /* fazendo conexão com a api */
  const selectTipo = tipo;
  if (control == 1) {
    fetch(urlTipo, fetchData)
      .then((resp) => {
        resp
          .json()
          .then((data) => {
            /* dando um nome para o objeto */
            let tipos = data;
            /* fazendo tipo um forEach por cada tipo */
            return tipos.map((tipo) => {
              /* criando um elemento option */
              let option = createNode("option");
              /* colocando no valor desse option o id do tipo */
              option.value = tipo.id;
              /* colocando no texto desse option o nome do tipo */
              option.innerHTML = tipo.nome;
              /* falando que o option é filho do select */
              append(selectTipo, option);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    control++;
  }
  /* METODO POST ------------------------------------ */

}

form.addEventListener("submit", function () {
  /* evento para nao submeter o formulario */
  event.preventDefault();
  /* url que faz a conexão com a api do back-end */
  const urlAgendamento = `http://10.92.198.22:8080/api/agendamento`;

  /* variavel para formatar a horaFinalizada para apenas pegar a hora e nao a hora de diferença */
  let horaFinalizadaFormatada = horaFinalizada.value.substring(0, 5);
  let horaInicioFormatada = horaInicio.value;

  console.log(horaInicio.value);
  if (validaChecks == 0) {
    periodo.value = "";
  } else if (validaChecks == 1) {
    horaInicioFormatada = "00:00";
    horaFinalizadaFormatada = "00:00";
  } else {
    periodo.value = "";
    horaInicioFormatada = "00:00";
    horaFinalizadaFormatada = "00:00";
  }

  /* construindo a váriavel da dataInicio e dataFinalizada completa, precisa-se ter a data e a hora juntas */
  const dataInicioCompleta =
    dataInicio.value + "T" + horaInicioFormatada + ":00";
  const dataFinalizadaCompleta =
    dataFinalizada.value + "T" + horaFinalizadaFormatada + ":00";

  /* construindo o objeto agendamento */
  let agendamento = {
    title: titulo.value,
    descricao: descricao.value,
    start: dataInicioCompleta,
    end: dataFinalizadaCompleta,
    periodo: periodo.value == "" ? null : periodo.value,
    tipo: {
      id: tipo.value,
    },
    usuario: {
      id: payload.id,
    },
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
  let fetchData = {
    method: "POST",
    body: JSON.stringify(agendamento),
    headers: myHeaders,
  };

  /* fazendo a conexão com a api */
  fetch(urlAgendamento, fetchData)
    .then((resp) => {
      console.log(resp);
      resp
        .json()
        .then((resposta) => {
          console.log(resposta);
          if (resposta.error == "OK") {
            console.log("sucesso");
            type = "success";
            createMessage("Sucesso ao cadastrar o agendamento!", type);
            clearForm();
            setTimeout(() => {
              window.location.reload();
            }, 3500);
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
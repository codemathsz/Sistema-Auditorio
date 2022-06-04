// pegando o ano conforme o atual
var dateGetYear = new Date();
var ano = dateGetYear.getFullYear();
meses = null;

console.log(ano)
const titulo = document.getElementById("tituloYear");
titulo.innerHTML = ano

function aumentaAno() {
  ano = ano + 1;
  titulo.innerHTML = ano;
}

function diminueAno() {
  ano = ano - 1;
  titulo.innerHTML = ano;
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
/* METHOD GET ---------------------------------------------------------*/
// Usando somente para visualizar os eventos cadastrados no console

const url = "http://10.92.198.22:8080/api/agendamento";
fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);

    let agendamento = JSON.parse(data);
    let user = document.getElementById("usuario");
    console.log(user);
    user.innerHTML = agendamento.descricao;
  })
  // se caso houver erro ao consumir
  .catch((error) => {
    console.log(error);
  });

// para renderizar o calendário e colocar opções do fullCalendar
function calendar(meses, ano) {
  const date = `${ano}-${meses}-01`;
  // tabela candar
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
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
    initialDate: date,
    //initialDate: date,
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
      // pegando a data atual para desativar o click da data
      var data = new Date();
      var dia = String(data.getDate()).padStart(2, "0");
      var mes = String(data.getMonth() + 1).padStart(2, "0");
      var ano = data.getFullYear();
      dataAtual = ano + "-" + mes + "-" + dia;

      // validação que o usuário não pode interagir com data passadas
      if (info.dateStr < dataAtual) {
        alert("Datas passadas não podem ser interagidas");
      } else {
        // exibindo a modal de cadastro de evento
        $("#modalEventRegister").modal("show");
        // passando a data conforme o dia selecionado
        $("#modalEventRegister #dataInicio").val(info.dateStr);
        // não deixando o usuário setar uma data anterior da atual

        const dataMaxima = new Date(info.dateStr);
        const dateAno = dataMaxima.getFullYear() + "";
        const dateMes = dataMaxima.getMonth() + 1 + "";
        let dateMax = "";

        // porque a primeira posição do Array é 0, e na condição fazemos conforme o número do mês
        if (dateMes <= 6) {
          dateMax = dateAno + "-06-30";
        } else {
          dateMax = dateAno + "-12-31";
        }

        // colocando propriedades no input da dataFinalizada
        var inputDateFinish = document.getElementById("inputDateFinish");
        inputDateFinish.innerHTML = ` <input
          type="date"
          name="dataFinalizada"
          id="dataFinalizada"
          value=${info.dateStr}
          min=${info.dateStr}
          max= ${dateMax}
          required />`;

        // fazendo a lógica de cadastrar os eventos conforme o dia clicada

        /* pegando os inputs pelo id */
        const form = getById("form");
        const titulo = getById("titulo");
        const descricao = getById("descricao");
        const dataInicio = getById("dataInicio");
        const dataFinalizada = getById("dataFinalizada");
        const horaInicio = getById("horaInicio");
        const horaFinalizada = getById("horaFinalizada");
        const status = getById("status");
        const periodo = getById("periodo");
        const tipo = getById("tipo");
        const usuario = getById("usuario");
        const submit = getById("submit");

        // Script estilo do select de horas
        /* criando variaveis do tipo string para armazenar hora e minuto */
        let hora = "00";
        let minutos = "00";
        /* array que tem duas posições, 00 e 30, que sáo os minutos do array */
        let min = ["00", "30"];
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

        /* criando variaveis para formatar a hora e o minuto */
        let horaFormat = "";
        let minutoFormat = "";
        /* variavel que controla a posicao do for */
        let controlador = 1;
        /* variaveis que vao indicar a diferencas entre a gora final e a hora inicial no select da hora final */
        let minutosDiferenca = 0;
        let horaDiferenca = "";
        /* criando o select da horaFinalizada com hora e minutos formatados */
        createHoraFinalizada(horaFormat, minutoFormat);

        /* evento no select da hora inicio para quando o valor for trocado ele atualiza o select com os valores novos */
        horaInicio.addEventListener("change", () => {
          createHoraFinalizada(horaFormat, minutoFormat);
        });

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
        function setHoraFinalInOption(
          select,
          option,
          hora,
          minutos,
          horaDiferenca
        ) {
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
                hora +
                ":" +
                minutos +
                " (" +
                horaDiferenca.substring(1, 3) +
                ")";
            } else {
              /* o option fica com o valor Ex: (10h) */
              option.innerHTML =
                hora +
                ":" +
                minutos +
                " (" +
                horaDiferenca.substring(0, 3) +
                ")";
            }
            /* se os minutos forem iguais a 30 */
          } else {
            /* vendo se a a hora é menor que 10, mas a validação eu pego o primeiro caracter, se for 0, Ex: 01h eu tiro esse 0 da frente */
            if (horaDiferenca.substring(0, 1) == "0") {
              /* o option fica com o valor Ex: (1h 30min) */
              option.innerHTML =
                hora +
                ":" +
                minutos +
                " (" +
                horaDiferenca.substring(1, 10) +
                ")";
            } else {
              /* o option fica com o valor Ex: (10h 30min) */
              option.innerHTML =
                hora + ":" + minutos + " (" + horaDiferenca + ")";
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

        /* METOD GET ------------------ */
        /* Preenchendo o select do tipo */
        /* Url da lista do tipo */
        const urlTipo = "http://10.92.198.22:8080/api/tipo";
        /* variavel que pega o select do html */
        const select = tipo;
        /* fazendo conexão com a api */
        fetch(urlTipo)
          .then((resp) => resp.json())
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
              append(select, option);
            });
          })
          .catch((error) => {
            console.log(error);
          });

        /* METODO POST ------------------------------------ */
        form.addEventListener("submit", function () {
          /* evento para nao submeter o formulario */
          event.preventDefault();
          /* url que faz a conexão com a api do back-end */
          const urlAgendamento = `http://10.92.198.22:8080/api/agendamento`;

          /* variavel para formatar a horaFinalizada para apenas pegar a hora e nao a hora de diferença */
          const horaFinalizadaFormatada = horaFinalizada.value.substring(0, 5);
          /* construindo a váriavel da dataInicio e dataFinalizada completa, precisa-se ter a data e a hora juntas */
          const dataInicioCompleta =
            dataInicio.value + "T" + horaInicio.value + ":00";
          const dataFinalizadaCompleta =
            dataFinalizada.value + "T" + horaFinalizadaFormatada + ":00";
          /* construindo o objeto agendamento */
          let agendamento = {
            title: titulo.value,
            descricao: descricao.value,
            start: dataInicioCompleta,
            end: dataFinalizadaCompleta,
            periodo: periodo.value,
            tipo: {
              id: tipo.value,
            },
            usuario: {
              id: usuario.value,
            },
          };

          localStorage.setItem("meses", meses);
          localStorage.setItem("ano", ano);

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

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
                  window.location.reload();
                })
                .catch((error) => {
                  console.log(error);
                });
              // colocar reload na modal
            })
            .catch((error) => {
              console.log(error);
            });
        });

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

        function createSelectHora(element) { }
      }
    },
    // criando a modal com informações completas ao clicar em um evento
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      $("#modalEventFull #id").text(info.event.id);
      $("#modalEventFull #title").text(info.event.title);
      $("#modalEventFull #dateStart").text(info.event.extendedProps.dataInicioFormat.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1'));
      $("#modalEventFull #timeStart").text(info.event.extendedProps.horaInicio);
      $("#modalEventFull #dateFinish").text(info.event.extendedProps.dataFinalizadaFormat.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1'));
      $("#modalEventFull #timeFinish").text(info.event.extendedProps.horaFinalizada);
      $("#modalEventFull #user").text(info.event.extendedProps.usuario.nome);
      $("#modalEventFull #desc").text(info.event.extendedProps.descricao);
      $("#modalEventFull").modal("show");

      console.log(info.event.extendedProps);
      let usuario = $("#usuario");
    },

    // colocar a API para consumir

    events: "http://10.92.198.22:8080/api/agendamento",

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
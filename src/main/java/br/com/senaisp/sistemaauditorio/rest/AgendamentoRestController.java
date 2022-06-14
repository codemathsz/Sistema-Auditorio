package br.com.senaisp.sistemaauditorio.rest;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import br.com.senaisp.sistemaauditorio.annotation.Administrador;
import br.com.senaisp.sistemaauditorio.annotation.Publico;
import br.com.senaisp.sistemaauditorio.annotation.Usuario;
import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.Periodo;
import br.com.senaisp.sistemaauditorio.model.Status;
import br.com.senaisp.sistemaauditorio.model.Sucesso;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.repository.AgendamentoRepository;
import br.com.senaisp.sistemaauditorio.services.LogService;

/*
*
* REST CONTROLLER DA MODEL agendamento
* API's CRUD
*
*/@CrossOrigin
@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoRestController {
	@Autowired // INSTANCOANDO O REPOSITORY
	public AgendamentoRepository repository;
	@Autowired // INSTANCIANDO O logService
	public LogService logService; /*
									 *
									 * METODO QUE CRIA UM NOVO AGENDAMENTO
									 *
									 */

	@Usuario
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> criar(@RequestBody Agendamento agendamento, HttpServletRequest request) {
		try {

			System.out.println(agendamento.getPeriodo());
			System.out.println(agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY));

			if (agendamento.getPeriodo() == null && agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) == 0) {

				System.out.println("entrou if dia todo");
				agendamento.setPeriodo(Periodo.MANHA_TARDE_NOITE);
				agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 8);
				agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 22);
				agendamento.getDataFinalizada().set(Calendar.MINUTE, 30);

			} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) == 0) {

				System.out.println("if hora inicio");

				if (agendamento.getPeriodo() == Periodo.MANHA) {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 8);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 12);

				} else if (agendamento.getPeriodo() == Periodo.TARDE) {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 13);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 17);

				} else if (agendamento.getPeriodo() == Periodo.NOITE) {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 18);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 22);
					agendamento.getDataFinalizada().set(Calendar.MINUTE, 30);

				} else if (agendamento.getPeriodo() == Periodo.MANHA_TARDE) {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 8);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 17);

				} else if (agendamento.getPeriodo() == Periodo.TARDE_NOITE) {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 13);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 22);
					agendamento.getDataFinalizada().set(Calendar.MINUTE, 30);

				} else {

					agendamento.getDataInicio().set(Calendar.HOUR_OF_DAY, 8);
					agendamento.getDataFinalizada().set(Calendar.HOUR_OF_DAY, 22);
					agendamento.getDataFinalizada().set(Calendar.MINUTE, 30);

				}

			} else if (agendamento.getPeriodo() == null) {

				System.out.println("entrou if periodo vazio");

				if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 8
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) <= 12) {
					agendamento.setPeriodo(Periodo.MANHA);
				} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 13
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) <= 18) {

					agendamento.setPeriodo(Periodo.TARDE);

				} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 18
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) < 23) {

					agendamento.setPeriodo(Periodo.NOITE);

				} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 8
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) <= 18) {

					agendamento.setPeriodo(Periodo.MANHA_TARDE);

				} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 13
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) < 23) {
					agendamento.setPeriodo(Periodo.TARDE_NOITE);

				} else if (agendamento.getDataInicio().get(Calendar.HOUR_OF_DAY) >= 8
						&& agendamento.getDataFinalizada().get(Calendar.HOUR_OF_DAY) < 23) {

					agendamento.setPeriodo(Periodo.MANHA_TARDE_NOITE);
				}

			}

			// IF CRIADO PARA QUE A VALIDAÇÃO NÃO
			// DEIXE CADASTRAR NO MESMO DIA OU
			// HORARIO
			if (verificacaoAgendamento(agendamento, request) == true) {
				Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
				return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
			} else {
				System.err.println("\n JÁ EXISTI UM AGENDAMENTO CADASTRADO\n");
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.UNAUTHORIZED, "O *Horario* selecionado não está disponível.", null);
				// RETORNO DO METODO, RETORNA O ERRO
				return new ResponseEntity<Object>(erro, HttpStatus.UNAUTHORIZED);
			}

		} catch (Exception e) {

			if (agendamento.getTitulo() == null) {// *** TITULO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo *Titulo* não pode ser vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getDescricao() == null) {// ** DESCRIÇÃO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo *Descrição* não pode ser vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getDataInicio() == null) {// ** DATA DE INICIO DO AGENDAMENTO NULO
																// e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR,
						"O campo de *Data de Inicio* não pode ser vazio!", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getDataFinalizada() == null) {// ** DATA FINAL DO AGENDAMENTO NULA
																	// e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo da *Data Final* não pode ser vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getStatus() == null) {// ** STATUS DO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *Status* do Agendamento não pode ser nulo!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getPeriodo() == null) {// ** PERIODO DO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo *Periodo* não pode ser vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getTipo() == null) {// ** TIPO DE AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR,
						"O campo *Tipo de Agendamento* não pode ser vazio!", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getHoraInicio() == null) {// ** HORA INICIO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR,
						"O campo de *Hora de Inicio* não pode ser vazio!", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getHoraFinalizada() == null) {// ** HORA FINAL DO AGENDAENTO NULO
																	// e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo da *Hora Final* não pode ser vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			} else if (agendamento.getUsuario() == null) {// * USUARIO DO AGENDAMENTO NULO e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo *Usuario* não pode ser Vazio!",
						e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			}

			e.printStackTrace();
			// ERRO PERSONALIZADO
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar!", e.getClass().getName());
			// RETORNO DO METODO, RETORNA O ERRO
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/*
	 *
	 * METODO QUE TRAZ DO BANCO E LISTA TODOS OS AGENDAMENTOS
	 *
	 */ @Publico
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Agendamento> lista(Agendamento agendamento) { // TRAZ DO BANCO E RETORNA

		return repository.findAllByOrderByDataInicioDesc();
	}
	 
	 @Publico
	@RequestMapping(value = "/semRecusado", method = RequestMethod.GET)
	 public Iterable<Agendamento> listaSemRecusado(Agendamento agendamento) { // TRAZ DO BANCO E RETORNA

			return repository.findAgendamentos();
		}

	 
	/*
	 *
	 * METODO QUE TRAZ OS AGENDAMENTOS DO BANCO POR ID
	 *
	 */ @Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Agendamento getById(@PathVariable("id") Long idAgendamento, Agendamento agendamento) {

		// VERIFICA SE O idAgendamento PASSADO "EXISTE" OU É IGUAL AO ID DO USUARIO
		if (idAgendamento == agendamento.getId()) { // RETORNA A BUSCA DO METODO
			return repository.findById(idAgendamento).get();
		} else { // SE O id PASSADO AO METODO NÃO EXISTIR
			throw new RuntimeException();
		}
	}

	/*
	 *
	 * METODO QUE DELETA UM AGENDAMENTO DO BANCO
	 *
	 */@Administrador
	@Usuario
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deletar(@PathVariable("id") Long id, Agendamento agendamento,
			HttpServletRequest request) {// SE O ID DO agendamento É IGUAL AO id PASSADO
		if (agendamento.getId() == id) {// DELETA O agendamento DO BANCO
			repository.deleteById(id);// RETORNO DO METODO
			Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
			return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
		} else {// SE O id PASSADO NÃO EXISTIR
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "ID inválido", null);
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/*
	 *
	 * METODO QUE ALTERA UM AGENDAMENTO
	 *
	 */@Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> alterar(@PathVariable("id") Long id, @RequestBody Agendamento agendamento,
			HttpServletRequest request) {// SE O ID PASSADO EXISTIR
		System.out.println(id);
		System.out.println(agendamento);
		if (id == agendamento.getId()) {// SALVA A ALTERAÇÃO QUE FOI FEITA NO BANCO
			Agendamento agendamentoVaidacao = repository.findById(id).get();
			
			if (agendamento.getDataInicio() != agendamentoVaidacao.getDataInicio()) {
				
				repository.save(agendamento);
				Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
				return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
				

			}else {
				if (verificacaoAgendamento(agendamento, request) == true) {
					Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
					return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
				} else {
					System.err.println("\n JÁ EXISTI UM AGENDAMENTO CADASTRADO\n");
					// ERRO PERSONALIZADO
					Erro erro = new Erro(HttpStatus.UNAUTHORIZED, "O *Horario* selecionado não está disponível.", null);
					// RETORNO DO METODO, RETORNA O ERRO
					return new ResponseEntity<Object>(erro, HttpStatus.UNAUTHORIZED);
				}
			}
			
		} else {
			// SE O ID PASSADO NÃO EXISTIR
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "ID inválido", null);
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/*
	 *
	 * METODO QUE ALTERA O STATUS DE UM AGENDAMENTO NO CASO SE O AGENDAMENTO ESTIVER
	 * PENDENTE MUDA PARA ACEITO
	 *
	 */@Administrador
	@RequestMapping(value = "/alterarStatusAceito/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> alterarStatusAceito(@PathVariable("id") Long id, @RequestBody Agendamento agendamento,
			HttpServletRequest request) {// VERIFICA SE O STATUS É DO AGENDAMENTO É IGUAL A PENDENTE

		agendamento = repository.findById(id).get();
		// IGUAL A PENDENTE
		if (agendamento.getStatus() == Status.PENDENTE) {
			agendamento.setStatus(Status.ACEITO);
			repository.save(agendamento);
			Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
			return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
		} else {
			// RETORNA QUE NÃO FOI ECONTRADA
			Erro erro = new Erro(HttpStatus.NOT_FOUND, "Agendamentos com status Pendentes não encontrado", null);
			return new ResponseEntity<Object>(erro, HttpStatus.NOT_FOUND);
		}
	}/*
		 *
		 * METODO QUE ALTERA O STATUS DE UM AGENDAMENTO PARA RECUSAOD, SE O STATUS
		 * ESTIVER PENDENTE ALTERA PARA RECUSADO
		 *
		 */

	@Administrador
	@RequestMapping(value = "/alterarStatusRecusado/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> alterarStatusRecusado(@PathVariable("id") Long id,
			@RequestBody Agendamento agendamento, HttpServletRequest request) {// VERIFICA SE O STATUS DO AGENDAMENTO É

		agendamento = repository.findById(id).get();
		// IGUAL A PENDENTE
		if (agendamento.getStatus() == Status.PENDENTE) {
			agendamento.setStatus(Status.RECUSADO);
			repository.save(agendamento);
			Sucesso sucesso = new Sucesso(HttpStatus.OK, "Sucesso");
			return new ResponseEntity<Object>(sucesso, HttpStatus.OK);
		} else {
			// RETORNA QUE NÃO FOI ENCONTRADO
			Erro erro = new Erro(HttpStatus.NOT_FOUND, "Agendamentos com status Pendentes não encontrado", null);
			return new ResponseEntity<Object>(erro, HttpStatus.NOT_FOUND);
		}
	}

	@Administrador
	@RequestMapping(value = "/usuario/{id}", method = RequestMethod.GET)
	public List<Agendamento> getByAgendamentoUsuarioId(@PathVariable("id") Long id) {
		return repository.findByUsuarioId(id);
	}

	/*
	 *
	 * MÉTODO QUE BUSCA TODOS OS AGENDAMENTOS COM O STATUS PENDENTE
	 *
	 */@Administrador
	@RequestMapping(value = "/pendentes", method = RequestMethod.GET)
	public List<Agendamento> getAgendamentoPendente(Agendamento agendamento) {
		return repository.findByStatusPendente();
	}

	/*
	 *
	 * BUSCANDO POR TITULO
	 *
	 */@Administrador
	@RequestMapping(value = "/titulo", method = RequestMethod.GET)
	public List<Agendamento> getAgendamentoTitulo(String titulo) {
		return repository.findByTitulo(titulo);
	}/*
		 *
		 * BUSCANDO POR DESCRIÇÃO
		 *
		 */

	@Administrador
	@RequestMapping(value = "/descricao", method = RequestMethod.GET)
	public List<Agendamento> getAgendamentoDescricao(String descricao) {
		return repository.findByDescricao(descricao);
	}/*
		 *
		 * BUSCANDO POR STATUS
		 *
		 */

	@Administrador
	@RequestMapping(value = "/status", method = RequestMethod.GET)
	public List<Agendamento> getAgendamentoStatus(Status status) {
		return repository.findByStatus(status);
	}

	/*
	 *
	 * BUSCANDO POR PERIODO
	 *
	 */@Administrador
	@RequestMapping(value = "/periodo", method = RequestMethod.GET)
	public List<Agendamento> getAgendamentoPeriodo(Periodo periodo) {
		return repository.findByPeriodo(periodo);
	}

	public boolean verificaRecusado(List<Agendamento> agendamentos) {
		

		
		System.err.println(agendamentos.size());
		for (int i = 0; i < agendamentos.size(); i++) {
			if (agendamentos.get(i).getStatus() == Status.RECUSADO) {
				continue;
			} else {
				return false;
			}
		}
		return true;
	}

	public void salvaAltera(HttpServletRequest request, Agendamento agendamento) {
		String token = request.getHeader("Authorization");

		// BUSCANDO O ALGORITMO NO USUARIO
		Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);

		// OBJ PARA VERIFICAR O TOKEN
		JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();

		// DECODIFICA O TOKEN
		DecodedJWT jwt = verifier.verify(token);

		// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
		Map<String, Claim> claims = jwt.getClaims();

		// SE O USUARIO ESCOLHER O DIA INTEIRO, ESSE PARAMETROS VAI VIM NULOS, ENTÃO
		// VAMO SETTAR O PERIODO E O HORARIO
		System.out.println("antes if dia todo");

		System.out.println("depois de passar por todos os ifs");

		repository.save(agendamento);
		logService.log("O " + claims.get("nivel").toString() + " " + claims.get("nome") + "criou um evento.",
				TipoLog.CADASTRO_AGENDAMENTO, request);

	}

	public boolean verificacaoAgendamento(Agendamento agendamento, HttpServletRequest request) {
		
		
		if (repository.validacaoDataEHora(agendamento.getDataInicio(), agendamento.getDataFinalizada()).isEmpty()
				&& repository.validacaoDataFora(agendamento.getDataInicio(), agendamento.getDataFinalizada()).isEmpty()
				&& repository.validacaoDataMaior(agendamento.getDataInicio(), agendamento.getDataFinalizada()).isEmpty()
				&& repository.validacaoDataMenor(agendamento.getDataInicio(), agendamento.getDataFinalizada())
						.isEmpty()) {

			System.out.println("entrou if data e hora");
			agendamento.setStatus(Status.PENDENTE);
			salvaAltera(request, agendamento);
			return true;

		} else {
			if (verificaRecusado(repository.validacaoDataEHora(agendamento.getDataInicio(),
					agendamento.getDataFinalizada())) == true) {
				agendamento.setStatus(Status.PENDENTE);
				salvaAltera(request, agendamento);
				return true;
			} else if (verificaRecusado(repository.validacaoDataFora(agendamento.getDataInicio(),
					agendamento.getDataFinalizada())) == true) {
				agendamento.setStatus(Status.PENDENTE);
				salvaAltera(request, agendamento);
				return true;
			} else if (verificaRecusado(repository.validacaoDataMaior(agendamento.getDataInicio(),
					agendamento.getDataFinalizada())) == true) {
				agendamento.setStatus(Status.PENDENTE);
				salvaAltera(request, agendamento);
				return true;
			} else if (verificaRecusado(repository.validacaoDataMenor(agendamento.getDataInicio(),
					agendamento.getDataFinalizada())) == true) {
				agendamento.setStatus(Status.PENDENTE);
				salvaAltera(request, agendamento);
				return true;
			} else {
				return false;
			}

		}
	}
}

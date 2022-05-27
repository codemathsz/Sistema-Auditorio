package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;

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

import br.com.senaisp.sistemaauditorio.annotation.Administrador;
import br.com.senaisp.sistemaauditorio.annotation.Publico;
import br.com.senaisp.sistemaauditorio.annotation.Usuario;
import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.Status;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.repository.AgendamentoRepository;
import br.com.senaisp.sistemaauditorio.services.LogService;

/*
 * 
 *  REST CONTROLLER DA MODEL agendamento
 *  API's CRUD
 *   
 */


@CrossOrigin
@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoRestController {

	
	@Autowired // INSTANCOANDO O REPOSITORY
	public AgendamentoRepository repository;
	
	@Autowired // INSTANCIANDO O logService
	public LogService logService;
	
	
	
	
	
	
	/*
	 * METODO QUE CRIA UM NOVO AGENDAMENTO
	 *	  
	 * */
	
	@Usuario
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> criar(@RequestBody Agendamento agendamento, HttpServletRequest request) {
		
		try {
			
			// SALVANDO O AGENDAMENTO NO BANCO
			repository.save(agendamento);
			// SALVANDO A LOG NO BANCO, INFORMANDO A CRIANDO DE UM NOVO AGENDAMENTO, NOME DO USUARIO QUE A CRIOU
			logService.salvarLogAgendamento(agendamento.getUsuario(),agendamento, TipoLog.AGENDAMENTO, request);
			
			// RETORNO DO METODO
			return ResponseEntity.created(URI.create("/api/agendamento" + agendamento.getId())).body(agendamento);
		
		}catch (Exception e) {
			
			if (agendamento.getTitulo() == null) {//	*** TITULO AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *TITULO* DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if(agendamento.getDescricao() == null) {//	** DESCRIÇÃO AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "A *DESCRIÇÃO*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getDataInicio() == null) {// 	** DATA DE INICIO DO AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "A *DATA DE INICIO*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getDataFinalizada() == null) {// 	** DATA FINAL DO AGENDAMENTO NULA
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "A *DATA  FINAL* DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if(agendamento.getStatus() == null) {//	** STATUS DO AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *STATUS*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if(agendamento.getPeriodo() == null) {//	** PERIODO DO AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *PERIODO*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getTipo() == null) {//	** TIPO DE AGENDAMENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *TIPO*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getHoraInicio() == null) {//	** HORA INICIO AGENDAMENTO NULO
				
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "A *HORA DE INICIO *  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getHoraFinalizada() == null) {//	** HORA FINAL DO AGENDAENTO NULO
				
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "A *HORA FINAL *  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}else if (agendamento.getUsuario() == null) {//	* USUARIO DO AGENDAMENTO NULO
			

				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *USUARIO*  DO AGENDAMENTO NÃO PODE SER NULO", e.getClass().getName());
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			e.printStackTrace();
			// ERRO PERSONALIZADO
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Agendamento Duplicado", e.getClass().getName());
			// RETORNO DO METODO, RETORNA O ERRO
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	
	/*
	 *
	 * METODO QUE TRAZ DO BANCO E LISTA TODOS OS AGENDAMENTOS
	 * 
	 */
	
	@Publico
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Agendamento> lista(Agendamento agendamento) {

		// TRAZ DO BANCO E RETORNA
		return repository.findAll();
	}

	
	/*
	 * 
	 *  METODO QUE TRAZ OS AGENDAMENTOS DO BANCO POR ID
	 * 
	 */
	
	@Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Agendamento getById(@PathVariable("id") Long idAgendamento, Agendamento agendamento) {
		
		// VERIFICA SE O idAgendamento PASSADO "EXISTE" OU É IGUAL AO ID DO USUARIO 
		if(idAgendamento == agendamento.getId()) {
			
			// RETORNA A BUSCA DO METODO
			return repository.findById(idAgendamento).get();
		}else {
			
			// SE O id PASSADO AO METODO NÃO EXISTIR
			throw new RuntimeException();
		}
	}

	
	
	/*
	 * 
	 * METODO QUE DELETA UM AGENDAMENTO DO BANCO
	 * 
	 */
	
	@Administrador
	@Usuario
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Agendamento> deletar(@PathVariable("id") Long id, Agendamento agendamento, HttpServletRequest request) {

		// SE O ID DO agendamento É IGUAL AO id PASSADO
		if(agendamento.getId() == id) {
			
			// DELETA O agendamento DO BANCO
			repository.deleteById(id);
			// LOG, SALVA A AÇÃO NO BANCO, INFORMANDO UM AGENDAMENTO DELETADO E O NOME DE QUE O DELETOU
			logService.salvarLogAgendamento(agendamento.getUsuario(), agendamento, TipoLog.DELETAR, request);
			// RETORNO DO METODO
			return ResponseEntity.ok().build();
		}else {
			
			// SE O id PASSADO NÃO EXISTIR
			throw new RuntimeException();
		}

	}

	
	/*
	 * 
	 * METODO QUE ALTERA UM AGENDAMENTO
	 * 
	 */
	
	@Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterar(@PathVariable("id") Long id, @RequestBody Agendamento agendamento, HttpServletRequest request) {

		// SE O ID PASSADO EXISTIR
		if (id == agendamento.getId()) {
			
			// SALVA A ALTERAÇÃO QUE FOI FEITA NO BANCO
			repository.save(agendamento);
			// LOG, SALVA A LOG NO BANCO INFORMANDO A ALTERACÃO DE QUAL AGENDAMENTO E QUAL USUARIO QUE FEZ A ALTERAÇÃO
			logService.salvarLogAgendamento( agendamento.getUsuario(),agendamento, TipoLog.ALTERAR, request);
			// RETORNO DO METODO
			return ResponseEntity.ok().build();
			
		}else {
			// SE O ID PASSADO NÃO EXISTIR 
			throw new RuntimeException("ID incorreto ou inexistente");
		}
		
		
	}

	/*
	 * 
	 *  METODO QUE ALTERA O STATUS DE UM AGENDAMENTO NO CASO SE O AGENDAMENTO ESTIVER PENDENTE MUDA PARA ACEITO
	 * 
	 */
	
	@Administrador
	@RequestMapping(value = "/alteraStatusAceito/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterarStatusAceito(@PathVariable("id") Long id, @RequestBody Agendamento agendamento, HttpServletRequest request){
		
		
		// VERIFICA SE O STATUS É DO AGENDAMENTO É IGUAL A PENDENTE
		if (agendamento.getStatus() == Status.PENDENTE) {
			
			// TROCA O STATUS DO GENDAMENTO DE PENDENTE PARA ACEITA
			agendamento.setStatus(Status.ACEITO);
			// SALAV O AGENDAMENTO COM O NOVO STATUS
			repository.save(agendamento);
			// LOG, SALVA NO BANCO E INFORMA QUE HOUVE UM ALTERAÇÃO NO STATUS DO AGENDAMENTO, COM O NOME DO AGENDAMENTO MUDADO E DO USUARIO QUE MUDOU
			logService.salvarLogAgendamento(agendamento.getUsuario(), agendamento, TipoLog.ALTERACAO_STATUS, request);
			// RETORNO DO METODO, RETORNA QUE DEU CERTO
			return ResponseEntity.ok().build();
		}else {
			// RETORNA QUE NÃO FOI ECONTRADA
			return ResponseEntity.notFound().build();
		}
		
	}
	
	
	
	/*
	 * 
	 * METODO QUE ALTERA O STATUS DE UM AGENDAMENTO PARA RECUSAOD, SE O STATUS ESTIVER PENDENTE ALTERA PARA RECUSADO
	 * 
	 */
	@Administrador
	@RequestMapping(value = "/alterarStatusRecusado/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterarStatusRecusado(@PathVariable("id") Long id, @RequestBody Agendamento agendamento, HttpServletRequest request){
		
		
		//VERIFICA SE O STATUS DO AGENDAMENTO É IGUAL A PENDENTE
		if(agendamento.getStatus() ==  Status.PENDENTE) {
			// TROCA O STATUS DO AGENDAMENTO PARA RECUSADO
			agendamento.setStatus(Status.RECUSADO);
			// SALVA O AGENDAMENTO NO BANCO DE DADOS COM O NOVO STATUS
			repository.save(agendamento);
			// LOG, SALVA NO BANCO E INFORMA QUE HOUVE UM ALTERAÇÃO NO STATUS DO AGENDAMENTO, COM O NOME DO AGENDAMENTO MUDADO E DO USUARIO QUE MUDOU
			logService.salvarLogAgendamento(agendamento.getUsuario(), agendamento, TipoLog.ALTERACAO_STATUS, request);
			// RETORNA QUE DEU CERTO
			return ResponseEntity.ok().build();
		}else {
			// RETORNA QUE NÃO FOI ENCONTRADO
			return ResponseEntity.notFound().build();
		}
		
	}
}
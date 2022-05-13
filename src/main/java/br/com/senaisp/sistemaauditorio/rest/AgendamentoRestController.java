package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import br.com.senaisp.sistemaauditorio.repository.AgendamentoRepository;

@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoRestController {

	@Autowired
	public AgendamentoRepository repository;
	
	@Usuario
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> criar(@RequestBody Agendamento agendamento) {
		
		try {
			if(agendamento != null) {
				repository.save(agendamento);
				return ResponseEntity.created(URI.create("/api/agendamento" + agendamento.getId())).body(agendamento);
			}else {
				throw new NullPointerException();
			}
		}catch (Exception e) {
			
			e.printStackTrace();
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Agendamento Duplicado", e.getClass().getName());
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Publico
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Agendamento> lista(Agendamento agendamento) {

		return repository.findAll();
	}

	@Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Agendamento getById(@PathVariable("id") Long idAgendamento, Agendamento agendamento) {
		if(idAgendamento == agendamento.getId()) {
			return repository.findById(idAgendamento).get();			
		}else {
			throw new RuntimeException();
		}
	}

	
	@Administrador
	@Usuario
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Agendamento> deletar(@PathVariable("id") Long id, Agendamento agendamento) {

		if(agendamento.getId() == id) {
			repository.deleteById(id);
			return ResponseEntity.noContent().build();
		}else {
			throw new RuntimeException();
		}

	}

	@Usuario
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterar(@PathVariable("id") Long id, @RequestBody Agendamento agendamento) {

		if (id != agendamento.getId()) {
			throw new RuntimeException("Id Invalido !!!!!!!");
		}
		repository.save(agendamento);

		return ResponseEntity.ok().build();
	}

	
	@Administrador
	@RequestMapping(value = "/alteraStatusAceito/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterarStatusAceito(@PathVariable("id") Long id, @RequestBody Agendamento agendamento){
		
		//VARIÁVEL PARA PEGAR O STATUS
		Status status = null;
		
		// VERIFICA SE O STATUS É DO AGENDAMENTO É IGUAL A PENDENTE
		if (agendamento.getStatus() == status.PENDENTE) {
			
			// TROCA O STATUS DO GENDAMENTO DE PENDENTE PARA ACEITA
			agendamento.setStatus(status.ACEITO);
			// SALAV O AGENDAMENTO COM O NOVO STATUS
			repository.save(agendamento);
			
			// RETORNA QUE DEU CERTO
			return ResponseEntity.ok().build();
		}else {
			// RETORNA QUE NÃO FOI ECONTRADA
			return ResponseEntity.notFound().build();
		}
		
	}
	
	@Administrador
	@RequestMapping(value = "/alterarStatusRecusado/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterarStatusRecusado(@PathVariable("id") Long id, @RequestBody Agendamento agendamento){
		
		// VARIÁVEL PARA PEGAR O STATUS
		Status status = null;
		
		//VERIFICA SE O STATUS DO AGENDAMENTO É IGUAL A PENDENTE
		if(agendamento.getStatus() ==  status.PENDENTE) {
			// TROCA O STATUS DO AGENDAMENTO PARA RECUSADO
			agendamento.setStatus(status.RECUSADO);
			// SALVA O AGENDAMENTO NO BANCO DE DADOS COM O NOVO STATUS
			repository.save(agendamento);
			
			// RETORNA QUE DEU CERTO
			return ResponseEntity.ok().build();
		}else {
			// RETORNA QUE NÃO FOI ENCONTRADO
			return ResponseEntity.notFound().build();
		}
		
	}
}
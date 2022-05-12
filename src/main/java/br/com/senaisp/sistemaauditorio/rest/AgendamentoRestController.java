package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Status;
import br.com.senaisp.sistemaauditorio.repository.AgendamentoRepository;

@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoRestController {

	@Autowired
	public AgendamentoRepository repository;

	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Agendamento> criar(@RequestBody Agendamento agendamento) {
		
		repository.save(agendamento);
		return ResponseEntity.created(URI.create("/api/agendamento" + agendamento.getId())).body(agendamento);

	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Agendamento> lista(Agendamento agendamento) {

		return repository.findAll();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Agendamento getById(@PathVariable("id") Long idAgendamento) {
		return repository.findById(idAgendamento).get();
	}

	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Agendamento> deletar(@PathVariable("id") Long id) {

		repository.deleteById(id);
		return ResponseEntity.noContent().build();

	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterar(@PathVariable("id") Long id, @RequestBody Agendamento agendamento) {

		if (id != agendamento.getId()) {
			throw new RuntimeException("Id Invalido !!!!!!!");
		}
		repository.save(agendamento);

		return ResponseEntity.ok().build();
	}

	
	@RequestMapping(value = "/alteraStatus/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> alterarStatusAceito(@PathVariable("id") Long id, @RequestBody Agendamento agendamento){
		
		Status status = null;
		
		if (agendamento.getStatus() == status.PENDENTE) {
			
			agendamento.setStatus(status.ACEITO);
			repository.save(agendamento);
			
			return ResponseEntity.ok().build();
		}else {
			
			return ResponseEntity.notFound().build();
		}
		
	}
}
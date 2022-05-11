package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.TipoEvento;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.TipoEventoRepository;

@RestController
@RequestMapping("/api/tipo")
public class TipoEventoRestController {

	@Autowired
	private TipoEventoRepository repository;
	
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> cadastrarTipoEvento(@RequestBody TipoEvento tipoEvento){
		
		try {
			
			repository.save(tipoEvento);
			return ResponseEntity.created(URI.create("api/tipoevento"+tipoEvento.getId())).body(tipoEvento);
		}catch (DataIntegrityViolationException e) {
			
			e.printStackTrace();
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Registro Duplicado", e.getClass().getName());
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<TipoEvento> getTipoEventos(){
	
		return repository.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<TipoEvento> getTipoEventoById(@PathVariable("id") Long id){
		
		Optional<TipoEvento> optional = repository.findById(id);
		
		if (optional.isPresent()) {
			
			
			return ResponseEntity.ok(optional.get());	
		}else {
		
			return ResponseEntity.notFound().build();
		}
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> altualizarTipoEvento(@PathVariable("id") Long idTipoEvento, @RequestBody TipoEvento tipoEvento){
		
		if(tipoEvento.getId() != idTipoEvento) {
			throw new RuntimeException("ID Inválido");
		}else {
			repository.save(tipoEvento);
			return ResponseEntity.ok().build();
		}
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<TipoEvento> excluirTipoEvento(@PathVariable("id") Long idTipoEvento){
		
		repository.deleteById(idTipoEvento);
		return ResponseEntity.noContent().build();
	}
}







package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.TipoEvento;
import br.com.senaisp.sistemaauditorio.repository.TipoEventoRepository;

@CrossOrigin
@RestController
@RequestMapping("/api/tipo")
public class TipoEventoRestController {

	@Autowired
	private TipoEventoRepository repository;
	
//	@Autowired
//	private LogService log;
	
	
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> cadastrarTipoEvento(@RequestBody TipoEvento tipoEvento, HttpServletRequest request){
		
		try {
			
			if (repository.nomeDuplicado(tipoEvento.getNome()).isEmpty()) {
			
				// SALVANDO TIPO NO BD
				repository.save(tipoEvento);
			}else {
				
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O *Nome* do Tipo de Evento já foi cadastrado!", null);
				// RETORNO DO MÉTODO
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}
			
			
			// CRIADO LOG
			/* log.salvarLogTipo(tipoEvento, TipoLog.CADASTRO_EVENTO, request); */
			//RETORNO DO METODO
			return ResponseEntity.created(URI.create("api/tipoevento"+tipoEvento.getId())).body(tipoEvento);
		}catch (DataIntegrityViolationException e) {
			
			if (tipoEvento.getNome() == null) {
							
				e.printStackTrace();
				// ERRO PERSONALIZADO
				Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "O campo *Nome* não pode ser vazio!", e.getClass().getName());
				// RETORNO DO MÉTODO
				return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
				
			}
		
			e.printStackTrace();
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro não indentificado ao cadastrar.", e.getClass().getName());// CRIANDO O ERRO COM O STATUS CODIGO, MENSSAGEM DE ERRO E EXCEPTION 
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);// RETURN ERRO
		}
		
	}
	
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<TipoEvento> getTipoEventos(){
	
		return repository.findAll();
	}
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<TipoEvento> getTipoEventoById(@PathVariable("id") Long id){
		
		Optional<TipoEvento> optional = repository.findById(id);
		
		if (optional.isPresent()) {
			
			
			return ResponseEntity.ok(optional.get());	
		}else {
		
			return ResponseEntity.notFound().build();
		}
	}
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> altualizarTipoEvento(@PathVariable("id") Long idTipoEvento, @RequestBody TipoEvento tipoEvento, HttpServletRequest request){
		
		if(tipoEvento.getId() != idTipoEvento) {
			throw new RuntimeException("ID Inválido");
		}else {
			// SALVA AS ALTERAÇÕES SO BD
			repository.save(tipoEvento);
			// CRIA O LOG
			/* log.salvarLogTipo(tipoEvento, TipoLog.ALTERAR, request); */
			return ResponseEntity.ok().build();
		}
	}
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<TipoEvento> excluirTipoEvento(@PathVariable("id") Long idTipoEvento,@RequestBody TipoEvento tipoEvento, HttpServletRequest request){
		
		// DELETA DO BANCO
		repository.deleteById(idTipoEvento);
		// CRIA O LOG
		/* log.salvarLogTipo(tipoEvento , TipoLog.DELETAR, request); */
		return ResponseEntity.noContent().build();
	}
	
	/*
	 * 
	 * BUSCANDO POR TIPOS DE EVENTOS
	 * 
	 */
	
	@RequestMapping(value = "/nome", method = RequestMethod.GET)
	public List<TipoEvento> getTipoEventoNome (String nome){
		return repository.findByTipo(nome);
	}
	
}







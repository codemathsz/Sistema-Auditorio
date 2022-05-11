package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import java.util.Iterator;
import java.util.List;
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
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioRestController {

	@Autowired
	private UsuarioRepository repository;
	
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario){// ResponseEntity --> MANIPULAR A RESPOSTA, CEFECCIONAR o response, @RequestBody USUARIO VEM DO CORPO DA APLICAÇÃO
		
		try {
			
			// SALVA USUARIO NO BD
			repository.save(usuario);
			
			//	ACRESENTANDO NO CORPO DA RESPOSTA O OBJETO INSERIDO
			return ResponseEntity.created(URI.create("/api/usuario"+usuario.getId())).body(usuario);// body(usuario) colocar no body a resposta gerada
			
		} catch (DataIntegrityViolationException e) {// REGISTRO DUPLICADO
			
			e.printStackTrace();
			Erro erro = new Erro(HttpStatus.INTERNAL_SERVER_ERROR, "Registro Duplicado", e.getClass().getName());// CRIANDO O ERRO COM O STATUS CODIGO, MENSSAGEM DE ERRO E EXCEPTION 
			return new ResponseEntity<Object>(erro, HttpStatus.INTERNAL_SERVER_ERROR);// RETURN ERRO
		}
		
	}
	
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Usuario> getUsuarios(){
		
		return repository.findAll();
	
	}
	
	
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Usuario> getUsuarioById(@PathVariable("id") Long idUsuario){
		Optional<Usuario> optional = repository.findById(idUsuario);
		
		if(optional.isPresent()) {
			return ResponseEntity.ok(optional.get());
		}else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> atualizarUsuario(@PathVariable("id") Long idUsuario, @RequestBody Usuario usuario ){
		
		// VERIFICA SE O ID DO USUARIO É IGUAL AO INFORMADO( SE EXISTE)
		if (usuario.getId() != idUsuario) {
			
			throw new RuntimeException("ID inválido");// CASO DE ERRO, EXIBE MENSAGEM
		}
		
		repository.save(usuario);// SALVA AS ALTERAÇÕES NO BD
		
		return ResponseEntity.ok().build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Usuario> excluirUsuario(@PathVariable("id") Long idUsuario){
		
		repository.deleteById(idUsuario); // EXCLUE O USUÁRIO DO BANCO DE DADOS
		return ResponseEntity.noContent().build();
	}
	
	
	
	
}

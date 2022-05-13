package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
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

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import br.com.senaisp.sistemaauditorio.annotation.Administrador;
import br.com.senaisp.sistemaauditorio.annotation.Publico;
import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.TokenJWT;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioRestController {
	
	
	public static final String EMISSOR = "SENAI";
	// CHAVE PARA ACESSAR O EMISSOR
	public static final String SECRET = "Ag&nd4m&n10DO4ud!t0r!oCOMg4br!&l,ru8&n$,m4t#,k4l$b!,p4u70,8run0";
	

	@Autowired
	private UsuarioRepository repository;
	
	@Publico
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
	
	
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Usuario> getUsuarios(){
		
		return repository.findAll();
	
	}
	
	
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public ResponseEntity<Usuario> getUsuarioById(@PathVariable("id") Long idUsuario){
		Optional<Usuario> optional = repository.findById(idUsuario);
		
		if(optional.isPresent()) {
			return ResponseEntity.ok(optional.get());
		}else {
			return ResponseEntity.notFound().build();
		}
	}
	
	
	@Administrador
	@br.com.senaisp.sistemaauditorio.annotation.Usuario
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> atualizarUsuario(@PathVariable("id") Long idUsuario, @RequestBody Usuario usuario ){
		
		// VERIFICA SE O ID DO USUARIO É IGUAL AO INFORMADO( SE EXISTE)
		if (usuario.getId() != idUsuario) {
			
			throw new RuntimeException("ID inválido");// CASO DE ERRO, EXIBE MENSAGEM
		}
		
		repository.save(usuario);// SALVA AS ALTERAÇÕES NO BD
		
		return ResponseEntity.ok().build();
	}
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Usuario> excluirUsuario(@PathVariable("id") Long idUsuario){
		
		repository.deleteById(idUsuario); // EXCLUE O USUÁRIO DO BANCO DE DADOS
		return ResponseEntity.noContent().build();
	}
	
	@Publico
	@RequestMapping(value = "/logar", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE )
	public ResponseEntity<TokenJWT> login(@RequestBody Usuario usuario){
		
		usuario = repository.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha());
		
		if (usuario != null) {
			
			//Fazendo uma variavel para criar dados no payload (payload = informações que você vai mandar)
			Map<String, Object> payload = new HashMap<String, Object>();
			payload.put("id", usuario.getId());
			payload.put("nome", usuario.getNome());
			payload.put("nivel", usuario.getNivel());
			payload.put("email", usuario.getEmail());
			payload.put("nif", usuario.getNif());
			
			//criando varievel para data de expiração
			Calendar expiration = Calendar.getInstance();
			
			//add um tempo para inspiração
			expiration.add(Calendar.HOUR, 12);
			
			//algoritmo para assinar o token
			Algorithm algoritmo = Algorithm.HMAC256(SECRET);
			
			// criando token
			TokenJWT tokenJwt = new TokenJWT();
			
			// gera token
			tokenJwt.setToken(JWT.create()
					.withPayload(payload)
					.withIssuer(EMISSOR)
					.withExpiresAt(expiration.getTime())
					.sign(algoritmo));
			
			return ResponseEntity.ok(tokenJwt);
			
		} else {
			return new ResponseEntity<TokenJWT>(HttpStatus.UNAUTHORIZED);
		}
	}
	
	
}

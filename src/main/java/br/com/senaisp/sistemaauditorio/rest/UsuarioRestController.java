package br.com.senaisp.sistemaauditorio.rest;

import java.net.URI;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import br.com.senaisp.sistemaauditorio.annotation.Administrador;
import br.com.senaisp.sistemaauditorio.annotation.Publico;
import br.com.senaisp.sistemaauditorio.model.Erro;
import br.com.senaisp.sistemaauditorio.model.Nivel;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.model.TokenJWT;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.UsuarioRepository;
import br.com.senaisp.sistemaauditorio.services.LogService;

@CrossOrigin
@RestController
@RequestMapping("/api/usuario")
public class UsuarioRestController {
	
	
	public static final String EMISSOR = "SENAI";
	// CHAVE PARA ACESSAR O EMISSOR
	public static final String SECRET = "Ag&nd4m&n10DO4ud!t0r!oCOMg4br!&l,ru8&n$,m4t#,k4l$b!,p4u70,8run0";
	

	@Autowired
	private UsuarioRepository repository;
	
	@Autowired
	private LogService log;
	
	
	@Administrador
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario, HttpServletRequest request){// ResponseEntity --> MANIPULAR A RESPOSTA, CEFECCIONAR o response, @RequestBody USUARIO VEM DO CORPO DA APLICAÇÃO
		
		
		
		
		try {
			
			// SALVA USUARIO NO BD
			repository.save(usuario);
			// SALVA LOG NO BD
			
			
			
			
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
	public ResponseEntity<Void> atualizarUsuario(@PathVariable("id") Long idUsuario, @RequestBody Usuario usuario,HttpServletRequest request ){
		
		// VERIFICA SE O ID DO USUARIO É IGUAL AO INFORMADO( SE EXISTE)
		if (usuario.getId() != idUsuario) {
			
			throw new RuntimeException("ID inválido");// CASO DE ERRO, EXIBE MENSAGEM
		}
		
		repository.save(usuario);// SALVA AS ALTERAÇÕES NO BD
		log.salvarLogUsuario(usuario, TipoLog.ALTERAR, request);	
		
		return ResponseEntity.ok().build();
		
	}
	
	@Administrador
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Usuario> excluirUsuario(@PathVariable("id") Long idUsuario){
		
		repository.deleteById(idUsuario); // EXCLUE O USUÁRIO DO BANCO DE DADOS
		return ResponseEntity.noContent().build();
	}
	
	
	@Publico
	@RequestMapping(value = "/login", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE )
	public ResponseEntity<TokenJWT> login(@RequestBody Usuario usuario, HttpServletRequest request){
		
		usuario = repository.findByNifAndSenha(usuario.getNif(), usuario.getSenha());
		
		if (usuario != null) {
			System.out.println(usuario.getNome());
			//Fazendo uma variavel para criar dados no payload (payload = informações que você vai mandar)
			Map<String, Object> payload = new HashMap<String, Object>();
			payload.put("id", usuario.getId());
			payload.put("nome", usuario.getNome());
			payload.put("nivel", usuario.getNivel().ordinal());
			payload.put("email", usuario.getEmail());
			payload.put("nif", usuario.getNif());
			
			//criando varievel para data de expiração
			Calendar expiration = Calendar.getInstance();
			
			//add um tempo para inspiração
			expiration.add(Calendar.HOUR, 12);
			
			//algoritmo para assinar o token
			Algorithm algoritmo = Algorithm.HMAC512(SECRET);
			
			// criando token
			TokenJWT tokenJwt = new TokenJWT();
			
			// gera token
			tokenJwt.setToken(JWT.create()
					.withPayload(payload)
					.withIssuer(EMISSOR)
					.withExpiresAt(expiration.getTime())
					.sign(algoritmo));
			
			
			System.out.println(tokenJwt);
			
//			log.salvarLogUsuario(usuario, TipoLog.LOGAR, request);
			return ResponseEntity.ok(tokenJwt);
			
		} else {
			return new ResponseEntity<TokenJWT>(HttpStatus.UNAUTHORIZED);
		}
	}
	
	
	/*
	 * 
	 * MÉTODO QUE BUSCA PELO NOME
	 * 
	 */
	
	@RequestMapping(value = "/nome", method = RequestMethod.GET)
	public List<Usuario> getUsuarioNome(String nome){
		
		return repository.findByLikeNome(nome);
	}
	
	
	/*
	 * 
	 *  MÉTODO QUE BUSCA POR EMAIL
	 * 
	 */
	@RequestMapping(value = "/email", method = RequestMethod.GET)
	public List<Usuario> getUsuarioEmail(String email){
		
		return repository.findByLikeEmail(email);
	}
	
	/*
	 * 
	 *  MÉTODO QUE BUSCA POR NIF
	 * 
	 */
	@RequestMapping(value = "/nif", method = RequestMethod.GET)
	public List<Usuario> getUsuarioNif(String nif){
		
		return repository.findByLikeNif(nif);
	}
	
	/*
	 * 
	 *  MÉTODO QUE BUSCA POR NIVEL
	 * 
	 */
	@RequestMapping(value = "/nivel", method = RequestMethod.GET)
	public List<Usuario> getUsuarioNivel(Nivel nivel){
		
		return repository.findByNivel(Nivel.ADMINISTRADOR);
	}
	
}

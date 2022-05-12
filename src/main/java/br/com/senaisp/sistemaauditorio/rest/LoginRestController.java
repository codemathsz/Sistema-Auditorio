package br.com.senaisp.sistemaauditorio.rest;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import br.com.senaisp.sistemaauditorio.model.TokenJWT;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.LoginRepository;
import br.com.senaisp.sistemaauditorio.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/login")
public class LoginRestController {
	
	public static final String EMISSOR = "SENAI";
	//chave para acessar o EMISSOR
	public static final String SECRET = "G1A8B2R0IE0L6M2A0RQ0U3ES";

	@Autowired
	private LoginRepository repository;
	
	@Autowired
	private UsuarioRepository repositoryUsuario;
	
	@RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE )
	public ResponseEntity<TokenJWT> logar(Usuario usuario){
		
		usuario = repositoryUsuario.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha());
		
		if (usuario != null) {
			
			//Fazendo uma variavel para criar dados no payload (payload = informações que você vai mandar)
			Map<String, Object> payload = new HashMap<String, Object>();
			payload.put("idUsuario", usuario.getId());
			payload.put("nomeUsuario", usuario.getNome());
			payload.put("nivelUsuario", usuario.getNivel());
			
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
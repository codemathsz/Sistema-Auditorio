package br.com.senaisp.sistemaauditorio.services;

import java.util.Calendar;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import br.com.senaisp.sistemaauditorio.model.Log;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.LogRepository;
import br.com.senaisp.sistemaauditorio.rest.UsuarioRestController;

@Service
public class LogService {

	@Autowired
	private LogRepository logRepository;

	
	public boolean log(String descricao, TipoLog tipoLog, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		
		// BUSCANDO O ALGORITMO NO USUARIO
		Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);

		// OBJ PARA VERIFICAR O TOKEN
		JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();

		// DECODIFICA O TOKEN
		DecodedJWT jwt = verifier.verify(token);

		// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
		Map<String, Claim> claims = jwt.getClaims();
		
		
		Log log = new Log();
		Usuario usuarioNome = (Usuario) claims.get("nome");
		Usuario usuarioId = (Usuario) claims.get("id");
		
		log.setUsuarioNome(usuarioNome.toString());
		log.setUsuarioId(usuarioId.toString());
		log.setLogData(Calendar.getInstance());
		log.setDescricao(descricao);
		log.setTipoLog(tipoLog);

		
		logRepository.save(log);
		return true;
	}

}
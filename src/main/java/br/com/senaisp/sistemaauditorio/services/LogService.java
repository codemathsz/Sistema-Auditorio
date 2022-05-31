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

import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Log;
import br.com.senaisp.sistemaauditorio.model.Nivel;
import br.com.senaisp.sistemaauditorio.model.TipoEvento;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.LogRepository;
import br.com.senaisp.sistemaauditorio.rest.UsuarioRestController;

@Service
public class LogService {

	@Autowired
	private LogRepository logRep;

	
	public boolean salvarLogUsuario(Usuario usuario, TipoLog tipoLog, HttpServletRequest request) {

		
		// VARIAVEL PARA O TOKEN
		String token;
		
		// RECUPERA O TOKEN
		token = request.getHeader("Authorization");
		
		// BUSCANDO O ALGORITMO NO USUARIO 
		Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);
		
		// OBJ PARA VERIFICAR O TOKEN
		JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();
		
		// DECODIFICA O TOKEN
		DecodedJWT jwt = verifier.verify(token);
		
		// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
		Map<String, Claim> claims = jwt.getClaims();
			
			
		// INSTANCIANDO A LOG
		Log log = new Log(usuario, tipoLog);
		
		
		
		// SE O TIPO DA LOG FOR LOGAR
		if (log.getTipoLog() == TipoLog.LOGAR) {
	
			log.setDescricao("Usuario " + claims.get("nome") + " se logou");
	
		} else if (log.getTipoLog() == TipoLog.CADASTRO_USUARIO) { // SE O TIPO DA LOG FOR CADASTRO_USUARIO
			
			
			
			log.setDescricao("O Usuario " + usuario.getNome() + " se cadastrou ");
	
		} else if (log.getTipoLog() == TipoLog.CADASTRO_EVENTO) { // SE O TIPO DA LOG FOR CADASTRO_EVENTO
	
			log.setDescricao("O Administrador " + claims.get("nome") + " Cadastrou um novo evento");
	
		} else if (log.getTipoLog() == TipoLog.ALTERAR) { // SE O TIPO DA LOG FOR ALTERAR
	
			Nivel nivel = Nivel.values()[Integer.parseInt(claims.get("nivel").toString())];
			
			if (nivel == Nivel.ADMINISTRADOR) {
	
				log.setDescricao("O Administrador" + claims.get("nome") + " alterou os dados do usuario" + usuario.getNome());
			}
			
			log.setDescricao("Usuario " + claims.get("nome") + " alterou seus dados");
		}
	
		log.setLogData(Calendar.getInstance());
	
		logRep.save(log);
	
		return true;
		

		

	}
  
	public boolean salvarLogAgendamento(Usuario usuario, Agendamento agendamento, TipoLog tipoLog,
			HttpServletRequest request) {

		// INSTANCIANDO A LOG
		Log log = new Log(usuario,tipoLog,agendamento);
		


		if (log.getTipoLog() == TipoLog.AGENDAMENTO) {// SE O TIPO DA LOG FOR AGENDAMENTO(CRIANDO UM AGENDAMENTO)

			log.setDescricao("O Usuario " + usuario.getNome() + " criou o agendamento " + agendamento.getTitulo());

		} else if (log.getTipoLog() == TipoLog.ALTERAR) {//SE O TIPO DA LOG FOR ALTERAR AGENDAMENTO

			log.setDescricao(
					"O Usuario " + usuario.getNome() + " alterou o agendamento " + agendamento.getTitulo());
		} else if (log.getTipoLog() == TipoLog.ALTERACAO_STATUS) {// SE O TIPO DA LOG FOR ALTERAR STATUS

			String nomeAdm = (String) request.getAttribute("nome");
			log.setDescricao(
					"O Administrador " + nomeAdm + " alterou o status do agendamento " + agendamento.getTitulo());
		} else if (log.getTipoLog() == TipoLog.DELETAR) { // SE O TIPO DA LOG FOR DELETAR AGENDAMENTO

			if (usuario.getNivel() == Nivel.ADMINISTRADOR) {

				log.setDescricao("O Administrador " + usuario.getNome() + " deletou o agendamento"
						+ agendamento.getTitulo());
			}
			log.setDescricao("O Usuario " + usuario.getNome() + " deletou o agendamento" + agendamento.getTitulo());
		}

		log.setLogData(Calendar.getInstance());

		logRep.save(log);

		return true;




	}
	
	
	public boolean salvarLogTipo(TipoEvento tipoEvento, TipoLog tipoLog,HttpServletRequest request) {

		
		// VARIAVEL PARA O TOKEN
		String token;
		
		// RECUPERA O TOKEN
		token = request.getHeader("Authorization");
		
		// BUSCANDO O ALGORITMO NO USUARIO 
		Algorithm algoritmo = Algorithm.HMAC512(UsuarioRestController.SECRET);
		
		// OBJ PARA VERIFICAR O TOKEN
		JWTVerifier verifier = JWT.require(algoritmo).withIssuer(UsuarioRestController.EMISSOR).build();
		
		// DECODIFICA O TOKEN
		DecodedJWT jwt = verifier.verify(token);
		
		// RECUPERA OS DADOS DO PLAYLOAD (CLAIMS SÃO VALORES QUE VEM NO PLAYLOAD)
		Map<String, Claim> claims = jwt.getClaims();
		
		// INSTANCIANDO A LOG
		Log log = new Log(tipoLog,tipoEvento);

		

		if (log.getTipoLog() == TipoLog.CADASTRO_EVENTO) {// SE O TIPO DA LOG FOR AGENDAMENTO(CRIANDO UM AGENDAMENTO)

			log.setDescricao("O Administrador " + claims.get("nome") + " criou um novo tipo de evento " + tipoEvento.getNome());

		} else if (log.getTipoLog() == TipoLog.ALTERAR) {//SE O TIPO DA LOG FOR ALTERAR AGENDAMENTO

			log.setDescricao("O Administrador " + claims.get("nome") + " alterou o tipo de evento " + tipoEvento.getNome());
			
		} else if (log.getTipoLog() == TipoLog.DELETAR) { // SE O TIPO DA LOG FOR DELETAR AGENDAMENTO

				log.setDescricao("O Administrador " + claims.get("nome") + " deletou o agendamento"+ tipoEvento.getNome());
		}

		log.setLogData(Calendar.getInstance());
		logRep.save(log);

		return true;
		

	}


}

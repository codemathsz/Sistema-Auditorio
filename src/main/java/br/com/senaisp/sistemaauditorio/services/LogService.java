package br.com.senaisp.sistemaauditorio.services;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.senaisp.sistemaauditorio.model.Agendamento;
import br.com.senaisp.sistemaauditorio.model.Log;
import br.com.senaisp.sistemaauditorio.model.Nivel;
import br.com.senaisp.sistemaauditorio.model.TipoLog;
import br.com.senaisp.sistemaauditorio.model.Usuario;
import br.com.senaisp.sistemaauditorio.repository.LogRepository;

@Service
public class LogService {

	@Autowired
	private LogRepository logRep;

	public boolean salvarLogUsuario(Usuario usuario, TipoLog tipoLog, HttpServletRequest request) {

		// INSTANCIANDO A LOG
		Log log = new Log(usuario, tipoLog);
		// VARIAVEL NIVEL PARA COMPARAR O NIVEL DO USUARIO
		Nivel nivel = null;
		
		
		// SE O TIPO DA LOG FOR LOGAR
		if (log.getTipoLog() == TipoLog.LOGAR) {
	
			log.setDescricao("Usuario " + usuario.getNome() + " logou");
	
		} else if (log.getTipoLog() == TipoLog.CADASTRO_USUARIO) { // SE O TIPO DA LOG FOR CADASTRO_USUARIO
	
			log.setDescricao("O Usuario " + usuario.getNome() + " se cadastrou ");
	
		} else if (log.getTipoLog() == TipoLog.CADASTRO_EVENTO) { // SE O TIPO DA LOG FOR CADASTRO_EVENTO
	
			log.setDescricao("O Administrador " + usuario.getNome() + " Cadastrou um novo evento");
	
		} else if (log.getTipoLog() == TipoLog.ALTERAR) { // SE O TIPO DA LOG FOR ALTERAR
	
			String nomeAdm = (String) request.getAttribute("nome");
			if (usuario.getNivel() == Nivel.ADMINISTRADOR) {
	
				log.setDescricao("O Administrador" + nomeAdm + " alterou os dados do usuario" + usuario.getNome());
			}
			log.setDescricao("Usuario " + usuario.getNome() + " alterou");
		}
	
		log.setLogData(Calendar.getInstance());
	
		logRep.save(log);
	
		return true;
		

		

	}

	public boolean salvarLogAgendamento(Usuario usuario, Agendamento agendamento, TipoLog tipoLog,
			HttpServletRequest request) {

		// INSTANCIANDO A LOG
		Log log = new Log(usuario,tipoLog,agendamento);
		// VARIAVEL NIVEL PARA COMPARAR O NIVEL DO USUARIO
		Nivel nivel = null;
		

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

}

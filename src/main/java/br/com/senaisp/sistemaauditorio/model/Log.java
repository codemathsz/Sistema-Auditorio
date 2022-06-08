package br.com.senaisp.sistemaauditorio.model;

import java.util.Calendar;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.Data;

@Data
@Entity
public class Log {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Calendar logData;
	
	@Column(columnDefinition = "TEXT")
	private String descricao;
	
	@ManyToOne
	private Usuario usuario;
	
	@ManyToOne(cascade = CascadeType.ALL)
	private Agendamento agendamento;

	private TipoLog tipoLog;
	
	@ManyToOne(cascade = CascadeType.ALL)
	private TipoEvento tipoEvento;
	
	public Log(Usuario usuario,TipoLog tipoLog) {
		
		this.usuario = usuario;
		this.tipoLog = tipoLog;
	}
	
	public Log(TipoLog tipoLog, Agendamento agendamento) {
		
		this.agendamento = agendamento;

		this.tipoLog = tipoLog;
	}
	
	public Log( TipoLog tipoLog, TipoEvento tipoEvento) {
		
		this.tipoEvento = tipoEvento;
		this.tipoLog = tipoLog;
	}
}

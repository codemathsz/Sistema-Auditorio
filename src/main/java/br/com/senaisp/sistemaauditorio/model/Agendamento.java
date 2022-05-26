package br.com.senaisp.sistemaauditorio.model;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Entity
public class Agendamento {
	
	//aplicando o pull request

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull(message = "{agendamento.titulo.null}")
	@JsonProperty("title")
	private String titulo;
	
	@NotNull
	@Column(columnDefinition = "TEXT")
	private String descricao;
	
	@JsonProperty("start")
	@NotNull(message = "{agendamento.dataInicio.null}")
	private Calendar dataInicio;
	
	@JsonProperty("end")
	@NotNull(message = "{agendamento.dataFinalizada.null}")
	private Calendar dataFinalizada;
	
	private Status status;
	
	private Periodo periodo;
	@OneToOne
	private TipoEvento tipo;
	@ManyToOne
	private Usuario usuario;
	
	// METODO QUE FORMATA A DATA INICIO DO AGENDAMENTO NO PADRÃO dd/MM/yyyy
	public String getDataInicioFormat() {
		
		SimpleDateFormat formatador = new SimpleDateFormat("yyyy-MM-dd");
		return formatador.format(this.getDataInicio().getTimeInMillis());
		
	}
	
	// METODO QUE FORMATA A DATA FINALIZADA DO AGENDAMENTO NO PADRÃO dd/MM/yyyy
	public String getDataFinalizadaFormat() {
		
		SimpleDateFormat formatador = new SimpleDateFormat("yyyy-MM-dd");
		return formatador.format(this.getDataFinalizada().getTimeInMillis());
		
	}
	
	// METODO QUE FORMATA A HORA INICIO DO AGENDAMENTO 
	public String getHoraInicio() {
		SimpleDateFormat formatador = new SimpleDateFormat("HH:mm");
		return formatador.format(this.getDataFinalizada().getTime());
	}
		
	// METODO QUE FORMATA A HORA FINALIZADA DO AGENDAMENTO
	public String getHoraFinalizada() {
		SimpleDateFormat formatador = new SimpleDateFormat("HH:mm");
		return formatador.format(this.getDataFinalizada().getTime());
	}
	
}

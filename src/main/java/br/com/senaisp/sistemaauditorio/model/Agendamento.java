package br.com.senaisp.sistemaauditorio.model;

import java.util.Calendar;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Entity
public class Agendamento {
	
	//aplicando o pull request

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	@JsonProperty("title")
	private String titulo;
	
	@NotEmpty
	@Column(columnDefinition = "TEXT")
	private String descricao;
	
	@JsonProperty("start")
	@NotNull
	private Calendar dataInicio;
	
	@NotNull
	private Calendar dataFinalizada;
	
	@NotNull
	private String horaInicio;
	
	@NotNull
	private String horaFinalizada;
	
	private Status status;
	
	private Periodo periodo;
	@OneToOne
	private TipoEvento tipo;
	@ManyToOne
	private Usuario usuario;
	
	
	

	
}

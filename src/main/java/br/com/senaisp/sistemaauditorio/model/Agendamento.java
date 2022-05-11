package br.com.senaisp.sistemaauditorio.model;

import java.util.Calendar;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
@Entity
public class Agendamento {
	
	//aplicando o pull request

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty
	private String titulo;
	
	@NotEmpty
	@Column(columnDefinition = "TEXT")
	private String descricao;
	
	@NotNull
	@JsonFormat(pattern = "dd/MM/yyyy")//para formatar o jeito que a data sera exibida
	private Calendar dataInicio;
	
	@NotNull
	@JsonFormat(pattern = "dd/MM/yyyy")//para formatar o jeito que a data sera exibida
	private Calendar dataFinalizada;
	
	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss", timezone="GMT-3")
	private Calendar horaInicio;
	
	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss", timezone="GMT-3")
	private Calendar horaFinalizada;
	
	private String status;
	
	private String periodo;
	
	
	//Faltando o tipo e o ligamento com o Usuario
	//private Usuario usuario;
	//private TipoUsuario tipo;
	
	//teste 2 rell
}

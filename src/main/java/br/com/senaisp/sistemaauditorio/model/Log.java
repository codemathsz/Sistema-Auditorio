package br.com.senaisp.sistemaauditorio.model;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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

	private TipoLog tipoLog;

	private Usuario usuarioNome;
	
	private Usuario idUsuario;
	
	

}
package br.com.senaisp.sistemaauditorio.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Data;

@Data
@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NotEmpty
	private String nome;
	@Column(unique = true)
	@Email
	@NotEmpty
	private String email;
	@Column(unique = true)
	@NotEmpty
	private String nif;
	@NotEmpty
	@JsonProperty(access = Access.WRITE_ONLY)// PARA NÃO MOSTRAR NO GET(JSON)
	private String senha;
	@NotEmpty
	private String nivel;
}

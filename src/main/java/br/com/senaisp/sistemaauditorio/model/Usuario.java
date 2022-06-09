package br.com.senaisp.sistemaauditorio.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import br.com.senaisp.sistemaauditorio.util.HashUtil;
import lombok.Data;

@Data
@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NotNull(message = "{usuario.nome.null}")
	private String nome;
	@Column(unique = true)
	@Email
	@NotNull(message = "{usuario.email.null}")
	private String email;
	@Column(unique = true)
	@NotNull(message = "{usuario.nif.null}")
	private String nif;
	@NotNull(message = "{usuario.senha.null}")
	@JsonProperty(access = Access.WRITE_ONLY)// PARA NÃO MOSTRAR NO GET(JSON)
	private String senha;
	@NotNull(message = "{usuario.nivel.null}")
	private Nivel nivel;
	private boolean ativo;
	
	
	// MÉTODO SET QUE APLICA O HASH NA SENHA
	public void setSenha(String senha) {
		
		this.senha = (HashUtil.hash(senha));
	}
	

}

package br.com.senaisp.sistemaauditorio.model;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class Sucesso {

	private HttpStatus statusCode;
	private String mensagem;
	
	public Sucesso(HttpStatus status, String msg) {
		
		this.statusCode = status;
		this.mensagem = msg;
	}
}

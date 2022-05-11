package br.com.senaisp.sistemaauditorio.model;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class Erro {

	private HttpStatus statusCode;
	private String mensagem;
	private String exception;
	
	public Erro(HttpStatus status, String msg, String exception ) {
		this.statusCode = status;
		this.mensagem = msg;
		this.exception = exception;
	}
}

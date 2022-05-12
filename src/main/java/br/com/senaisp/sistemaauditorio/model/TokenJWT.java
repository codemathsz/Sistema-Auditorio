package br.com.senaisp.sistemaauditorio.model;

import lombok.Data;

//CRIANDO ESSA CLASSE PARA MANDAR O TOKEN EM FORMATO JSON
@Data
public class TokenJWT {

	private String token;
	
}
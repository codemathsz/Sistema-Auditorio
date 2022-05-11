package br.com.senaisp.sistemaauditorio.util;

import java.nio.charset.StandardCharsets;

import com.google.common.hash.Hashing;


public class HashUtil {

	public static String hash(String palavra) {
		
		// "TEMPERO" DO HASH
		String salt = "Au!dt0rio@salt";
				
		// ADD "TEMPERO" A PALAVRA
		palavra = salt + palavra;
		
		//GERAR O HASH
		String hash = Hashing.sha512().hashString(palavra, StandardCharsets.UTF_8).toString();
		// RETORNA O HASH GERADO
		return hash;
	}
}

package br.com.senaisp.sistemaauditorio.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.senaisp.sistemaauditorio.model.Log;
import br.com.senaisp.sistemaauditorio.repository.LogRepository;

@CrossOrigin
@RestController
@RequestMapping("/api/log")
public class LogRestController {
	
	@Autowired
	private LogRepository repository;
	
	
	@RequestMapping(value = "", method = RequestMethod.GET)
	public Iterable<Log> listar(Log log){
		
		return repository.findAll();
	}

}

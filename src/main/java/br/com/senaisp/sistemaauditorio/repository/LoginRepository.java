package br.com.senaisp.sistemaauditorio.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.Login;

@Repository
public interface LoginRepository extends PagingAndSortingRepository<Login, Long>{

	

}
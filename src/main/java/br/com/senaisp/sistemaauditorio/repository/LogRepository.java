package br.com.senaisp.sistemaauditorio.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.com.senaisp.sistemaauditorio.model.Log;

@Repository
public interface LogRepository extends PagingAndSortingRepository<Log, Long>{

}
